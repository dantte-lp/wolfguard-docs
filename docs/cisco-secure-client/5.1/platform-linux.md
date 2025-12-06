---
title: Linux Platform-Specific Features
sidebar_position: 3
---

# Linux Platform-Specific Implementation

This document describes Linux-specific features, system integration, and implementation details for Cisco Secure Client 5.1.12.146.

## Platform Support

### Architectures

| Architecture | Binary Count | Total Size | Status |
|--------------|--------------|------------|--------|
| **x86-64** | 97 binaries | ~400 MB | Fully supported |
| **ARM64 (aarch64)** | 91 binaries | ~380 MB | Fully supported |

### Linux Distribution Support

Cisco Secure Client 5.1.12.146 supports major Linux distributions:

- Red Hat Enterprise Linux (RHEL) 7+, 8+, 9+
- CentOS 7+, 8+
- Ubuntu 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS
- Debian 10+, 11+, 12+
- SUSE Linux Enterprise (SLES) 12+, 15+
- Oracle Linux 7+, 8+, 9+, 10+

**Kernel Requirements**: Linux 3.2.0+ (as indicated by ELF binary metadata)

## TUN/TAP Device Management

### Device Creation

The `vpnagentd` daemon creates a TUN device for tunneling IP packets.

**Device Name**: `cscotun0` (default)

### Implementation Analysis

Based on binary analysis and Linux TUN/TAP conventions, the implementation follows this pattern:

```c
#include <linux/if.h>
#include <linux/if_tun.h>
#include <fcntl.h>
#include <sys/ioctl.h>

// Inferred from vpnagentd implementation
int create_tun_device(const char *dev_name) {
    int fd, err;
    struct ifreq ifr;

    // Open TUN/TAP device
    if ((fd = open("/dev/net/tun", O_RDWR)) < 0) {
        return -1;
    }

    memset(&ifr, 0, sizeof(ifr));

    // Set device to TUN mode (IP packets)
    ifr.ifr_flags = IFF_TUN | IFF_NO_PI;

    // Set device name
    strncpy(ifr.ifr_name, dev_name, IFNAMSIZ);

    // Create device
    if ((err = ioctl(fd, TUNSETIFF, (void *)&ifr)) < 0) {
        close(fd);
        return err;
    }

    return fd;
}
```

### Device Configuration

After creating the TUN device, `vpnagentd` configures it with IP address, netmask, and MTU:

```c
// Pseudo-code inferred from binary behavior
int configure_tun_device(const char *dev_name,
                         const char *ip_address,
                         const char *netmask,
                         int mtu) {
    struct ifreq ifr;
    int sockfd;

    sockfd = socket(AF_INET, SOCK_DGRAM, 0);

    // Set IP address
    strncpy(ifr.ifr_name, dev_name, IFNAMSIZ);
    struct sockaddr_in *addr = (struct sockaddr_in *)&ifr.ifr_addr;
    addr->sin_family = AF_INET;
    inet_pton(AF_INET, ip_address, &addr->sin_addr);
    ioctl(sockfd, SIOCSIFADDR, &ifr);

    // Set netmask
    inet_pton(AF_INET, netmask, &addr->sin_addr);
    ioctl(sockfd, SIOCSIFNETMASK, &ifr);

    // Set MTU
    ifr.ifr_mtu = mtu;
    ioctl(sockfd, SIOCSIFMTU, &ifr);

    // Bring interface up
    ifr.ifr_flags |= IFF_UP | IFF_RUNNING;
    ioctl(sockfd, SIOCSIFFLAGS, &ifr);

    close(sockfd);
    return 0;
}
```

## Network Architecture

```kroki type=nwdiag
{
  network physical_interface {
    address = "10.0.0.0/24"

    eth0 [address = "10.0.0.100", description = "Physical interface\n(eth0/wlan0)"];
    gateway [address = "10.0.0.1", description = "Default gateway"];
  }

  network vpn_client {
    vpnagentd [description = "vpnagentd daemon\nListens on TUN"];
  }

  network tun_interface {
    address = "192.168.100.0/24"

    cscotun0 [address = "192.168.100.2", description = "TUN device\n(cscotun0)"];
    vpnagentd [address = "192.168.100.1"];
  }

  network internet {
    gateway;
    vpn_server [address = "203.0.113.1", description = "VPN server"];
  }

  network vpn_internal {
    address = "192.168.50.0/24"

    vpn_server [address = "192.168.50.1"];
    internal_servers [address = "192.168.50.0/24", description = "Internal resources"];
  }
}
```

## Routing Configuration

### Route Management

`vpnagentd` uses **netlink** sockets to manipulate the routing table:

```c
#include <linux/rtnetlink.h>

// Inferred routing function
int add_vpn_route(const char *dest_network, const char *dest_mask,
                  const char *gateway, const char *device) {
    // Uses rtnetlink (NETLINK_ROUTE) to add route
    // Equivalent to: ip route add <dest>/<mask> via <gateway> dev <device>

    int sockfd = socket(AF_NETLINK, SOCK_RAW, NETLINK_ROUTE);

    struct {
        struct nlmsghdr nlh;
        struct rtmsg rtm;
        char buf[1024];
    } req;

    memset(&req, 0, sizeof(req));

    req.nlh.nlmsg_len = NLMSG_LENGTH(sizeof(struct rtmsg));
    req.nlh.nlmsg_type = RTM_NEWROUTE;
    req.nlh.nlmsg_flags = NLM_F_REQUEST | NLM_F_CREATE | NLM_F_EXCL;

    req.rtm.rtm_family = AF_INET;
    req.rtm.rtm_table = RT_TABLE_MAIN;
    req.rtm.rtm_protocol = RTPROT_BOOT;
    req.rtm.rtm_scope = RT_SCOPE_UNIVERSE;
    req.rtm.rtm_type = RTN_UNICAST;

    // Add RTA attributes for destination, gateway, and device
    // ...

    send(sockfd, &req, req.nlh.nlmsg_len, 0);
    close(sockfd);
    return 0;
}
```

### Split Tunneling

When split tunneling is enabled, only specific routes are sent through the VPN:

```bash
# Example routing table with split tunneling
$ ip route show
default via 10.0.0.1 dev eth0
10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.100
192.168.50.0/24 via 192.168.100.1 dev cscotun0    # VPN route
172.16.0.0/16 via 192.168.100.1 dev cscotun0      # VPN route
192.168.100.0/24 dev cscotun0 proto kernel scope link src 192.168.100.2
203.0.113.1 via 10.0.0.1 dev eth0                  # VPN server route
```

## DNS Configuration

### systemd-resolved Integration

On systemd-based distributions, `vpnagentd` integrates with **systemd-resolved** via D-Bus:

```c
// Pseudo-code: D-Bus call to systemd-resolved
void set_vpn_dns_servers(const char **dns_servers, int count) {
    // Uses org.freedesktop.resolve1 D-Bus interface
    // Method: SetLinkDNS

    GDBusConnection *connection = g_bus_get_sync(G_BUS_TYPE_SYSTEM, NULL, NULL);

    GVariantBuilder *builder = g_variant_builder_new(G_VARIANT_TYPE("a(iay)"));
    for (int i = 0; i < count; i++) {
        struct in_addr addr;
        inet_pton(AF_INET, dns_servers[i], &addr);

        // Add DNS server to builder
        g_variant_builder_add(builder, "(iay)",
                              AF_INET,
                              g_variant_new_fixed_array(G_VARIANT_TYPE_BYTE,
                                                        &addr.s_addr, 4, 1));
    }

    // Call SetLinkDNS method
    g_dbus_connection_call_sync(connection,
                                "org.freedesktop.resolve1",
                                "/org/freedesktop/resolve1",
                                "org.freedesktop.resolve1.Manager",
                                "SetLinkDNS",
                                g_variant_new("(ia(iay))", tun_ifindex, builder),
                                NULL, G_DBUS_CALL_FLAGS_NONE, -1, NULL, NULL);
}
```

**Evidence**: `vpnagentd` links against `libgio-2.0.so.0` and `libglib-2.0.so.0` for D-Bus communication.

### Legacy DNS Configuration

On non-systemd systems, DNS is configured via `/etc/resolv.conf`:

```bash
# Original resolv.conf backed up
$ cat /etc/resolv.conf
# Generated by Cisco Secure Client
nameserver 8.8.8.8
nameserver 8.8.4.4
```

## systemd Integration

### Service Unit

**File**: `/etc/systemd/system/vpnagentd.service` (from package)

```ini
[Unit]
Description=Cisco Secure Client VPN Agent
After=network-online.target
Wants=network-online.target

[Service]
Type=forking
ExecStart=/opt/cisco/secureclient/bin/vpnagentd
ExecStop=/usr/bin/killall vpnagentd
Restart=on-failure
RestartSec=5
KillMode=process

[Install]
WantedBy=multi-user.target
```

### Service Management

```bash
# Start service
$ sudo systemctl start vpnagentd

# Enable on boot
$ sudo systemctl enable vpnagentd

# Check status
$ sudo systemctl status vpnagentd
● vpnagentd.service - Cisco Secure Client VPN Agent
   Loaded: loaded (/etc/systemd/system/vpnagentd.service; enabled)
   Active: active (running) since Wed 2025-10-30 10:00:00 UTC
   Main PID: 12345 (vpnagentd)
```

## D-Bus Communication

### Interface Specification

`vpnagentd` exposes a D-Bus interface for IPC:

**Service Name**: `com.cisco.secureclient.vpnagentd`
**Object Path**: `/com/cisco/secureclient/VPNAgent`
**Interface**: `com.cisco.secureclient.VPNAgent`

**Methods** (inferred):
- `Connect(String profile_name) → Boolean`
- `Disconnect() → Boolean`
- `GetStatus() → (String state, Dictionary info)`
- `GetStatistics() → Dictionary`

**Signals**:
- `StateChanged(String new_state, String reason)`
- `ConnectionEstablished(Dictionary info)`
- `ConnectionLost(String reason)`

### Example D-Bus Call

```bash
# Query VPN status via D-Bus
$ busctl call com.cisco.secureclient.vpnagentd \
    /com/cisco/secureclient/VPNAgent \
    com.cisco.secureclient.VPNAgent \
    GetStatus

# Expected output: (state, info)
s "Connected"
a{sv} {
    "server" s "vpn.example.com"
    "address" s "192.168.50.10"
    "duration" t 3600
}
```

## User Interface Integration

### GTK-Based UI

**Binary**: `vpnui` (718 KB)

**Dependencies**:
```
libgtk-3.so.0
libgdk-3.so.0
libcairo.so.2
libpango-1.0.so.0
```

**Glade UI Definition**: `resources/cvcgui-gtk.glade` (160 KB)

### UI Screenshot Reference

```
┌─────────────────────────────────────────┐
│ Cisco Secure Client                  ×  │
├─────────────────────────────────────────┤
│  Status: Connected                      │
│  Server: vpn.example.com                │
│  Address: 192.168.50.10                 │
│  Duration: 01:23:45                     │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ [Disconnect]                      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Statistics:                            │
│    Bytes Sent: 1.2 GB                   │
│    Bytes Received: 3.4 GB               │
│                                         │
└─────────────────────────────────────────┘
```

## CLI Interface

### vpn Command

**Binary**: `vpn` (144 KB)

**Usage**:
```bash
# Connect to VPN
$ /opt/cisco/secureclient/bin/vpn connect vpn.example.com
>> state: Connecting
>> state: Connected

# Disconnect
$ /opt/cisco/secureclient/bin/vpn disconnect
>> state: Disconnecting
>> state: Disconnected

# Get status
$ /opt/cisco/secureclient/bin/vpn status
>> state: Connected
>> server: vpn.example.com
>> address: 192.168.50.10

# Get statistics
$ /opt/cisco/secureclient/bin/vpn stats
>> Bytes Tx: 1234567890
>> Bytes Rx: 9876543210
```

## Package Management

### Installation Script

**Script**: `vpn_install.sh` (7.7 KB)

**Actions**:
1. Check root privileges
2. Check dependencies (libxml2, libssl, etc.)
3. Copy binaries to `/opt/cisco/secureclient/`
4. Create symbolic links in `/usr/bin/`
5. Install systemd service unit
6. Create log directory `/var/log/cisco/secureclient/`
7. Set permissions and capabilities
8. Enable and start `vpnagentd` service

### Uninstallation Script

**Script**: `vpn_uninstall.sh` (7.7 KB)

**Actions**:
1. Stop `vpnagentd` service
2. Disable systemd service
3. Remove binaries from `/opt/cisco/secureclient/`
4. Remove symbolic links
5. Remove systemd service unit
6. Optionally remove logs and config

## Logging

### Log Files

**Main Log**: `/var/log/cisco/secureclient/vpnagentd.log`

**Log Rotation**: Uses `logrotate`

**Sample Log Entry**:
```
2025-10-30 10:00:00.123 [INFO] [vpnagentd] Starting Cisco Secure Client VPN Agent
2025-10-30 10:00:00.234 [INFO] [vpnagentd] Loaded profile: vpn.example.com
2025-10-30 10:00:01.345 [INFO] [vpnagentd] TUN device cscotun0 created
2025-10-30 10:00:02.456 [INFO] [vpnagentd] TLS 1.3 handshake successful
2025-10-30 10:00:03.567 [INFO] [vpnagentd] CSTP tunnel established
2025-10-30 10:00:04.678 [INFO] [vpnagentd] DTLS tunnel established
2025-10-30 10:00:05.789 [INFO] [vpnagentd] VPN connection established
```

## Security Features

### Capabilities

`vpnagentd` requires the following Linux capabilities:

```bash
$ getcap /opt/cisco/secureclient/bin/vpnagentd
/opt/cisco/secureclient/bin/vpnagentd = cap_net_admin,cap_net_raw+eip
```

**Capabilities**:
- `CAP_NET_ADMIN` - Create TUN device, modify routing table
- `CAP_NET_RAW` - Raw socket access for DTLS

### SELinux Integration

On SELinux-enabled systems (RHEL, CentOS, Fedora, Oracle Linux):

**Policy Module**: `cisco-secureclient.pp`

**Contexts**:
```bash
$ ls -Z /opt/cisco/secureclient/bin/vpnagentd
system_u:object_r:vpnagentd_exec_t:s0 /opt/cisco/secureclient/bin/vpnagentd
```

### AppArmor Integration

On AppArmor-enabled systems (Ubuntu, Debian, SUSE):

**Profile**: `/etc/apparmor.d/opt.cisco.secureclient.bin.vpnagentd`

```
#include <tunables/global>

/opt/cisco/secureclient/bin/vpnagentd {
  #include <abstractions/base>
  #include <abstractions/nameservice>

  capability net_admin,
  capability net_raw,

  network inet stream,
  network inet dgram,

  /dev/net/tun rw,
  /proc/sys/net/ipv4/** rw,
  /opt/cisco/secureclient/** r,
  /var/log/cisco/secureclient/** rw,
}
```

## Performance Tuning

### Kernel Parameters

For optimal VPN performance, adjust these parameters:

```bash
# /etc/sysctl.d/99-cisco-vpn.conf
net.core.rmem_max = 26214400
net.core.wmem_max = 26214400
net.ipv4.tcp_rmem = 4096 87380 26214400
net.ipv4.tcp_wmem = 4096 65536 26214400
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_timestamps = 1
net.ipv4.tcp_sack = 1
```

Apply with:
```bash
$ sudo sysctl -p /etc/sysctl.d/99-cisco-vpn.conf
```

## Troubleshooting

### Common Issues

#### 1. TUN Device Creation Fails

**Symptom**: `Failed to create TUN device`

**Solution**:
```bash
# Check if TUN module is loaded
$ lsmod | grep tun
# If not, load it
$ sudo modprobe tun

# Verify /dev/net/tun exists
$ ls -l /dev/net/tun
crw-rw-rw- 1 root root 10, 200 Oct 30 10:00 /dev/net/tun
```

#### 2. DNS Resolution Not Working

**Symptom**: Cannot resolve hostnames through VPN

**Solution**:
```bash
# Check systemd-resolved status
$ systemctl status systemd-resolved

# Check DNS configuration
$ resolvectl status

# Restart vpnagentd
$ sudo systemctl restart vpnagentd
```

#### 3. Routing Issues

**Symptom**: Cannot reach VPN network

**Solution**:
```bash
# Check routing table
$ ip route show

# Verify VPN routes are present
$ ip route show dev cscotun0

# Check TUN interface status
$ ip addr show cscotun0
```

## Architecture Diagram

```kroki type=blockdiag
{
  orientation = portrait;

  // User space
  group {
    label = "User Space";
    color = "lightblue";

    vpnui [label = "vpnui\n(GTK UI)", shape = "box"];
    vpn_cli [label = "vpn\n(CLI)", shape = "box"];
  }

  // Daemon
  group {
    label = "System Daemon";
    color = "lightgreen";

    vpnagentd [label = "vpnagentd\n(systemd service)"];
  }

  // System integration
  group {
    label = "System Integration";
    color = "orange";

    dbus [label = "D-Bus\n(IPC)"];
    systemd_resolved [label = "systemd-resolved\n(DNS)"];
    netlink [label = "netlink\n(routing)"];
  }

  // Kernel
  group {
    label = "Linux Kernel";
    color = "pink";

    tun_device [label = "/dev/net/tun\n(cscotun0)"];
    routing [label = "Routing\nTable"];
  }

  // Connections
  vpnui -> dbus;
  vpn_cli -> dbus;
  dbus -> vpnagentd;

  vpnagentd -> systemd_resolved [label = "SetLinkDNS"];
  vpnagentd -> netlink [label = "RTM_NEWROUTE"];
  vpnagentd -> tun_device [label = "read/write"];

  netlink -> routing;
}
```

## Summary

Linux platform support in Cisco Secure Client 5.1.12.146:

✅ **TUN/TAP** device management (cscotun0)
✅ **systemd** integration (service units, D-Bus)
✅ **netlink** routing configuration
✅ **systemd-resolved** DNS integration
✅ **GTK 3** graphical user interface
✅ **CLI** interface for automation
✅ **SELinux** and **AppArmor** security policies
✅ **x86-64** and **ARM64** architecture support

---

**Next**: [Windows Platform-Specific Features](./platform-windows)

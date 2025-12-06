---
sidebar_position: 4
title: First Connection
---

# First Connection

Step-by-step guide to connecting your first client to WolfGuard VPN server.

## Prerequisites

Before connecting, ensure:

- ✅ WolfGuard server is installed and running
- ✅ Certificates are configured
- ✅ User account is created
- ✅ Firewall allows TCP/UDP 443

If you haven't set up the server yet, see [Quick Start Guide](./quick-start).

## Choose Your Client

WolfGuard supports multiple clients:

| Client | Platform | Type | Recommended For |
|--------|----------|------|----------------|
| **Cisco Secure Client** | Windows, macOS, Linux, iOS, Android | Official | Enterprise users |
| **OpenConnect** | Linux, *BSD | CLI | Linux users, automation |
| **NetworkManager** | Linux Desktop | GUI | Linux desktop users |

## Cisco Secure Client

### Download and Install

1. **Download** from [Cisco Downloads](https://software.cisco.com/download/home) or your organization
2. **Install** appropriate version for your OS:
   - Windows: Run `.msi` installer
   - macOS: Run `.pkg` installer
   - Linux: Install `.deb` or `.rpm` package
   - Mobile: Install from App Store or Play Store

### Configure Connection

#### Windows / macOS

1. **Launch** Cisco Secure Client
2. **Click** connection field or "Add" button
3. **Enter server**: `vpn.example.com` (your server hostname)
4. **Click** "Connect"
5. **Accept certificate** (if self-signed)
6. **Enter credentials**:
   - Username: `your-username`
   - Password: `your-password`
7. **Click** "OK"

#### Linux

```bash
# Command-line connection
/opt/cisco/secureclient/bin/vpn connect vpn.example.com

# Enter credentials when prompted
```

#### Mobile (iOS/Android)

1. **Open** Cisco Secure Client app
2. **Tap** "Add VPN Connection"
3. **Enter**:
   - Description: `Work VPN` (or any name)
   - Server Address: `vpn.example.com`
4. **Save**
5. **Tap** connection to connect
6. **Enter** username and password

### Verify Connection

After connecting successfully:

```bash
# Windows (PowerShell)
ipconfig
# Look for "VPN Connection" adapter

# macOS/Linux
ifconfig
# Look for vpn or tun interface

# Check IP
curl https://api.ipify.org
```

## OpenConnect CLI

### Install OpenConnect

**Ubuntu/Debian**:
```bash
sudo apt install openconnect
```

**RHEL/Rocky**:
```bash
sudo dnf install openconnect
```

**macOS** (Homebrew):
```bash
brew install openconnect
```

### Connect

```bash
# Basic connection
sudo openconnect vpn.example.com -u your-username

# With password from file (for automation)
echo "your-password" | sudo openconnect vpn.example.com -u your-username --passwd-on-stdin

# With specific protocol
sudo openconnect --protocol=anyconnect vpn.example.com -u your-username

# In background
sudo openconnect vpn.example.com -u your-username -b
```

### Disconnect

```bash
# Find OpenConnect process
ps aux | grep openconnect

# Kill process
sudo killall openconnect

# Or use PID
sudo kill <pid>
```

## NetworkManager (Linux Desktop)

### Install Plugin

**Ubuntu/Debian**:
```bash
sudo apt install network-manager-openconnect-gnome
```

**Fedora/RHEL**:
```bash
sudo dnf install NetworkManager-openconnect-gnome
```

### Add VPN Connection

1. **Open** Settings → Network
2. **Click** "+" to add VPN connection
3. **Select** "Multi-protocol VPN client (openconnect)" or "Cisco AnyConnect Compatible VPN"
4. **Configure**:
   - Name: `Work VPN`
   - Gateway: `vpn.example.com`
   - Username: `your-username`
5. **Save**

### Connect

1. **Click** VPN toggle in system tray
2. **Select** your VPN connection
3. **Enter password** when prompted

## Advanced Configuration

### Save Password

#### Cisco Secure Client

**Windows/macOS**:
- Settings → Preferences → Enable "Password"  Save"

**Note**: This stores password encrypted on local machine

#### OpenConnect with NetworkManager

1. Edit VPN connection
2. Check "Store password for this user only" or "Store password for all users"

### Certificate-Based Authentication

Instead of username/password, use client certificates:

```bash
# OpenConnect with client certificate
sudo openconnect vpn.example.com \
  --certificate=/path/to/client-cert.pem \
  --sslkey=/path/to/client-key.pem
```

See [Certificate Authentication](/docs/administration/users/authentication#certificate-authentication).

### Two-Factor Authentication

If 2FA is enabled:

1. **Connect** normally
2. **Enter** username and password
3. **Enter** OTP code when prompted (from authenticator app)

See [Two-Factor Authentication](/docs/administration/users/two-factor-auth).

## Troubleshooting

### Cannot Connect

**Check server is reachable**:
```bash
# Test TCP connection
nc -zv vpn.example.com 443

# Test HTTPS
curl -I https://vpn.example.com
```

**Check certificate**:
```bash
# View server certificate
openssl s_client -connect vpn.example.com:443 -showcerts
```

**Check logs** (server side):
```bash
sudo journalctl -u wolfguard -f
```

### Certificate Error

**Problem**: "Certificate verification failed" or "Untrusted certificate"

**Solution**:
- **Self-signed cert**: Accept/trust certificate in client
- **Production**: Use proper PKI or Let's Encrypt
- **OpenConnect**: Use `--no-cert-check` (testing only)

### Authentication Failed

**Problem**: "Login failed" or "Invalid credentials"

**Solution**:
```bash
# Verify user exists (server)
sudo wolfguard-ctl users

# Check password file
sudo cat /etc/wolfguard/passwd

# Test authentication (server)
sudo wolfguard-test-auth username password
```

### Connected But No Internet

**Problem**: VPN connects but cannot access internet/resources

**Solution** (server side):
```bash
# Check IP forwarding
sysctl net.ipv4.ip_forward
# Should be 1

# Check NAT rules
sudo iptables -t nat -L -n -v

# Check routing
ip route show table all
```

See [Troubleshooting Guide](/docs/networking/troubleshooting/connectivity-issues).

### Slow Connection

**Problem**: VPN is very slow

**Solution**:
- **Check MTU**: See [MTU Optimization](/docs/networking/performance/mtu-optimization)
- **Check DPD timers**: See [DPD Configuration](/docs/networking/performance/dpd-timers)
- **Check server load**: `top` or `htop` on server

### Frequent Disconnects

**Problem**: VPN disconnects frequently

**Solution**:
- **Adjust DPD timers** (server config)
- **Check network stability**
- **Mobile**: Use mobile-optimized DPD settings

See [Performance Tuning](/docs/networking/performance/dpd-timers).

## Connection Profiles

### Create Profile (Cisco Secure Client)

Save server settings for easy connection:

**Windows**:
1. Create `C:\ProgramData\Cisco\Cisco Secure Client\VPN\Profile\profile.xml`

**XML Example**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<AnyConnectProfile xmlns="http://schemas.xmlsoap.org/encoding/">
  <ServerList>
    <HostEntry>
      <HostName>Work VPN</HostName>
      <HostAddress>vpn.example.com</HostAddress>
    </HostEntry>
  </ServerList>
</AnyConnectProfile>
```

See [Client Deployment](/docs/administration/deployment/client-deployment) for profile deployment.

## Next Steps

After your first successful connection:

1. **[FAQ](./faq)** - Common questions and answers
2. **[Administration Guide](/docs/administration/)** - Manage users and policies
3. **[Security](/docs/administration/security/certificates)** - Implement proper PKI
4. **[Monitoring](/docs/administration/monitoring/logging)** - Track VPN usage

---

**Still having issues?** See [Common Problems](/docs/networking/troubleshooting/common-problems) or [get support](/docs/resources/support).

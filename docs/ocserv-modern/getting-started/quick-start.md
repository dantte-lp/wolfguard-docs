---
sidebar_position: 2
---

# Quick Start Guide

Get up and running with OpenConnect protocol analysis and implementation.

## Prerequisites

Before you begin, ensure you have:

- **Analysis Tools**: IDA Pro, Ghidra, or Binary Ninja
- **Development Environment**: GCC/Clang, CMake, Git
- **SSL Library**: WolfSSL 5.6.0+ or OpenSSL 3.x
- **Test Environment**: Virtual machines for testing different platforms
- **Cisco Client**: Legitimate copy of Cisco Secure Client for testing

## Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dantte-lp/ocserv-modern.git
cd ocserv-modern
```

### 2. Install Dependencies

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    cmake \
    libwolfssl-dev \
    libgnutls28-dev \
    libev-dev \
    libreadline-dev \
    libnl-genl-3-dev \
    libseccomp-dev
```

**RHEL/Rocky/Alma:**
```bash
sudo dnf groupinstall "Development Tools"
sudo dnf install -y \
    cmake \
    wolfssl-devel \
    gnutls-devel \
    libev-devel \
    readline-devel \
    libnl3-devel \
    libseccomp-devel
```

### 3. Build from Source

```bash
mkdir build && cd build
cmake .. -DWITH_WOLFSSL=ON
make -j$(nproc)
sudo make install
```

### 4. Basic Configuration

Create a minimal configuration file:

```bash
sudo mkdir -p /etc/ocserv
sudo cat &gt; /etc/ocserv/ocserv.conf << 'EOF'
# Basic OpenConnect Server Configuration

# Listening ports
tcp-port = 443
udp-port = 443

# Server certificate
server-cert = /etc/ocserv/certs/server-cert.pem
server-key = /etc/ocserv/certs/server-key.pem

# Authentication
auth = "plain[passwd=/etc/ocserv/ocpasswd]"

# Networking
ipv4-network = 192.168.100.0/24
dns = 8.8.8.8
dns = 8.8.4.4

# Routes (push all traffic)
route = default

# Cisco compatibility
cisco-client-compat = true
dtls-legacy = true

# Security
max-clients = 16
max-same-clients = 2

# Logging
log-level = 1
EOF
```

### 5. Generate Certificates

```bash
# Self-signed certificate for testing
sudo certtool --generate-privkey --outfile /etc/ocserv/certs/server-key.pem
sudo certtool --generate-self-signed \
    --load-privkey /etc/ocserv/certs/server-key.pem \
    --outfile /etc/ocserv/certs/server-cert.pem \
    --template /etc/ocserv/certs/server-cert.cfg
```

### 6. Create Test User

```bash
sudo ocpasswd -c /etc/ocserv/ocpasswd testuser
# Enter password when prompted
```

### 7. Start the Server

```bash
sudo ocserv -c /etc/ocserv/ocserv.conf -f -d 1
```

## Testing the Connection

### Using Cisco Secure Client

1. Open Cisco Secure Client
2. Enter server address: `vpn.yourdomain.com`
3. Username: `testuser`
4. Password: (as set above)
5. Connect and verify:
   - IP address assignment
   - DNS resolution
   - Route propagation
   - DTLS tunnel establishment

### Using OpenConnect CLI

```bash
sudo openconnect vpn.yourdomain.com \
    --user=testuser \
    --authgroup=Default
```

## Verification Checklist

After connection, verify:

- [ ] **IP Assignment**: Check assigned IP in 192.168.100.0/24 range
- [ ] **DNS**: Test DNS resolution: `nslookup google.com`
- [ ] **Routing**: Verify routes: `ip route` or `netstat -rn`
- [ ] **DTLS**: Check DTLS tunnel: `sudo ocserv-fw-rules`
- [ ] **Logs**: Review server logs for any errors

## Common Issues

### Certificate Validation Fails

**Problem**: Client rejects self-signed certificate

**Solution**:
```bash
# Disable certificate validation (testing only!)
openconnect --no-cert-check vpn.yourdomain.com
```

### DTLS Tunnel Not Established

**Problem**: Only TLS tunnel, no DTLS

**Solution**: Check firewall allows UDP 443
```bash
sudo firewall-cmd --add-port=443/udp --permanent
sudo firewall-cmd --reload
```

### Connection Drops After Few Seconds

**Problem**: Dead Peer Detection (DPD) timeout

**Solution**: Adjust DPD settings in ocserv.conf:
```ini
dpd = 90
mobile-dpd = 300
```

## Next Steps

Now that you have a working setup:

1. **Explore Protocol**: Read [Crypto Analysis](/docs/protocol/crypto)
2. **Deep Dive**: Study [Binary Analysis](/docs/analysis/decompilation)
3. **Production Deployment**: Follow [Deployment Guide](/docs/implementation/deployment)
4. **Compatibility**: Review [Compatibility Guide](/docs/implementation/compatibility)

## Additional Resources

- **Official Docs**: [ocserv-modern documentation](https://github.com/dantte-lp/ocserv-modern)
- **WolfSSL Integration**: [WolfSSL Guide](/docs/implementation/wolfssl)
- **Troubleshooting**: Check logs in `/var/log/ocserv/`

---

**Need Help?** Check the [Reference](/docs/reference/summary) section or review specific protocol features in the documentation.

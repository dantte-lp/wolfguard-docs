---
sidebar_position: 2
title: Quick Start
---

# Quick Start Guide

Get WolfGuard VPN server running in 10 minutes. This guide will get you from zero to a working VPN server with a test client connection.

## Prerequisites

Before you begin, ensure you have:

- **Linux Server**: Ubuntu 22.04+, Rocky Linux 9+, or similar
- **Root Access**: sudo privileges required
- **Public IP**: Or accessible via port forwarding
- **Domain Name**: Optional but recommended (e.g., `vpn.example.com`)

## Step 1: Install WolfGuard

### Ubuntu/Debian

```bash
# Add WolfGuard repository
curl -fsSL https://repo.wolfguard.io/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/wolfguard.gpg
echo "deb [signed-by=/usr/share/keyrings/wolfguard.gpg] https://repo.wolfguard.io/apt stable main" | \
  sudo tee /etc/apt/sources.list.d/wolfguard.list

# Update and install
sudo apt update
sudo apt install -y wolfguard
```

### RHEL/Rocky/Alma

```bash
# Add WolfGuard repository
sudo tee /etc/yum.repos.d/wolfguard.repo <<EOF
[wolfguard]
name=WolfGuard Repository
baseurl=https://repo.wolfguard.io/rpm/el\$releasever/\$basearch
enabled=1
gpgcheck=1
gpgkey=https://repo.wolfguard.io/gpg.key
EOF

# Install
sudo dnf install -y wolfguard
```

### Docker (Quick Test)

```bash
# Run WolfGuard in Docker
docker run -d \
  --name wolfguard \
  --cap-add=NET_ADMIN \
  -p 443:443 \
  -p 443:443/udp \
  -v /etc/wolfguard:/etc/wolfguard \
  wolfguard/wolfguard:latest
```

## Step 2: Generate Certificates

WolfGuard needs TLS certificates. For testing, we'll create self-signed certificates:

```bash
# Create certificate directory
sudo mkdir -p /etc/wolfguard/certs
cd /etc/wolfguard/certs

# Generate CA certificate
sudo openssl req -new -x509 -days 3650 -nodes \
  -out ca-cert.pem -keyout ca-key.pem \
  -subj "/CN=WolfGuard CA"

# Generate server certificate
sudo openssl req -new -nodes \
  -out server-req.pem -keyout server-key.pem \
  -subj "/CN=vpn.example.com"

# Sign server certificate
sudo openssl x509 -req -days 3650 \
  -in server-req.pem -CA ca-cert.pem -CAkey ca-key.pem \
  -set_serial 01 -out server-cert.pem

# Set permissions
sudo chmod 600 /etc/wolfguard/certs/*.pem
```

**Production**: Use Let's Encrypt or your organization's PKI. See [Certificate Management](/docs/administration/security/certificates).

## Step 3: Configure WolfGuard

Create basic configuration:

```bash
sudo tee /etc/wolfguard/wolfguard.conf <<EOF
# WolfGuard Configuration

# Server settings
server-name = vpn.example.com
listen-address = 0.0.0.0
tcp-port = 443
udp-port = 443

# TLS/SSL certificates
server-cert = /etc/wolfguard/certs/server-cert.pem
server-key = /etc/wolfguard/certs/server-key.pem
ca-cert = /etc/wolfguard/certs/ca-cert.pem

# Authentication (simple password file for testing)
auth = plain[passwd=/etc/wolfguard/passwd]

# Network settings
ipv4-network = 192.168.100.0/24
ipv4-netmask = 255.255.255.0
tunnel-all-dns = true
dns = 8.8.8.8, 8.8.4.4

# Routing (split-tunnel - only VPN traffic goes through tunnel)
route = 10.0.0.0/255.0.0.0
route = 172.16.0.0/255.240.0.0
route = 192.168.0.0/255.255.0.0

# Device
device = vpns

# Max clients
max-clients = 100

# Max same clients (same user, multiple devices)
max-same-clients = 2

# Session timeout (in seconds, 0 = unlimited)
session-timeout = 0

# DPD (Dead Peer Detection)
dpd = 60
mobile-dpd = 300

# Logging
log-level = info
EOF
```

## Step 4: Create Test User

Create a test user for authentication:

```bash
# Create password file
sudo touch /etc/wolfguard/passwd
sudo chmod 600 /etc/wolfguard/passwd

# Add test user (password: testpass123)
echo 'testuser:$6$rounds=656000$randomsalt$hashedpassword' | \
  sudo tee -a /etc/wolfguard/passwd

# Or use the wolfguard-passwd utility
sudo wolfguard-passwd -c /etc/wolfguard/passwd testuser
# Enter password when prompted
```

## Step 5: Configure Firewall

Allow VPN traffic through your firewall:

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 443/tcp
sudo ufw allow 443/udp

# RHEL/Rocky (firewalld)
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=443/udp
sudo firewall-cmd --reload

# iptables (if not using firewalld/ufw)
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 443 -j ACCEPT
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

## Step 6: Enable IP Forwarding

Enable IP forwarding for VPN routing:

```bash
# Enable IP forwarding
sudo sysctl -w net.ipv4.ip_forward=1

# Make it persistent
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Step 7: Start WolfGuard

Start the WolfGuard service:

```bash
# Start the service
sudo systemctl start wolfguard

# Enable auto-start on boot
sudo systemctl enable wolfguard

# Check status
sudo systemctl status wolfguard

# View logs
sudo journalctl -u wolfguard -f
```

## Step 8: Connect a Client

### Cisco Secure Client

1. **Download** Cisco Secure Client from [Cisco](https://www.cisco.com/) (or your organization)
2. **Install** on Windows, macOS, or Linux
3. **Launch** Cisco Secure Client
4. **Add Connection**:
   - Server: `https://vpn.example.com`
   - Username: `testuser`
   - Password: `testpass123`
5. **Connect**

### OpenConnect Client (Linux)

```bash
# Install OpenConnect
sudo apt install openconnect  # Ubuntu/Debian
sudo dnf install openconnect  # RHEL/Rocky

# Connect
sudo openconnect vpn.example.com -u testuser
# Enter password when prompted
```

### OpenConnect GUI (Linux Desktop)

```bash
# Install NetworkManager OpenConnect
sudo apt install network-manager-openconnect-gnome

# Add VPN connection in NetworkManager
# Type: Cisco AnyConnect Compatible VPN (openconnect)
# Gateway: vpn.example.com
# Username: testuser
```

## Step 9: Verify Connection

After connecting, verify:

```bash
# Check your VPN IP
ip addr show vpns

# Check routes
ip route

# Test connectivity
ping 192.168.100.1  # VPN gateway

# Check active connections on server
sudo wolfguard-ctl status
sudo wolfguard-ctl users
```

## Troubleshooting

### Can't Connect?

**Check server is running**:
```bash
sudo systemctl status wolfguard
sudo journalctl -u wolfguard -n 50
```

**Check firewall**:
```bash
# Verify ports are open
sudo netstat -tulpn | grep 443
```

**Check certificates**:
```bash
# Verify certificate files exist
ls -l /etc/wolfguard/certs/

# Test TLS connection
openssl s_client -connect vpn.example.com:443
```

**Check logs**:
```bash
# Server logs
sudo tail -f /var/log/wolfguard/server.log

# Or systemd journal
sudo journalctl -u wolfguard -f
```

### Common Issues

| Problem | Solution |
|---------|----------|
| **Certificate error** | Accept self-signed cert in client, or use proper PKI |
| **Authentication failed** | Check username/password in `/etc/wolfguard/passwd` |
| **Port 443 in use** | Another service using port 443 (Apache, Nginx, etc.) |
| **No internet after connect** | Check IP forwarding and NAT rules |
| **DNS not working** | Check `dns` setting in config |

See [Common Problems](/docs/networking/troubleshooting/common-problems) for more.

## Next Steps

Congratulations! You have a working VPN server. Now you can:

### For Production Use
1. **Get proper certificates** → [Certificate Management](/docs/administration/security/certificates)
2. **Set up RADIUS/LDAP** → [User Management](/docs/administration/users/authentication)
3. **Enable two-factor auth** → [Two-Factor Authentication](/docs/administration/users/two-factor-auth)
4. **Harden security** → [Security Hardening](/docs/administration/security/hardening)
5. **Set up monitoring** → [Monitoring & Logging](/docs/administration/monitoring/logging)

### Learn More
- **[Installation Guide](./installation)** - Detailed installation for all platforms
- **[First Connection](./first-connection)** - Comprehensive client setup
- **[Administration Guide](/docs/administration/)** - Production deployment
- **[FAQ](./faq)** - Common questions

### Advanced Deployment
- **[Docker Deployment](/docs/devops/containers/docker)** - Containerized deployment
- **[Kubernetes](/docs/devops/containers/kubernetes)** - Orchestration at scale
- **[High Availability](/docs/devops/ha/load-balancing)** - HA and load balancing

---

**Need help?** Check the [FAQ](./faq) or visit [Support](/docs/resources/support).

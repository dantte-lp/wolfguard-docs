---
title: Configuration Reference
sidebar_position: 3
---

# Configuration Reference

Complete reference for WolfGuard configuration file options.

## Configuration File Location

Default: `/etc/wolfguard/wolfguard.conf`

## File Format

```bash
# Comments start with #
option-name = value

# Multi-line values
multi-line-option = value1
multi-line-option = value2
```

## Server Settings

### server-name

Server hostname presented to clients.

**Type**: String
**Required**: Yes
**Example**:
```bash
server-name = vpn.example.com
```

### listen-address

IP address to listen on.

**Type**: IP Address
**Default**: `0.0.0.0` (all interfaces)
**Example**:
```bash
listen-address = 0.0.0.0
listen-address = 192.168.1.10  # Specific interface
```

### tcp-port

TCP port for HTTPS authentication.

**Type**: Integer (1-65535)
**Default**: `443`
**Example**:
```bash
tcp-port = 443
tcp-port = 8443  # Non-standard port
```

### udp-port

UDP port for DTLS tunnel.

**Type**: Integer (1-65535)
**Default**: `443`
**Example**:
```bash
udp-port = 443
```

## TLS/SSL Settings

### server-cert

Path to server certificate (PEM format).

**Type**: File Path
**Required**: Yes
**Example**:
```bash
server-cert = /etc/wolfguard/certs/server-cert.pem
```

### server-key

Path to server private key (PEM format).

**Type**: File Path
**Required**: Yes
**Example**:
```bash
server-key = /etc/wolfguard/certs/server-key.pem
```

### ca-cert

Path to CA certificate for client verification.

**Type**: File Path
**Optional**
**Example**:
```bash
ca-cert = /etc/wolfguard/certs/ca-cert.pem
```

### tls-priorities

TLS cipher suite priorities.

**Type**: String
**Default**: `NORMAL:-VERS-TLS1.0:-VERS-TLS1.1`
**Example**:
```bash
# TLS 1.3 only
tls-priorities = NORMAL:-VERS-ALL:+VERS-TLS1.3

# TLS 1.2 and 1.3
tls-priorities = NORMAL:-VERS-TLS1.0:-VERS-TLS1.1
```

## Authentication

### auth

Authentication method.

**Type**: String
**Required**: Yes
**Options**:
- `plain[passwd=FILE]` - Local password file
- `radius[config=FILE]` - RADIUS authentication
- `pam` - PAM authentication
- `ldap[config=FILE]` - LDAP authentication
- `certificate` - Client certificate only

**Example**:
```bash
# Local password file
auth = plain[passwd=/etc/wolfguard/passwd]

# RADIUS
auth = radius[config=/etc/wolfguard/radius.conf]

# Multiple methods (tried in order)
auth = certificate
auth = plain[passwd=/etc/wolfguard/passwd]
```

## Network Configuration

### ipv4-network

IPv4 network for VPN clients.

**Type**: IP Network (CIDR)
**Required**: Yes
**Example**:
```bash
ipv4-network = 192.168.100.0/24
```

### ipv4-netmask

IPv4 netmask.

**Type**: Netmask
**Required**: Yes
**Example**:
```bash
ipv4-netmask = 255.255.255.0
```

### ipv6-network

IPv6 network for VPN clients.

**Type**: IPv6 Network (CIDR)
**Optional**
**Example**:
```bash
ipv6-network = fda9:4efe:7e3b:03ea::/64
```

### dns

DNS servers to push to clients.

**Type**: IP Address (multiple allowed)
**Optional**
**Example**:
```bash
dns = 8.8.8.8
dns = 8.8.4.4
```

### route

Routes to push to clients (split-tunnel).

**Type**: Network/Netmask (multiple allowed)
**Optional**
**Example**:
```bash
# Private networks only
route = 10.0.0.0/255.0.0.0
route = 172.16.0.0/255.240.0.0
route = 192.168.0.0/255.255.0.0

# Specific networks
route = 192.168.1.0/255.255.255.0
```

### tunnel-all-dns

Force all DNS through VPN.

**Type**: Boolean
**Default**: `false`
**Example**:
```bash
tunnel-all-dns = true
```

### no-route

Exclude specific routes.

**Type**: Network/Netmask (multiple allowed)
**Optional**
**Example**:
```bash
no-route = 192.168.1.0/255.255.255.0
```

## Client Limits

### max-clients

Maximum concurrent clients.

**Type**: Integer
**Default**: `100`
**Example**:
```bash
max-clients = 500
```

### max-same-clients

Maximum concurrent connections per user.

**Type**: Integer
**Default**: `2`
**Example**:
```bash
max-same-clients = 3
```

## Timeouts

### session-timeout

Session timeout in seconds (0 = unlimited).

**Type**: Integer
**Default**: `0`
**Example**:
```bash
session-timeout = 28800  # 8 hours
```

### dpd

Dead Peer Detection interval for desktop clients (seconds).

**Type**: Integer
**Default**: `90`
**Example**:
```bash
dpd = 60
```

### mobile-dpd

DPD interval for mobile clients (seconds).

**Type**: Integer
**Default**: `300`
**Example**:
```bash
mobile-dpd = 300
```

### keepalive

Keepalive interval (seconds).

**Type**: Integer
**Default**: `32400`
**Example**:
```bash
keepalive = 3600  # 1 hour
```

## Logging

### log-level

Logging level.

**Type**: String
**Default**: `info`
**Options**: `debug`, `info`, `warning`, `error`
**Example**:
```bash
log-level = info
```

### syslog

Enable syslog logging.

**Type**: Boolean
**Default**: `true`
**Example**:
```bash
syslog = true
```

### log-file

Log to file instead of syslog.

**Type**: File Path
**Optional**
**Example**:
```bash
log-file = /var/log/wolfguard/server.log
```

## Device Settings

### device

TUN/TAP device name.

**Type**: String
**Default**: `vpns`
**Example**:
```bash
device = vpns
```

### tun-mtu

MTU for TUN device.

**Type**: Integer
**Default**: `1400`
**Example**:
```bash
tun-mtu = 1400
```

## Security

### require-client-cert

Require client certificate for authentication.

**Type**: Boolean
**Default**: `false`
**Example**:
```bash
require-client-cert = true
```

### min-tls-version

Minimum TLS version.

**Type**: String
**Default**: `1.2`
**Options**: `1.2`, `1.3`
**Example**:
```bash
min-tls-version = 1.3
```

## Example Configurations

### Basic Configuration

```bash
# Basic WolfGuard configuration
server-name = vpn.example.com
listen-address = 0.0.0.0
tcp-port = 443
udp-port = 443

# Certificates
server-cert = /etc/wolfguard/certs/server-cert.pem
server-key = /etc/wolfguard/certs/server-key.pem

# Authentication
auth = plain[passwd=/etc/wolfguard/passwd]

# Network
ipv4-network = 192.168.100.0/24
ipv4-netmask = 255.255.255.0
dns = 8.8.8.8

# Split-tunnel
route = 10.0.0.0/255.0.0.0

# Limits
max-clients = 100
max-same-clients = 2

# Logging
log-level = info
```

### Production Configuration

```bash
# Production WolfGuard configuration
server-name = vpn.example.com
listen-address = 0.0.0.0
tcp-port = 443
udp-port = 443

# TLS 1.3 only
min-tls-version = 1.3
tls-priorities = NORMAL:-VERS-ALL:+VERS-TLS1.3

# Certificates (Let's Encrypt)
server-cert = /etc/letsencrypt/live/vpn.example.com/fullchain.pem
server-key = /etc/letsencrypt/live/vpn.example.com/privkey.pem

# RADIUS authentication with 2FA
auth = radius[config=/etc/wolfguard/radius.conf]

# Network
ipv4-network = 10.20.0.0/16
ipv4-netmask = 255.255.0.0
ipv6-network = fda9:4efe:7e3b:03ea::/64
dns = 10.1.1.53
dns = 10.1.2.53
tunnel-all-dns = true

# Split-tunnel - corporate networks only
route = 10.0.0.0/255.0.0.0
route = 172.16.0.0/255.240.0.0

# Limits
max-clients = 1000
max-same-clients = 5

# Timeouts
session-timeout = 28800  # 8 hours
dpd = 60
mobile-dpd = 300

# Logging
log-level = info
syslog = true
```

## See Also

- [Command Reference](./command-reference) - CLI commands
- [Server Setup](/docs/administration/deployment/server-setup) - Configuration guide
- [Security Hardening](/docs/administration/security/hardening) - Security best practices

---

**Missing an option?** [Request documentation](https://github.com/dantte-lp/wolfguard-docs/issues)

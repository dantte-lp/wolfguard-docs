---
sidebar_position: 5
title: FAQ
---

# Frequently Asked Questions

Common questions and answers about WolfGuard VPN server.

## General

### What is WolfGuard?

WolfGuard is a modern, open-source OpenConnect VPN server that provides full compatibility with Cisco Secure Client (formerly AnyConnect) while being built on modern, secure foundations including WolfSSL and C23.

### Is WolfGuard free?

Yes, WolfGuard is free and open-source software licensed under [license-type]. Community support is available through GitHub.

### What clients can I use with WolfGuard?

WolfGuard works with:
- **Cisco Secure Client** (Windows, macOS, Linux, iOS, Android)
- **OpenConnect CLI** (Linux, *BSD, macOS)
- **NetworkManager OpenConnect** (Linux desktop)
- Any client compatible with Cisco AnyConnect protocol

### How is WolfGuard different from ocserv?

| Feature | WolfGuard | ocserv |
|---------|-----------|--------|
| **TLS Library** | WolfSSL | GnuTLS/OpenSSL |
| **Language** | C23 | C99 |
| **Performance** | Optimized | Standard |
| **Maintenance** | Active development | Maintenance mode |

## Installation & Setup

### What are the system requirements?

**Minimum**: 2 cores, 2 GB RAM, 10 GB disk
**Recommended**: 4+ cores, 4+ GB RAM, 20+ GB SSD

See [Installation Guide](./installation#system-requirements).

### Can I run WolfGuard on a Raspberry Pi?

Yes, WolfGuard can run on Raspberry Pi 4 or newer with at least 2 GB RAM. ARM64 builds are available.

### Do I need a domain name?

Not strictly required, but **highly recommended**. You can use an IP address for testing, but a domain name is needed for:
- Proper SSL/TLS certificates (Let's Encrypt)
- Professional appearance
- Easier client configuration

### Can I use Let's Encrypt certificates?

Yes! Let's Encrypt is fully supported and recommended for production:

```bash
sudo certbot certonly --standalone -d vpn.example.com
```

See [Certificate Management](/docs/administration/security/certificates).

## Authentication & Security

### What authentication methods are supported?

- **Local password file** (built-in)
- **RADIUS** (supports FreeRADIUS, Microsoft NPS)
- **LDAP/Active Directory**
- **SAML/SSO** (Azure AD, Okta, etc.)
- **Client certificates** (PKI)
- **Two-Factor Authentication** (TOTP, SMS, etc.)

See [Authentication Guide](/docs/administration/users/authentication).

### Can I use Active Directory for authentication?

Yes, through LDAP or RADIUS integration. See [LDAP Integration](/docs/administration/users/ldap-integration).

### Does WolfGuard support two-factor authentication?

Yes, multiple 2FA methods are supported including TOTP (Google Authenticator, Authy) and integration with enterprise 2FA solutions via RADIUS.

See [Two-Factor Authentication](/docs/administration/users/two-factor-auth).

### Is WolfGuard secure?

WolfGuard is built with security as a priority:
- **TLS 1.3** support (latest protocol)
- **WolfSSL** (FIPS-validated crypto library)
- **Modern C23** (safer language features)
- **Regular security audits**
- **Active vulnerability management**

See [Security Guide](/docs/administration/security/hardening).

### What cipher suites are supported?

WolfGuard supports modern, secure cipher suites:

**TLS 1.3** (recommended):
- TLS_AES_256_GCM_SHA384
- TLS_CHACHA20_POLY1305_SHA256
- TLS_AES_128_GCM_SHA256

**TLS 1.2** (fallback):
- ECDHE-RSA-AES256-GCM-SHA384
- ECDHE-RSA-CHACHA20-POLY1305

See [Cipher Suites](/docs/administration/security/cipher-suites).

## Network Configuration

### What ports does WolfGuard use?

By default:
- **TCP 443** - HTTPS authentication
- **UDP 443** - DTLS tunnel

These are configurable. See [Port Requirements](/docs/networking/firewall/port-requirements).

### Can WolfGuard work behind NAT?

Yes, WolfGuard works well behind NAT. Ensure your firewall/router forwards TCP and UDP 443 to your server.

### What's the difference between split-tunnel and full-tunnel?

- **Split-tunnel**: Only specific routes go through VPN (e.g., corporate network)
- **Full-tunnel**: All traffic goes through VPN (internet and corporate)

See [Network Topology](/docs/networking/topology/split-tunneling).

### How do I configure split-tunneling?

In `/etc/wolfguard/wolfguard.conf`:

```bash
# Split-tunnel - only route these networks through VPN
route = 10.0.0.0/255.0.0.0
route = 172.16.0.0/255.240.0.0
route = 192.168.0.0/255.255.0.0
```

### How many users can WolfGuard support?

Depends on hardware, but typical performance:

| Hardware | Concurrent Users |
|----------|------------------|
| 2 cores, 2 GB RAM | 50-100 |
| 4 cores, 4 GB RAM | 100-500 |
| 8 cores, 16 GB RAM | 500-2000 |

See [Performance Tuning](/docs/networking/performance/mtu-optimization).

## Troubleshooting

### VPN connects but I have no internet access

**Check IP forwarding** (server):
```bash
sysctl net.ipv4.ip_forward
# Should return 1
```

**Check NAT rules**:
```bash
sudo iptables -t nat -L -n -v
```

See [Connectivity Issues](/docs/networking/troubleshooting/connectivity-issues).

### I get "Certificate verification failed"

**For testing with self-signed certificates**:
- Accept/trust the certificate in your client
- Use `--no-cert-check` with OpenConnect (testing only)

**For production**:
- Use Let's Encrypt or proper PKI
- See [Certificate Management](/docs/administration/security/certificates)

### VPN is very slow

Common causes:
1. **MTU mismatch** - See [MTU Optimization](/docs/networking/performance/mtu-optimization)
2. **Server overloaded** - Check CPU/RAM usage
3. **Network latency** - Check ping times
4. **ISP throttling** - Test different protocols

### VPN disconnects frequently

**Adjust DPD timers** in `/etc/wolfguard/wolfguard.conf`:

```bash
# Desktop clients
dpd = 60

# Mobile clients (more tolerant)
mobile-dpd = 300
```

See [DPD Configuration](/docs/networking/performance/dpd-timers).

### How do I check who is connected?

```bash
# List active connections
sudo wolfguard-ctl status

# List connected users
sudo wolfguard-ctl users

# View detailed connection info
sudo wolfguard-ctl show-connections
```

## Deployment & Operations

### Can I run WolfGuard in Docker?

Yes! Docker deployment is fully supported.

```bash
docker run -d \
  --name wolfguard \
  --cap-add=NET_ADMIN \
  -p 443:443/tcp \
  -p 443:443/udp \
  wolfguard/wolfguard:latest
```

See [Docker Guide](/docs/devops/containers/docker).

### Can I deploy WolfGuard on Kubernetes?

Yes! Helm charts are available for Kubernetes deployment.

```bash
helm install wolfguard wolfguard/wolfguard
```

See [Kubernetes Guide](/docs/devops/containers/kubernetes).

### How do I monitor WolfGuard?

WolfGuard can be monitored with:
- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **ELK Stack** - Log analysis
- Built-in logging

See [Monitoring Guide](/docs/administration/monitoring/logging).

### How do I back up WolfGuard?

Back up these directories/files:
- `/etc/wolfguard/` - Configuration
- `/etc/wolfguard/certs/` - Certificates
- `/etc/wolfguard/passwd` - User database (if using local auth)

See [Backup & Recovery](/docs/devops/ha/backup-recovery).

### Can I run multiple WolfGuard servers for high availability?

Yes! WolfGuard supports HA configurations:
- **Load balancing** across multiple instances
- **Failover** for redundancy
- **Shared state** (database backend)

See [High Availability](/docs/devops/ha/load-balancing).

## Development & Customization

### Can I customize WolfGuard?

Yes! WolfGuard is open-source and supports:
- **Custom authentication modules**
- **Hooks and scripts**
- **API integrations**
- **Protocol extensions**

See [Developer Guide](/docs/developers/).

### Does WolfGuard have an API?

Yes, WolfGuard provides a REST API for:
- User management
- Connection monitoring
- Configuration changes
- Statistics

See [API Reference](/docs/developers/api/rest-api).

### How do I contribute to WolfGuard?

We welcome contributions!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [Contributing Guide](/docs/resources/contributing).

## Commercial & Licensing

### Can I use WolfGuard commercially?

Yes, WolfGuard is open-source and can be used commercially. Check the license for specific terms.

### Is there commercial support available?

Community support is available through GitHub. Commercial support options may be available - contact the WolfGuard team.

### Is WolfGuard FIPS compliant?

WolfSSL (the crypto library used by WolfGuard) has FIPS 140-2/140-3 validated options available. Contact WolfSSL for FIPS-validated builds.

## More Help

### Where can I get more help?

- **Documentation**: Browse these docs
- **GitHub Issues**: https://github.com/dantte-lp/wolfguard/issues
- **Community Forum**: [Support](/docs/resources/support)
- **Email**: support@wolfguard.io (if available)

### How do I report a bug?

1. **Check** if it's already reported: [GitHub Issues](https://github.com/dantte-lp/wolfguard/issues)
2. **Collect** logs and version info
3. **Create** a detailed bug report with reproduction steps

### How do I request a feature?

File a feature request on [GitHub Issues](https://github.com/dantte-lp/wolfguard/issues) with:
- **Use case** - Why you need it
- **Description** - What you want
- **Alternatives** - What you've tried

---

**Can't find your answer?** Check [Common Problems](/docs/networking/troubleshooting/common-problems) or [contact support](/docs/resources/support).

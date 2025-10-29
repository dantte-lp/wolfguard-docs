# OpenConnect Server (ocserv) - Vanilla Documentation

## Overview

This section contains documentation for the **original OpenConnect Server (ocserv)** implementation - the widely-deployed, battle-tested open-source SSL VPN server that implements the OpenConnect/AnyConnect protocol.

## About ocserv (Vanilla)

[OpenConnect Server (ocserv)](https://gitlab.com/openconnect/ocserv) is the original open-source implementation of an SSL VPN server compatible with Cisco AnyConnect clients. It's written in C and has been in production use worldwide since 2013.

**Project Details:**
- **Project**: ocserv (OpenConnect Server)
- **Repository**: https://gitlab.com/openconnect/ocserv
- **Language**: C (C11 standard)
- **License**: GPL-2.0
- **Maintainer**: Nikos Mavrogiannopoulos
- **Status**: Stable, actively maintained

## What You'll Find Here

### 🎯 [Features](./features/dpd-timers.md)
- **Dead Peer Detection (DPD)**: Connection monitoring and keepalive
- **DNS Management**: Custom DNS servers and split-tunnel DNS
- **On-Guard Security (OGS)**: Cisco security posture assessment
- **Windows Support**: Compatibility with Cisco Secure Client on Windows
- **Two-Factor Authentication**: OTP, TOTP, HOTP integration
- **DART Module**: Dynamic Access Rights Tracking

### 🔌 [Integration](./integration/radius.md)
- **RADIUS**: Authentication and accounting via RADIUS
- **Custom Scripts**: Authentication and authorization hooks
- **PAM Integration**: System authentication integration
- **LDAP/AD**: Active Directory integration

## Key Features

### Mature & Production-Ready
- Deployed by enterprises, universities, and service providers worldwide
- Extensive battle-testing in production environments
- Comprehensive authentication options (certificate, password, OTP, RADIUS)

### Compatibility
- Works with Cisco AnyConnect/Secure Client
- Compatible with OpenConnect clients (Linux, macOS, Android, iOS)
- Supports multiple platforms (Linux, BSD, Windows)

### Security
- TLS 1.2/1.3 support
- DTLS for UDP tunneling
- Certificate-based authentication
- IP blacklisting and rate limiting

## Comparison: Vanilla vs Modern

| Feature | ocserv (Vanilla) | [wolfguard](../wolfguard/intro.md) |
|---------|------------------|---------------------------------------------|
| Language | C11 | C23 |
| TLS Library | GnuTLS | WolfSSL |
| DTLS | 1.2 | 1.3 |
| Memory Safety | Manual | Enhanced |
| Dependencies | GnuTLS, libev, etc. | WolfSSL, minimal |
| Status | Stable, production | Development |

## When to Use Vanilla ocserv

Choose vanilla ocserv if you:

✅ Need a **stable, production-ready** solution
✅ Require **extensive documentation** and community support
✅ Want **wide platform support** (Linux, BSD, etc.)
✅ Need **FIPS-compliant** deployments (with GnuTLS FIPS mode)
✅ Prefer **battle-tested** code in production environments

## When to Consider wolfguard

Consider [wolfguard](../wolfguard/intro.md) if you:

✅ Want **DTLS 1.3** support (Cisco Secure Client 5.x compatibility)
✅ Need **modern C23** features and memory safety
✅ Prefer **WolfSSL** over GnuTLS
✅ Want **WolfSentry** integration for advanced filtering
✅ Can accept **development/beta** software status

## Official Resources

- **Official Website**: https://ocserv.gitlab.io/www/
- **GitLab Repository**: https://gitlab.com/openconnect/ocserv
- **Documentation**: https://ocserv.gitlab.io/www/manual.html
- **Mailing List**: openconnect-devel@lists.infradead.org
- **Bug Tracker**: https://gitlab.com/openconnect/ocserv/issues

## Installation

```bash
# Debian/Ubuntu
apt-get install ocserv

# Fedora/RHEL
dnf install ocserv

# From source
git clone https://gitlab.com/openconnect/ocserv.git
cd ocserv
autoreconf -fvi
./configure
make
make install
```

## Quick Start

```bash
# Generate certificates
certtool --generate-privkey --outfile ca-key.pem
certtool --generate-self-signed --load-privkey ca-key.pem --outfile ca-cert.pem

# Configure ocserv
vim /etc/ocserv/ocserv.conf

# Start server
systemctl start ocserv
systemctl enable ocserv
```

See [Integration guides](./integration/radius.md) for more detailed setup instructions.

## Contributing

Contributions to vanilla ocserv should be directed to the official project:
- **Repository**: https://gitlab.com/openconnect/ocserv
- **Issues**: https://gitlab.com/openconnect/ocserv/issues
- **Merge Requests**: https://gitlab.com/openconnect/ocserv/-/merge_requests

---

**Project**: OpenConnect Server (ocserv)
**Version**: 1.3.x (stable)
**Last Updated**: 2025-10-29

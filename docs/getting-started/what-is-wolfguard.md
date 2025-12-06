---
sidebar_position: 1
title: What is WolfGuard?
---

# What is WolfGuard?

WolfGuard is a modern, high-performance OpenConnect VPN server that provides full compatibility with Cisco Secure Client 5.x+ while being built on modern, secure foundations.

## Key Features

### Modern Cryptography
- **WolfSSL Library** - Industry-leading TLS/DTLS implementation
- **TLS 1.3 Support** - Latest transport layer security
- **Perfect Forward Secrecy** - Enhanced security for all connections
- **Strong Cipher Suites** - AES-GCM, ChaCha20-Poly1305

### Cisco Compatibility
- **Cisco Secure Client 5.x+** - Full protocol compatibility
- **AnyConnect Legacy** - Supports older clients
- **Multi-Platform** - Windows, macOS, Linux, iOS, Android clients
- **Feature Parity** - All major Cisco features supported

### Modern Design
- **C23 Standard** - Latest C language features for safety
- **Memory Safe** - Built with security best practices
- **High Performance** - Optimized for throughput and latency
- **Scalable** - Supports thousands of concurrent connections

### Enterprise Ready
- **Multiple Authentication** - RADIUS, LDAP, SAML, certificates
- **Two-Factor Auth** - MFA/2FA support
- **Policy Engine** - Granular access control
- **Compliance** - Meets regulatory requirements

## Why WolfGuard?

### vs. Cisco ASA
| Feature | WolfGuard | Cisco ASA |
|---------|-----------|-----------|
| **Cost** | Free/Open Source | Expensive licensing |
| **Flexibility** | Full control | Vendor lock-in |
| **Updates** | Community-driven | Vendor schedule |
| **Customization** | Fully customizable | Limited |
| **Deployment** | Any platform | Specific hardware |

### vs. ocserv (Vanilla)
| Feature | WolfGuard | ocserv |
|---------|-----------|--------|
| **TLS Library** | WolfSSL | GnuTLS/OpenSSL |
| **C Standard** | C23 | C99 |
| **Performance** | Optimized | Standard |
| **Features** | Extended | Standard |
| **Maintenance** | Active | Maintenance mode |

### vs. Other VPN Solutions
- **OpenVPN**: Different protocol, not Cisco-compatible
- **WireGuard**: Modern but different use case, no enterprise features
- **IPsec**: Complex setup, poor NAT traversal
- **OpenConnect**: WolfGuard is based on this protocol

## Use Cases

### Remote Access VPN
Perfect for organizations needing secure remote access:
- Remote workers accessing corporate resources
- BYOD (Bring Your Own Device) scenarios
- Contractor/vendor access

### Site-to-Site VPN
Connect entire offices or data centers:
- Branch office connectivity
- Cloud-to-on-premises links
- Hybrid cloud architectures

### Secure Internet Gateway
Route all traffic through secure gateway:
- Protection on untrusted networks
- Bypass geo-restrictions
- Privacy protection

## Architecture Highlights

```
┌─────────────────────────────────────────┐
│         Cisco Secure Client             │
│         (Windows/Mac/Linux/Mobile)      │
└────────────────┬────────────────────────┘
                 │ TLS 1.3 / DTLS
                 │
┌────────────────▼────────────────────────┐
│           WolfGuard Server              │
│  ┌──────────────────────────────────┐   │
│  │      Authentication Layer        │   │
│  │  (RADIUS/LDAP/Certs/SAML/2FA)   │   │
│  └──────────────┬───────────────────┘   │
│                 │                        │
│  ┌──────────────▼───────────────────┐   │
│  │     TLS/DTLS Handler (WolfSSL)  │   │
│  └──────────────┬───────────────────┘   │
│                 │                        │
│  ┌──────────────▼───────────────────┐   │
│  │    WolfSentry Firewall Engine   │   │
│  └──────────────┬───────────────────┘   │
│                 │                        │
│  ┌──────────────▼───────────────────┐   │
│  │       IP Stack (TUN/TAP)        │   │
│  └──────────────┬───────────────────┘   │
└─────────────────┼───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Corporate Network / Internet       │
└─────────────────────────────────────────┘
```

## Getting Started

Ready to try WolfGuard?

1. **[Quick Start Guide](./quick-start)** - Get running in 10 minutes
2. **[Installation](./installation)** - Detailed installation instructions
3. **[First Connection](./first-connection)** - Connect your first client

## Next Steps

After understanding what WolfGuard is:

- **Simple deployment?** → [Quick Start](./quick-start)
- **Production deployment?** → [Administration Guide](/docs/administration/)
- **Using containers?** → [DevOps Guide](/docs/devops/)
- **Want to develop?** → [Developer Guide](/docs/developers/)

---

**Questions?** Check the [FAQ](./faq) or [get support](/docs/resources/support).

---
sidebar_position: 0
title: Reference
slug: /reference/
---

# Reference Documentation

Comprehensive technical reference documentation for WolfGuard, including protocol specifications, reverse engineering analysis, and configuration references.

## Overview

This section contains detailed technical reference materials for:

- **Cisco Secure Client Analysis** - Reverse engineering findings
- **OpenConnect Protocol** - Complete protocol specifications
- **ocserv Documentation** - Legacy implementation reference
- **Configuration Reference** - All configuration options
- **Command Reference** - CLI command documentation
- **Glossary** - Technical terminology

## Reference Categories

### Cisco Secure Client Analysis

Comprehensive reverse engineering analysis of Cisco Secure Client (formerly AnyConnect):

- **[Cisco Secure Client Overview](../cisco-secure-client/)** - Analysis methodology and overview
- **[Version 5.1.12.146](../cisco-secure-client/v5-1-12-146/)** - Latest analyzed version (197 binaries)
  - [Common Functionality](../cisco-secure-client/v5-1-12-146/common-functionality) - Cross-platform components
  - [Linux Platform](../cisco-secure-client/v5-1-12-146/platform-linux) - Linux-specific analysis
  - [Windows Platform](../cisco-secure-client/v5-1-12-146/platform-windows) - Windows-specific analysis
- **[Version Comparison](./cisco/version-comparison)** - Compare different client versions

**Use Cases:**
- Protocol compatibility research
- Security analysis
- Feature implementation guidance
- Troubleshooting client behavior

### OpenConnect Protocol

Complete protocol specifications and analysis:

- **[Protocol Overview](../openconnect-protocol/intro)** - Introduction to OpenConnect protocol
- **[Protocol Specifications](../openconnect-protocol/protocol/crypto)**
  - [Cryptography](../openconnect-protocol/protocol/crypto) - Cipher suites and TLS/DTLS
  - [Authentication](../openconnect-protocol/protocol/authentication) - Auth methods and flows
  - [Certificates](../openconnect-protocol/protocol/certificates) - PKI and certificate handling
  - [NVM Telemetry](../openconnect-protocol/protocol/nvm-telemetry) - Network visibility module
- **[Reverse Engineering](../openconnect-protocol/analysis/decompilation)**
  - [Decompilation Tools](../openconnect-protocol/analysis/decompilation) - Binary analysis tools
  - [Analysis Workflow](../openconnect-protocol/analysis/workflow) - RE methodology
  - [Findings](../openconnect-protocol/analysis/findings) - Key discoveries
- **[Protocol Reference](../openconnect-protocol/reference/rfc-draft)**
  - [RFC Draft](../openconnect-protocol/reference/rfc-draft) - Protocol specification draft
  - [Version Differences](../openconnect-protocol/reference/version-diff) - Protocol evolution
  - [Version Comparison 5.1.2 vs 5.1.12](../openconnect-protocol/reference/version-comparison-5.1.2-vs-5.1.12)
  - [Version 5.1.12 Summary](../openconnect-protocol/reference/version-5.1.12-summary)
  - [Complete Summary](../openconnect-protocol/reference/summary)

**Use Cases:**
- Implementing compatible servers
- Understanding protocol behavior
- Security research
- Network troubleshooting

### ocserv Documentation

Original OpenConnect server (vanilla) implementation:

- **[ocserv Overview](../ocserv-vanilla/intro)** - Introduction to ocserv
- **[Features](../ocserv-vanilla/features/dpd-timers)**
  - [DPD Timers](../ocserv-vanilla/features/dpd-timers) - Dead Peer Detection
  - [DNS](../ocserv-vanilla/features/dns) - DNS configuration
  - [OGS](../ocserv-vanilla/features/ogs) - Optimal Gateway Selection
  - [Windows Support](../ocserv-vanilla/features/windows) - Windows-specific features
  - [Two-Factor Auth](../ocserv-vanilla/features/twofactor-auth) - 2FA/MFA
  - [DART Module](../ocserv-vanilla/features/dart-module) - Diagnostic and Reporting Tool
- **[Integration](../ocserv-vanilla/integration/radius)**
  - [RADIUS Integration](../ocserv-vanilla/integration/radius)
  - [Scripts](../ocserv-vanilla/integration/scripts) - Lifecycle scripts

**Use Cases:**
- Migration from ocserv to WolfGuard
- Feature comparison
- Understanding legacy behavior

### Configuration & Commands

- **[Glossary](./glossary)** - Technical terms and definitions
- **[Command Reference](./command-reference)** - All CLI commands
- **[Configuration Reference](./configuration-reference)** - Complete config options

## Quick Reference Cards

### Port Requirements

| Protocol | Port | Direction | Purpose |
|----------|------|-----------|---------|
| TCP | 443 | Inbound | HTTPS authentication |
| UDP | 443 | Inbound | DTLS tunnel |

### TLS Cipher Suites (Recommended)

**TLS 1.3** (Preferred):
- `TLS_AES_256_GCM_SHA384`
- `TLS_CHACHA20_POLY1305_SHA256`
- `TLS_AES_128_GCM_SHA256`

**TLS 1.2** (Fallback):
- `ECDHE-RSA-AES256-GCM-SHA384`
- `ECDHE-RSA-CHACHA20-POLY1305`
- `ECDHE-RSA-AES128-GCM-SHA256`

### Authentication Methods

| Method | Type | Security | Complexity |
|--------|------|----------|------------|
| **Local Database** | Built-in | Medium | Low |
| **RADIUS** | External | High | Medium |
| **LDAP/AD** | External | High | Medium |
| **SAML** | SSO | High | High |
| **Client Certificate** | PKI | Very High | High |
| **Two-Factor** | MFA | Very High | Medium |

### Protocol Versions

| Client Version | Protocol Version | TLS Version | Status |
|----------------|------------------|-------------|--------|
| 5.1.12.146 | 1.2 | 1.3 (preferred) | Current |
| 5.1.2.42 | 1.2 | 1.2 | Legacy |
| 4.x | 1.0 | 1.2 | Deprecated |

## Common Reference Tasks

### Find Configuration Option

1. Search [Configuration Reference](./configuration-reference)
2. Use Ctrl+F to find specific option
3. See examples and valid values

### Understand Protocol Behavior

1. Start with [Protocol Overview](../openconnect-protocol/intro)
2. Review [Authentication Flow](../networking/protocol/authentication-flow)
3. Check [Cisco Compatibility](../developers/protocol/cisco-compatibility)

### Troubleshoot Client Issues

1. Check [Cisco Client Analysis](../cisco-secure-client/)
2. Review [Version Comparison](./cisco/version-comparison)
3. See [Common Problems](../networking/troubleshooting/common-problems)

### Implement Feature

1. Check [ocserv Features](../ocserv-vanilla/intro) for prior art
2. Review [Protocol Specs](../openconnect-protocol/protocol/crypto)
3. See [Developer Examples](../developers/examples/c23-examples)

## Related Guides

- **[Developer Guide](/docs/developers/)** - For implementation details
- **[Network Engineering](/docs/networking/)** - For protocol deep dive
- **[Administration](/docs/administration/)** - For configuration guidance

## Standards & Specifications

### RFCs

- **[RFC 5246](https://tools.ietf.org/html/rfc5246)** - TLS 1.2
- **[RFC 8446](https://tools.ietf.org/html/rfc8446)** - TLS 1.3
- **[RFC 6347](https://tools.ietf.org/html/rfc6347)** - DTLS 1.2
- **[RFC 9147](https://tools.ietf.org/html/rfc9147)** - DTLS 1.3

### OpenConnect Specifications

- **[OpenConnect Draft RFC](../openconnect-protocol/reference/rfc-draft)** - Protocol specification
- **[Protocol Summary](../openconnect-protocol/reference/summary)** - Executive summary

## Research & Analysis

This reference documentation is based on:

- **Legitimate reverse engineering** for interoperability purposes
- **Binary analysis** using professional tools (Ghidra, IDA Pro, etc.)
- **Network protocol analysis** with Wireshark, tcpdump
- **Client behavior testing** on multiple platforms

All analysis conducted ethically and legally for the purpose of creating compatible implementations.

## Legal Notice

This documentation is provided for:
- ✅ Educational purposes
- ✅ Interoperability research
- ✅ Security analysis
- ✅ Server implementation

It is **not intended for**:
- ❌ Circumventing security measures
- ❌ Unauthorized access
- ❌ Malicious purposes

## Contributing

Found an error or want to contribute?

- **[Report Issues](https://github.com/dantte-lp/wolfguard-docs/issues)** - Documentation bugs
- **[Submit PRs](https://github.com/dantte-lp/wolfguard-docs/pulls)** - Improvements
- **[Contributing Guide](/docs/resources/contributing)** - How to contribute

---

**Looking for something specific?** Use the search function or browse by category above.

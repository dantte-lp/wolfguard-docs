---
sidebar_position: 5
title: Cisco Secure Client Analysis
---

# Cisco Secure Client Multi-Version Analysis

Comprehensive reverse engineering and analysis of Cisco Secure Client (formerly AnyConnect) versions 4.9 through 5.1 for OpenConnect protocol interoperability.

## Available Versions

| Version | Name | Analysis Status | Documentation |
|---------|------|-----------------|---------------|
| **5.1** | Cisco Secure Client 5.1 | ✅ Complete | [Analysis](5.1/cisco-secure-client-5-1) |
| **5.0** | Cisco Secure Client 5.0 | 🔄 In Progress | [Analysis](5.0/cisco-secure-client-5-0) |
| **4.10** | AnyConnect 4.10 | 🔄 In Progress | [Analysis](4.10/cisco-secure-client-4-10) |
| **4.9** | AnyConnect 4.9 | 📋 Planned | [Analysis](4.9/cisco-secure-client-4-9) |

## Version Comparison

See [Version Comparison](./version-comparison) for detailed comparison across all versions (coming soon).

## Purpose

This analysis is conducted under DMCA §1201(f) for interoperability purposes, enabling the development of compatible open-source VPN server implementations.

## Analysis Scope

- **Protocol Specification**: CSTP, DTLS, authentication methods
- **Cryptography**: TLS/DTLS versions, cipher suites, certificate handling
- **Platform Coverage**: Windows, Linux (x86_64, ARM64), macOS
- **Package Types**: Predeploy (standalone), Webdeploy (server-side), Utilities

## Latest Findings

### Version 5.1 (Latest)

**Release**: 5.1.12.146 (September 2024)
**Analysis Date**: October 30, 2025
**Status**: ✅ Complete

**Key Findings**:
- ✅ TLS 1.3 support confirmed (preferred, with TLS 1.2 fallback)
- ✅ 197 binaries analyzed (Linux x64, ARM64, Windows x64/ARM64, macOS)
- ✅ Protocol 100% backward compatible with 4.x
- ✅ New Linux ARM64 platform support
- ✅ Modular architecture: DART, NVM (IPFIX), ISE Posture, ZTA
- ✅ Boost C++ dependency introduced
- ✅ OpenSSL 1.1.0+ required for TLS 1.3

[See detailed 5.1 analysis →](5.1/cisco-secure-client-5-1)

## Analysis Methodology

All analyses are performed using professional reverse engineering tools:

### Tools Used

- **GNU Binutils**: readelf, nm, objdump, strings
- **file**: Binary identification
- **ldd**: Dependency analysis
- **Python**: Automated cataloging

### Ethical Guidelines

- ✅ Analysis for **interoperability** purposes
- ✅ Security research and **protocol documentation**
- ✅ Server implementation **compatibility testing**
- ❌ **No malicious intent** or exploitation
- ❌ **No proprietary code** reproduction

## Protocol Documentation

See [OpenConnect Protocol Reference](/docs/openconnect-protocol/) for comprehensive protocol specifications.

## For WolfGuard Developers

Key insights from this analysis inform the [WolfGuard](/docs/wolfguard/) server implementation:
- Protocol compatibility matrices
- Cipher suite selection
- Authentication method support
- Client feature expectations

## Server Compatibility

### ocserv-modern

**Compatibility**: ✅ Full support for Cisco Secure Client 5.1.12.146

**Requirements**:
- WolfSSL 5.7.6 or later (TLS 1.3 support)
- IPv6 dual-stack configuration
- Optional: IPFIX collector for NVM telemetry
- Optional: Cisco ISE integration for posture assessment

### ocserv (vanilla)

**Compatibility**: ⚠️ Partial support (TLS 1.2 only)

**Limitations**:
- No TLS 1.3 support (GnuTLS limitation)
- Client will fall back to TLS 1.2
- No NVM/IPFIX support
- No ISE Posture support

## Legal Notice

:::warning Legal Notice
All reverse engineering is performed for **legitimate interoperability** and **security research** purposes in compliance with applicable laws including DMCA §1201(f). No proprietary code is reproduced. Analysis is based on publicly available binaries. This documentation is not endorsed by Cisco Systems, Inc.
:::

## Contributing

To contribute analysis or request specific version analysis:

1. Open an issue at [wolfguard-docs repository](https://github.com/wolfguard/wolfguard-docs)
2. Provide version number and specific analysis requests
3. Follow ethical guidelines for reverse engineering


## Related Documentation

- [OpenConnect Protocol](/docs/openconnect-protocol/)
- [ocserv-modern Implementation](/docs/wolfguard/)
- [WolfSSL Integration](/docs/wolfguard/wolfssl-integration)
- [Deployment Guides](/docs/guides/)

---

**Last Updated**: October 30, 2025
**Latest Version Analyzed**: 5.1.12.146

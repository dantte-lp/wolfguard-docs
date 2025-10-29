# OpenConnect Protocol Documentation

## Overview

This section contains comprehensive documentation of the **OpenConnect VPN Protocol**, which is a reverse-engineered implementation of Cisco's Secure Socket Layer (SSL) VPN protocol, also known as the **Cisco SSL Tunnel Protocol** or **AnyConnect Protocol**.

## About the Protocol

The OpenConnect protocol is used by Cisco AnyConnect/Secure Client to establish secure VPN connections. Through extensive reverse engineering and analysis of Cisco Secure Client 5.x binaries, we've documented the protocol specifications, cryptographic implementations, and authentication mechanisms.

## What You'll Find Here

### 📡 [Protocol Specifications](./protocol/crypto.md)
- **Cryptographic Standards**: TLS 1.2/1.3, DTLS 1.2/1.3, cipher suites
- **Authentication Methods**: Username/password, certificates, OTP, SAML
- **Certificate Management**: PKI infrastructure, certificate pinning
- **Network Virtual Management (NVM)**: Telemetry and monitoring

### 🔍 [Reverse Engineering](./analysis/decompilation.md)
- **Binary Analysis**: Decompilation tools and methodologies (Ghidra, Reko, angr)
- **Analysis Workflow**: Step-by-step reverse engineering process
- **Findings**: Security vulnerabilities and implementation insights
- **Best Practices**: Reverse engineering for interoperability

### 📚 [Protocol Reference](./reference/rfc-draft.md)
- **RFC Draft**: Proposed standardization of OpenConnect protocol
- **Version Differences**: Cisco Secure Client 5.1.2 vs 5.1.12 vs 5.x+
- **Version Summaries**: Comprehensive analysis of protocol changes
- **Compatibility Guide**: Cross-version interoperability

## Purpose

This documentation serves multiple purposes:

1. **Interoperability**: Enable open-source implementations (wolfguard, openconnect)
2. **Security Research**: Document security mechanisms and potential vulnerabilities
3. **Protocol Standardization**: Provide basis for RFC submission
4. **Education**: Help developers understand modern VPN protocols

## Legal & Ethical Notice

This documentation is produced through clean-room reverse engineering for **interoperability purposes only**, which is legally protected in most jurisdictions. We:

- ✅ DO NOT distribute or modify Cisco binaries
- ✅ DO NOT circumvent security mechanisms
- ✅ DO document publicly observable protocol behavior
- ✅ DO follow responsible disclosure for vulnerabilities

## Related Projects

- **[wolfguard](../wolfguard/intro.md)**: Modern OpenConnect server implementation
- **[openconnect](https://www.infradead.org/openconnect/)**: OpenConnect VPN client
- **[Cisco Secure Client](https://www.cisco.com/c/en/us/products/security/secure-client/)**: Official Cisco VPN client

## Contributing

Found inaccuracies or have additional protocol insights? See our [Contributing Guide](https://github.com/dantte-lp/wolfguard-docs/blob/main/CONTRIBUTING.md) for how to submit improvements.

---

**Status**: Active Development
**Protocol Version**: Cisco Secure Client 5.1.12+
**Last Updated**: 2025-10-29

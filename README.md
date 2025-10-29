# OpenConnect Protocol Documentation

[![Documentation](https://img.shields.io/badge/docs-latest-blue.svg)](https://docs.wolfguard.io)
[![License](https://img.shields.io/badge/license-CC--BY--SA--4.0-green.svg)](./LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

> Comprehensive documentation of the OpenConnect VPN protocol through reverse engineering of Cisco Secure Client 5.x, with guides for vanilla ocserv and wolfguard implementations.

**Live Documentation**: [https://docs.wolfguard.io](https://docs.wolfguard.io)

## 🎯 Project Overview

This documentation project serves three main purposes:

1. **OpenConnect Protocol**: Reverse-engineered specifications of Cisco's AnyConnect protocol
2. **Vanilla ocserv**: Documentation for the original OpenConnect Server
3. **wolfguard**: Documentation for the next-generation implementation

## 📚 Documentation Structure

### 1. 📡 [OpenConnect Protocol](https://docs.wolfguard.io/docs/openconnect-protocol/intro)
- Protocol specifications (TLS/DTLS, crypto, authentication)
- Binary analysis (Ghidra, Reko, angr)
- Protocol reference (RFC draft, version diffs)

### 2. 🔧 [OpenConnect Server (Vanilla)](https://docs.wolfguard.io/docs/ocserv-vanilla/intro)
- Features (DPD, DNS, OGS, 2FA, DART)
- Integration (RADIUS, scripts, PAM, LDAP)

### 3. 🚀 [wolfguard](https://docs.wolfguard.io/docs/wolfguard/intro)
- C23, WolfSSL, DTLS 1.3, WolfSentry
- Implementation guides

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/dantte-lp/cisco-secure-client-docs.git
cd cisco-secure-client-docs
npm install

# Start development server
npm start

# Build and deploy
make deploy
```

## 🛠️ Technology Stack

- Docusaurus 3.5.2
- Kroki 0.25.0 (diagrams)
- Podman + crun
- Nginx 1.29
- Traefik (reverse proxy)

## 📄 License

CC-BY-SA-4.0 - See [LICENSE](./LICENSE)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 🔒 Security

See [SECURITY.md](./SECURITY.md) for reporting vulnerabilities

---

**Last Updated**: 2025-10-29 | **Version**: 1.0.0 | **Status**: Production

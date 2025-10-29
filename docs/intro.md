---
sidebar_position: 1
slug: /
---

# OpenConnect Protocol Documentation

Welcome to the comprehensive documentation for the OpenConnect Protocol, based on reverse engineering of **Cisco Secure Client 5.x+** (formerly AnyConnect).

## What is This?

This documentation represents extensive reverse engineering and analysis of the proprietary OpenConnect VPN protocol as implemented by Cisco Secure Client. The goal is to provide:

- **Complete protocol understanding** for implementing compatible servers
- **Security analysis** of cryptographic implementations
- **Binary analysis techniques** for understanding proprietary protocols
- **Implementation guidance** for WolfSSL-based servers

## Key Areas

### Protocol Analysis

Deep dive into the protocol internals:

- [Cryptographic Analysis](/docs/protocol/crypto) - TLS, DTLS, and cipher implementation
- [Authentication Methods](/docs/protocol/authentication) - OTP, SAML, and multi-factor auth
- [Certificate Handling](/docs/protocol/certificates) - PKI and certificate validation
- [NVM Telemetry](/docs/protocol/nvm-telemetry) - Network Visibility Module analysis

### Implementation Guide

Practical guides for building compatible systems:

- [WolfSSL Integration](/docs/implementation/wolfssl) - Complete WolfSSL implementation
- [Compatibility Guide](/docs/implementation/compatibility) - Cisco compatibility matrix
- [Quick Start](/docs/implementation/quick-start) - Get up and running quickly
- [Deployment Guide](/docs/implementation/deployment) - Production deployment

### Binary Analysis

Methodology and tools for reverse engineering:

- [Decompilation Tools](/docs/analysis/decompilation) - IDA Pro, Ghidra, Binary Ninja
- [Analysis Workflow](/docs/analysis/workflow) - Step-by-step RE process
- [Advanced Findings](/docs/analysis/findings) - Deep binary analysis results

### Features

Protocol features and behaviors:

- [DPD and Timers](/docs/features/dpd-timers) - Dead Peer Detection
- [DNS Behavior](/docs/features/dns) - DNS handling and split-tunneling
- [Optimal Gateway Selection](/docs/features/ogs) - Gateway selection logic
- [Windows Features](/docs/features/windows) - Platform-specific features

## Target Audience

This documentation is intended for:

- **Protocol Implementers** - Building OpenConnect-compatible servers
- **Security Researchers** - Understanding Cisco's VPN security
- **Network Engineers** - Deploying and troubleshooting VPN infrastructure
- **Reverse Engineers** - Learning binary analysis techniques

## Project Background

This work is part of the **wolfguard** project, which aims to create a modern, WolfSSL-based OpenConnect VPN server that maintains full compatibility with Cisco Secure Client 5.x+.

### Why This Matters

1. **Open Implementation** - Enables open-source VPN infrastructure
2. **Security Research** - Transparent security analysis
3. **Interoperability** - Better client/server compatibility
4. **Knowledge Preservation** - Documents a widely-used but proprietary protocol

## Getting Started

If you're new here, start with:

1. [Overview](/docs/getting-started/overview) - High-level protocol overview
2. [Quick Start](/docs/getting-started/quick-start) - Set up a test environment
3. [Comprehensive Summary](/docs/reference/summary) - Executive summary of findings

## Contributing

This documentation is a living project. Contributions, corrections, and additional analysis are welcome.

**Related Projects:**
- [wolfguard](https://github.com/dantte-lp/wolfguard) - Modern OpenConnect server
- [OpenConnect](https://www.infradead.org/openconnect/) - Official OpenConnect client

## Legal Notice

This documentation is the result of legitimate reverse engineering for interoperability purposes. All analysis was performed on legally obtained software for the purpose of creating compatible implementations.

**Disclaimer:** This documentation is provided for educational and interoperability purposes. Use responsibly and in accordance with applicable laws.

---

**Last Updated:** October 2025
**Protocol Version Coverage:** Cisco Secure Client 5.0 - 5.1+
**Primary Analysis Platform:** Windows, macOS, Linux clients

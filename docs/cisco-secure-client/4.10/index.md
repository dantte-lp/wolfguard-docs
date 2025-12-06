---
id: cisco-secure-client-4-10
title: AnyConnect 4.10 Analysis
sidebar_label: Version 4.10
sidebar_position: 3
---

# AnyConnect 4.10 Analysis

🔄 **Status**: Analysis in progress

## Overview

This section will contain detailed analysis of AnyConnect version 4.10.08029 once extraction and analysis is complete.

**Package Inventory**:
- 17 binary packages (898 MB total)
- Linux x86_64 (with DEB/RPM packages), macOS, Windows x64/ARM64
- Introduced External SSO module

## Analysis Plan

See [Analysis Plans](https://github.com/wolfguard/cisco-secure-client/tree/main/analysis):
- ANALYSIS_PLAN_PREDEPLOY.md
- ANALYSIS_PLAN_WEBDEPLOY.md
- ANALYSIS_PLAN_UTILS.md

## Expected Coverage

- [ ] Binary inventory and extraction
- [ ] Protocol analysis (CSTP/DTLS)
- [ ] Cryptography analysis (TLS 1.2, cipher suites)
- [ ] Cross-version comparison (4.9 → 4.10 → 5.0 → 5.1)
- [ ] Platform-specific features
- [ ] External SSO integration analysis

## Key Features (4.10 Series)

Based on preliminary examination:

- **Platforms**: Linux x64 (DEB/RPM), macOS Intel, Windows x64/ARM64
- **TLS Protocol**: TLS 1.2 (no TLS 1.3)
- **DTLS Protocol**: DTLS 1.0, DTLS 1.2
- **New in 4.10**:
  - External SSO module (SAML authentication)
  - DEB and RPM packages for Linux (in addition to tarball)
  - Windows ARM64 enhanced support
- **HostScan**: Version 4.10.08029 included
- **VPN API**: Enhanced SDK packages

## Progress Tracking

Track progress in [GitHub Issues](https://github.com/wolfguard/cisco-secure-client/issues).

---

*This page will be populated as analysis progresses.*

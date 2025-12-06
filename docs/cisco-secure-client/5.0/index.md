---
id: cisco-secure-client-5-0
title: Cisco Secure Client 5.0 Analysis
sidebar_label: Version 5.0
sidebar_position: 2
---

# Cisco Secure Client 5.0 Analysis

🔄 **Status**: Analysis in progress

## Overview

This section will contain detailed analysis of Cisco Secure Client version 5.0.05040 once extraction and analysis is complete.

**Package Inventory**:
- 16 binary packages (888 MB total)
- First version with "Cisco Secure Client" branding (renamed from AnyConnect)
- Linux x86_64, macOS, Windows x64/ARM64

## Analysis Plan

See [Analysis Plans](https://github.com/wolfguard/cisco-secure-client/tree/main/analysis):
- ANALYSIS_PLAN_PREDEPLOY.md
- ANALYSIS_PLAN_WEBDEPLOY.md
- ANALYSIS_PLAN_UTILS.md

## Expected Coverage

- [ ] Binary inventory and extraction
- [ ] Protocol analysis (CSTP/DTLS)
- [ ] Cryptography analysis (TLS 1.2/1.3, cipher suites)
- [ ] Cross-version comparison (4.9 → 4.10 → 5.0 → 5.1)
- [ ] Platform-specific features
- [ ] Rebranding impact analysis

## Key Features (5.0 Series)

Based on preliminary examination:

- **Branding**: First release as "Cisco Secure Client" (previously AnyConnect)
- **Platforms**: Linux x64 (DEB/RPM), macOS Universal, Windows x64/ARM64
- **TLS Protocol**: TLS 1.2, potentially TLS 1.3 (to be confirmed)
- **DTLS Protocol**: DTLS 1.2
- **New in 5.0**:
  - Unified security client platform
  - Enhanced Profile Editor (16 MB, up from 11-12 MB)
  - External SSO module continued
- **No HostScan**: Module discontinued in favor of integrated posture assessment
- **VPN API**: Continued SDK support

## Progress Tracking

Track progress in [GitHub Issues](https://github.com/wolfguard/cisco-secure-client/issues).

---

*This page will be populated as analysis progresses.*

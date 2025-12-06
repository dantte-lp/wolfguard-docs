---
id: version-comparison
title: Cisco Secure Client Version Comparison
sidebar_label: Version Comparison
description: Comprehensive technical comparison of Cisco Secure Client versions 4.9, 4.10, 5.0, and 5.1 for protocol reverse engineering
---

# Cisco Secure Client Version Comparison

:::info Analysis Context
This document provides a detailed technical comparison of 4 major Cisco Secure Client versions (4.9.06037, 4.10.08029, 5.0.05040, 5.1.12.146) for **DMCA §1201(f) interoperability analysis** as part of the WolfGuard VPN project.
:::

## Executive Summary

| Version | Release Date | Status | Key Milestone |
|---------|--------------|--------|---------------|
| **4.9.06037** | Sep 4, 2024 | ⚠️ **END-OF-LIFE** | Last AnyConnect 4.x release; TLS 1.2 only |
| **4.10.08029** | Feb 26, 2024 | ⚠️ **END-OF-LIFE** | WPA3 support; SSLv3 disabled |
| **5.0.05040** | Aug 14, 2024 | ✅ **Active** | **TLS 1.3 debut**; rebranding to Cisco Secure Client |
| **5.1.12.146** | Sep 25, 2025 | ✅ **Latest** | Post-quantum crypto; Linux ARM64; macOS 26 |

**Critical Protocol Changes:**
- **TLS 1.3 support** introduced in 5.0.01242 (requires ASA 9.19.1+)
- **DTLS remains at 1.2** across all versions (DTLS 1.3 not yet implemented)
- **Post-quantum cryptography** (IKEv2 PPK) added in 5.1.x
- **Cipher suite modernization**: Removed DES, 3DES, RC4 (4.9+); added TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384 (5.0+)

---

## Version Timeline

```kroki type=timeline
@startuml
concise "AnyConnect 4.9" as AC49
concise "AnyConnect 4.10" as AC410
concise "Cisco Secure Client 5.0" as CSC50
concise "Cisco Secure Client 5.1" as CSC51

@AC49
0 is Released
+6M is {-}
+12M is EOL

@AC410
+3M is Released
+9M is {-}
+15M is EOL

@CSC50
+9M is Released
+15M is {TLS_1.3}
+21M is {-}

@CSC51
+15M is Released
+21M is {PQ_Crypto}
+27M is Latest

@enduml
```

---

## Operating System Support Matrix

### Windows

| OS Version | 4.9.06037 | 4.10.08029 | 5.0.05040 | 5.1.12.146 |
|------------|-----------|------------|-----------|------------|
| **Windows 11 (x64)** | ✅ | ✅ | ✅ | ✅ |
| **Windows 10 (x64)** | ✅ | ✅ | ✅ | ✅ |
| **Windows 10 (x86)** | ✅ | ✅ | ✅ | ✅ |
| **Windows 10 ARM64** | ✅ VPN only | ❌ **REMOVED** | ✅ Full support | ❌ **REMOVED in 5.1.2.42** |
| **Windows 11 ARM64** | ✅ VPN only | ✅ VPN only | ✅ Full support | ✅ Full support |
| **Windows 8.1** | ✅ | ❌ | ❌ | ❌ |
| **Windows 7** | ✅ | ❌ | ❌ | ❌ |

### macOS

| OS Version | 4.9.06037 | 4.10.08029 | 5.0.05040 | 5.1.12.146 |
|------------|-----------|------------|-----------|------------|
| **macOS 26 Tahoe** | ❌ | ❌ | ❌ | ✅ **5.1.12.146+** |
| **macOS 15 Sequoia** | ❌ | ❌ | ❌ | ✅ **5.1.6.103+** |
| **macOS 14 Sonoma** | ❌ | ✅ | ✅ | ✅ **5.1.0.136+** |
| **macOS 13 Ventura** | ❌ | ✅ | ✅ | ✅ |
| **macOS 12 Monterey** | ❌ | ✅ | ✅ | ❌ **REMOVED in 5.1.6.103** |
| **macOS 11 Big Sur** | ✅ | ✅ | ✅ | ❌ **REMOVED in 5.1.3.62** |
| **macOS 10.15 Catalina** | ✅ | ❌ | ✅ VPN only | ❌ |
| **macOS 10.14 Mojave** | ✅ | ❌ | ✅ VPN only | ❌ |
| **macOS 10.13 High Sierra** | ✅ | ❌ | ✅ VPN only | ❌ |
| **macOS 10.10+** | ❌ | ❌ | ✅ VPN only | ❌ |

### Linux

| Distribution | 4.9.06037 | 4.10.08029 | 5.0.05040 | 5.1.12.146 |
|--------------|-----------|------------|-----------|------------|
| **Red Hat 10.x** | ❌ | ❌ | ❌ | ✅ |
| **Red Hat 9.x** | ❌ | ✅ | ✅ | ✅ |
| **Red Hat 8.x** | ✅ 8.2+ | ✅ | ✅ | ✅ |
| **Red Hat 7.x** | ✅ | ❌ | ❌ | ❌ |
| **Ubuntu 24.04 LTS** | ❌ | ❌ | ✅ | ✅ |
| **Ubuntu 22.04 LTS** | ❌ | ✅ | ✅ | ✅ |
| **Ubuntu 20.04 LTS** | ✅ | ✅ | ✅ | ❌ **REMOVED in 5.1.10.233** |
| **Ubuntu 18.04 LTS** | ✅ | ❌ | ❌ | ❌ |
| **Ubuntu 16.04 LTS** | ✅ | ❌ | ❌ | ❌ |
| **SUSE SLES 15** | ❌ | ✅ | ✅ Limited | ✅ Limited |
| **SUSE SLES 12** | ❌ | ✅ 12.3+ | ✅ Limited | ❌ **REMOVED in 5.1.10.233** |
| **Linux ARM64** | ❌ | ❌ | ❌ | ✅ **Added in 5.1.11.388** |

---

## TLS/DTLS Protocol Evolution

### Timeline of Protocol Support

| Protocol | 4.9.06037 | 4.10.08029 | 5.0.05040 | 5.1.12.146 | Notes |
|----------|-----------|------------|-----------|------------|-------|
| **TLS 1.3** | ❌ | ❌ | ✅ **5.0.01242+** | ✅ | Requires ASA 9.19.1+ |
| **TLS 1.2** | ✅ | ✅ | ✅ | ✅ | Requires ASA 9.3.2+ |
| **TLS 1.1** | ⚠️ Deprecated | ⚠️ Deprecated | ❌ | ❌ | Fallback only |
| **TLS 1.0** | ⚠️ Deprecated | ⚠️ Deprecated | ❌ | ❌ | Fallback only |
| **SSLv3** | ❌ Blocked | ❌ **Explicitly Disabled** | ❌ | ❌ | Security vulnerability |
| **DTLS 1.2** | ✅ | ✅ | ✅ | ✅ | Requires ASA 9.10.1+ |
| **DTLS 1.3** | ❌ | ❌ | ❌ | ❌ | **Not yet implemented** |

:::warning DTLS 1.3 Gap
Despite TLS 1.3 support in 5.0+, **DTLS remains at version 1.2** across all Cisco Secure Client versions. DTLS 1.3 (RFC 9147) implementation is not yet available in any production release.
:::

### TLS 1.3 Implementation Details (5.0.01242+)

**New Cipher Suites:**
```
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
```

**Server Requirements:**
- ASA 9.19.1 or later
- Automatic fallback to TLS 1.2 if headend lacks TLS 1.3 support

**Limitations:**
- DTLS 1.3 not supported (remains DTLS 1.2)
- No ChaCha20-Poly1305 cipher suite
- Extended Master Secret (EMS) enabled for TLS only (disabled for DTLS per CiscoSSL library)

---

## Cipher Suite Evolution

### Removed Cipher Suites (4.9.00086+)

**SSL VPN:**
```
DHE-RSA-AES256-SHA
DES-CBC3-SHA
```

**IKEv2/IPsec:**
```
Encryption: DES, 3DES
PRF: MD5
Integrity: MD5
DH Groups: 2, 5, 14, 24
```

### Added Cipher Suites (5.0.01242+)

**TLS 1.3:**
```
TLS_AES_128_GCM_SHA256      # Mandatory per RFC 8446
TLS_AES_256_GCM_SHA384      # Recommended for high security
```

**Rationale:** Removed all CBC-mode ciphers, RC4, MD5, and weak DH groups to comply with NIST SP 800-52 Rev. 2 and modern cryptographic standards.

---

## Authentication Mechanisms

### Comparison Matrix

| Method | 4.9.06037 | 4.10.08029 | 5.0.05040 | 5.1.12.146 | Implementation Details |
|--------|-----------|------------|-----------|------------|------------------------|
| **Certificate (X.509)** | ✅ | ✅ | ✅ | ✅ | CAPI 2.0 (Win), Keychain (macOS), CryptoTokenKit (macOS 10.12+) |
| **Smartcard** | ✅ | ✅ Enhanced | ✅ | ✅ | CSP/KSP support; removal policies (4.10+) |
| **SAML (Embedded Browser)** | ✅ Safari 14.1.2+ | ✅ | ✅ | ✅ | Requires ASA 9.17+ for external browser |
| **SAML (External Browser)** | ✅ 4.10.04065+ | ✅ | ✅ | ✅ | Windows/macOS/Linux |
| **EAP-FAST** | ✅ | ✅ | ✅ | ✅ | Requires ISE 2.4p5+ (TLS 1.2 defect in earlier versions) |
| **Machine Certificate** | ✅ | ✅ | ✅ Enrollment | ✅ Enrollment | Automatic enrollment without user action (5.0+) |
| **Machine Password** | ✅ Registry | ✅ Registry | ✅ Registry | ✅ Registry | Windows only; requires registry configuration |
| **FIDO2/WebAuthN** | ❌ | ❌ | ✅ | ✅ | U2F, passwordless authentication |
| **IKEv2 PSK** | ✅ | ✅ | ✅ | ✅ | Pre-shared key |
| **IKEv2 PPK (Post-Quantum)** | ❌ | ❌ | ❌ | ✅ **NEW** | RFC 8784 post-quantum pre-shared key |

:::tip Post-Quantum Cryptography
Version 5.1+ introduces **IKEv2 PPK (Post-quantum Pre-shared Key)** per RFC 8784, providing quantum-resistant authentication for IKEv2 tunnels.
:::

---

## Module Updates

### Component Versions

#### HostScan / Secure Firewall Posture

| Version | Component Name | Windows | macOS | Linux | Notes |
|---------|----------------|---------|-------|-------|-------|
| **4.9.06037** | HostScan | 4.9.06046 | 4.9.06046 | 4.9.06046 | OPSWAT engine updates |
| **4.10.08029** | HostScan | 4.10.08029 | 4.10.08029 | 4.10.08029 | OPSWAT engine updates |
| **5.0.05040** | **Secure Firewall Posture** | 5.0.05040 | 5.0.05040 | 5.0.05040 | **Renamed from HostScan**; OPSWAT updates |
| **5.1.12.146** | Secure Firewall Posture | 5.1.12.146 | 5.1.12.146 | 5.1.12.146 | IPv6 pure network support |

:::info Branding Change
HostScan was renamed to **Secure Firewall Posture** starting with version 5.0. The functionality remains the same but includes additional IPv6 support in 5.1.
:::

#### Network Visibility Module (NVM)

| Version | Features |
|---------|----------|
| **4.9.06037** | DTLS secure data transmission |
| **4.10.08029** | Flow direction tracking; logged-in users list |
| **5.0.05040** | Timestamps, Secure Endpoint IDs, process flows collection |
| **5.1.12.146** | **mDTLS** (Mutual TLS authentication) for collector connections |

#### ThousandEyes Endpoint Agent

| Version | Windows | macOS | Linux | Notes |
|---------|---------|-------|-------|-------|
| **4.9.06037** | ❌ | ❌ | ❌ | Not available |
| **4.10.08029** | ❌ | ❌ | ❌ | Not available |
| **5.0.05040** | ✅ 5.0.04032+ | ✅ **NEW** 5.0.05040 | ❌ | macOS installer in predeploy package |
| **5.1.12.146** | ✅ | ✅ | ❌ | Version 2.9.0; required for Zero Trust Access |

#### ISE Posture Compliance Module

| Version | Windows Min | macOS Min | Linux Min | Notes |
|---------|-------------|-----------|-----------|-------|
| **4.9.06037** | 4.3.1634.6145 | 4.3.1634.6145 | 4.3.1634.6145 | ARM64 device detection (4.9.05042) |
| **4.10.08029** | 4.3.1634.6145 | 4.3.1935.4353 (arm64) | 4.3.1634.6145 | Native arm64 support (4.10.02086+) |
| **5.0.05040** | 4.3.2755+ | 4.3.2379 | 4.3.2063 | ARM64 support in 5.0.04032 |
| **5.1.12.146** | 4.3.2755+ | 4.3.2379+ | 4.3.2063+ | Full platform parity |

#### DART (Diagnostic and Reporting Tool)

| Version | Privileges | Notes |
|---------|------------|-------|
| **4.9.06037** | Admin (macOS, Ubuntu, RHEL) | Standard tool |
| **4.10.08029** | Admin (macOS, Ubuntu, RHEL) | Standard tool |
| **5.0.05040** | Admin (macOS, Ubuntu, RHEL) | ThousandEyes Endpoint Agent logs added |
| **5.1.12.146** | Admin (macOS, Ubuntu, RHEL) | Enhanced logging for all modules |

---

## Major Features by Version

### 4.9.06037 (September 2024)

**Key Features:**
- macOS VPN reconnection fix (CSCvw92182)
- DTLS session reliability improvements with ASA SSL gateway
- Windows NVM certificate validation in DTLS mode
- Smart card support enhancements for legacy CSP

**Limitations:**
- **END-OF-LIFE** release; no new features planned
- TLS 1.2 only (no TLS 1.3)
- Windows 7/8.1 support (deprecated platforms)

---

### 4.10.08029 (February 2024)

**Key Features:**
- **WPA3 Enhanced Open (OWE)** and **WPA3 Personal (SAE)** support
- **802.1x-SHA256** wireless authentication
- Dynamic Split Exclusions for macOS based on CNAME DNS responses
- EAP-FAST smartcard removal policy
- Network Access Manager PMF IGTK disabling (via `DisableIGTK` registry key)

**Branding:**
- DigiCert code signing certificate (replaced VeriSign; CSCvx78941)

**Deprecations:**
- Windows 10 ARM64 support removed
- Web Security module removed (EOS/EOL)

---

### 5.0.05040 (August 2024)

**Breakthrough Features:**

#### 🔐 TLS 1.3 Support (5.0.01242)
```
New Cipher Suites:
- TLS_AES_128_GCM_SHA256
- TLS_AES_256_GCM_SHA384

Requirements:
- ASA 9.19.1 or later
- Automatic fallback to TLS 1.2 for older headends
```

#### 🏢 Rebranding
- **Cisco AnyConnect Secure Mobility Client** → **Cisco Secure Client (including AnyConnect)**
- **HostScan** → **Secure Firewall Posture**
- License tiers: Apex/Plus → **Premier/Advantage**

#### 📊 ThousandEyes Integration
- macOS installer in predeploy package
- Network and application-layer performance monitoring
- DART log integration

#### 🔒 Security Enhancements
- ActiveX controls completely removed
- FIDO2, WebAuthN, U2F, passwordless authentication
- Certificate-based enrollment without user action

---

### 5.1.12.146 (September 2025 - Latest)

**Next-Generation Features:**

#### ⚛️ Post-Quantum Cryptography
```
IKEv2 PPK (Post-quantum Pre-shared Key)
- RFC 8784 implementation
- Quantum-resistant authentication
- PSK + PPK hybrid mode
```

#### 🐧 Linux ARM64 Support (5.1.11.388)
- Native ARM64 binaries
- Red Hat, Ubuntu compatibility
- Docker activation logging

#### 🍎 macOS 26 (Tahoe) Support
- Latest Apple OS compatibility (5.1.12.146+)
- macOS 15 Sequoia (5.1.6.103+)

#### 🛡️ Zero Trust Access Expansion
- Extended to all internet destinations
- Trusted Network Detection integration
- ThousandEyes Endpoint Agent 6.3+ required

#### 🌐 Network Enhancements
- **Always-On VPN for Linux** (specified host access when disconnected)
- **Dynamic Split Tunneling** with inclusion/exclusion override
- **Split Exclude Failover** (CSCwo32975): Routes split-exclude traffic via VPN when external connectivity unavailable
- **mDTLS for NVM**: Mutual TLS authentication for Network Visibility Module collectors
- **IPv6 Pure Network Support** for Secure Firewall Posture

#### 🔧 Captive Portal Detection
- Improved capabilities (CSCwj43435)
- Better hotel/airport WiFi compatibility

---

## Deprecations and Removals

### Operating Systems

| OS Removed | Last Supporting Version | Reason |
|------------|-------------------------|--------|
| **Windows 7** | 4.9.06037 | Microsoft EOS January 14, 2020 |
| **Windows 8.1** | 4.9.06037 | Microsoft EOS January 10, 2023 |
| **Windows 10 ARM64** | 4.10.08029 | Platform discontinuation; re-added in 5.0 |
| **macOS 10.10-10.13** | 4.9.06037 (full), 5.0 (VPN-only) | Apple deprecation |
| **macOS 11 Big Sur** | 5.0.05040 | Removed in 5.1.3.62 |
| **macOS 12 Monterey** | 5.0.05040 | Removed in 5.1.6.103 |
| **Ubuntu 16.04, 18.04** | 4.9.06037 | Canonical EOS |
| **Ubuntu 20.04** | 5.0.05040 | Removed in 5.1.10.233 |
| **SUSE 12** | 5.0.05040 | Removed in 5.1.10.233 |
| **Red Hat 7.x** | 4.9.06037 | Red Hat EOS June 30, 2024 |

### Protocols and Features

| Feature Removed | Version | Alternative |
|----------------|---------|-------------|
| **SSLv3** | 4.10.08029 (explicit disable) | TLS 1.2/1.3 |
| **DHE-RSA-AES256-SHA** | 4.9.00086 | TLS 1.3 cipher suites |
| **DES-CBC3-SHA** | 4.9.00086 | AES-GCM cipher suites |
| **IKEv2 DES/3DES encryption** | 4.9.00086 | AES-128/256 |
| **IKEv2 MD5 PRF/Integrity** | 4.9.00086 | SHA-256/SHA-384 |
| **IKEv2 DH groups 2, 5, 14, 24** | 4.9.00086 | Groups 19, 20, 21 (ECC) |
| **Web Security Module** | 4.10.08029 | Product EOS/EOL |
| **ActiveX controls** | 5.0.05040 | Native HTML5 |
| **AMP Enabler (macOS)** | 5.1.12.146 (CSCwo08874) | Secure Endpoint integration |
| **Firefox NSS certificate store** | 4.9.06037 (macOS) | macOS Keychain |
| **Umbrella Auto-Updates** | 5.0.05040 | Manual module management |

### Module Compatibility

:::danger Breaking Change in 5.0
Cisco Secure Client 5.0.x **CANNOT** use HostScan 4.x modules. Must use **Secure Firewall Posture 5.0.x** only.
:::

| Client Version | Compatible Posture Version | Notes |
|----------------|----------------------------|-------|
| 4.9.06037 | HostScan 4.9.x | Must match major version |
| 4.10.08029 | HostScan 4.10.x | Must match major version |
| 5.0.05040 | Secure Firewall Posture 5.0.x | **HostScan incompatible** |
| 5.1.12.146 | Secure Firewall Posture 5.1.x | **HostScan incompatible** |

---

## Security Fixes and CVEs

:::warning CVE Disclosure Limited
Cisco release notes do not include comprehensive CVE listings. Security fixes are referenced by internal defect IDs (CSCxx) rather than public CVE numbers.
:::

### Notable Security Defects Resolved

#### 4.9.06037
- **CSCvw92182**: macOS VPN reconnection vulnerability after ASA SSL gateway connection
- **CSCvw53140**: Windows smartcard authentication bypass (legacy CSP support)
- **CSCvy53730**: ISE Compliance Module update restriction (requires 4.3.1634.6145+)

#### 4.10.08029
- **CSCvx78941**: Code signing certificate change (VeriSign → DigiCert)
- **CSCvm03681**: EAP-FAST TLS 1.2 defect in ISE &lt;2.4p5
- **SHA512 certificate validation issues** (resolved)

#### 5.0.05040
- **CSCwc56173**: VPN connection hang after authentication failure
- **ARM64 platform stability improvements**
- **Windows 11 24H2 location services API compatibility**

#### 5.1.12.146
- **CSCwo32464**: Zero Trust Access certificate renewal issue
- **CSCwj43435**: Captive portal detection improvements
- **CSCwo32975**: Split Exclude Failover routing vulnerability
- **Umbrella encryption compatibility fixes**

---

## Migration Recommendations

### From 4.9.06037 → 5.1.12.146

:::caution Major Upgrade Path
This is a **2-generation upgrade** skipping version 5.0. Recommended path: **4.9 → 5.0 → 5.1** to avoid compatibility issues.
:::

**Pre-Migration Checklist:**
1. ✅ Verify ASA version **9.19.1+** for TLS 1.3 support
2. ✅ Upgrade ISE to **2.4p5+** for EAP-FAST TLS 1.2 compatibility
3. ✅ Replace HostScan modules with **Secure Firewall Posture 5.1.x**
4. ✅ Update ASDM to **7.17.x+** for SAML external browser
5. ✅ Verify OS compatibility (Windows 7/8.1 **NOT** supported)
6. ✅ Review deprecated cipher suite usage (remove DES, 3DES, MD5)

**Breaking Changes:**
- HostScan 4.x → Secure Firewall Posture 5.x (incompatible)
- Windows 7/8.1 support dropped
- macOS &lt;11 support dropped
- Ubuntu 16.04/18.04 support dropped

**New Capabilities:**
- TLS 1.3 with modern cipher suites
- Post-quantum cryptography (IKEv2 PPK)
- Zero Trust Access
- Linux ARM64 support
- ThousandEyes integration

---

### From 4.10.08029 → 5.1.12.146

:::info Recommended Upgrade Path
Single-generation upgrade. Path: **4.10 → 5.0 → 5.1** or **4.10 → 5.1 directly** (with caution).
:::

**Pre-Migration Checklist:**
1. ✅ Verify ASA version **9.19.1+** for TLS 1.3
2. ✅ Update ASDM to **7.17.x+**
3. ✅ Replace HostScan 4.10.x with **Secure Firewall Posture 5.1.x**
4. ✅ Verify macOS &lt;12 not in deployment (Monterey removed in 5.1.6.103)
5. ✅ Update ISE Posture Compliance Modules (Windows 4.3.2755+, macOS 4.3.2379+)

**Breaking Changes:**
- HostScan → Secure Firewall Posture (module replacement required)
- macOS 11/12 support dropped
- Ubuntu 20.04 support dropped (in 5.1.10.233)
- AMP Enabler removed from macOS

**New Capabilities:**
- TLS 1.3
- Post-quantum cryptography
- mDTLS for NVM
- IPv6 pure network support

---

### From 5.0.05040 → 5.1.12.146

:::tip Straightforward Upgrade
Same-generation upgrade with minimal breaking changes. Recommended for production environments already on Secure Client 5.x.
:::

**Pre-Migration Checklist:**
1. ✅ Verify ThousandEyes Endpoint Agent **6.3+** if using Zero Trust Access
2. ✅ Update Secure Firewall Posture to **5.1.x** (matching client version)
3. ✅ Review macOS version requirements (12 Monterey dropped in 5.1.6.103)
4. ✅ Test Linux ARM64 binaries if deploying to ARM platforms

**Breaking Changes:**
- macOS 11 Big Sur removed (5.1.3.62)
- macOS 12 Monterey removed (5.1.6.103)
- Ubuntu 20.04 removed (5.1.10.233)
- SUSE 12 removed (5.1.10.233)
- AMP Enabler removed from macOS

**New Capabilities:**
- Post-quantum cryptography (IKEv2 PPK)
- Linux ARM64 native support
- macOS 26 Tahoe support
- Zero Trust Access expansion
- Always-On VPN for Linux
- mDTLS for NVM
- Split Exclude Failover

**Upgrade Procedure:**
1. Deploy predeploy installers (recommended over web deployment)
2. Do **NOT** remove registry entries during SCCM deployments
3. Skip version **5.1.8.105** (certificate renewal issue; use 5.1.8.122+)
4. macOS 13+ requires admin privileges for fresh install/upgrade

---

## Interoperability Analysis Recommendations

### Priority Targets for Reverse Engineering

Based on protocol evolution and feature adoption:

1. **Version 5.1.12.146** (Highest Priority)
   - Latest TLS 1.3 implementation
   - Post-quantum cryptography reference
   - Most complete feature set
   - Active security updates

2. **Version 5.0.05040** (High Priority)
   - **TLS 1.3 debut** (critical for protocol analysis)
   - First Cisco Secure Client branding
   - Baseline for modern cryptography

3. **Version 4.10.08029** (Medium Priority)
   - Last major AnyConnect 4.x release
   - WPA3 support reference
   - TLS 1.2 mature implementation

4. **Version 4.9.06037** (Low Priority)
   - END-OF-LIFE
   - Legacy compatibility reference only
   - TLS 1.2 baseline

### Critical Protocol Differences for WolfGuard Implementation

| Feature | Implementation Complexity | Version Required | Notes |
|---------|---------------------------|------------------|-------|
| **TLS 1.3** | High | 5.0.01242+ | wolfSSL 5.8.2+ native API; C23 support |
| **DTLS 1.2** | High | All versions | Current standard; DTLS 1.3 not in Cisco |
| **Post-Quantum Crypto** | Very High | 5.1.x | IKEv2 PPK (RFC 8784); future-proofing |
| **mDTLS (NVM)** | Medium | 5.1.x | Mutual TLS for collector connections |
| **Dynamic Split Tunneling** | Medium | 4.10+ | CNAME DNS response handling |
| **Zero Trust Access** | Very High | 5.1.x | ThousandEyes integration required |
| **Always-On VPN (Linux)** | Low | 5.1.x | Selective host access when disconnected |

---

## Binary Analysis Inventory Reference

:::info Binary Package Counts
For detailed binary package cataloging and decompilation planning, see:
- [Binary Inventory](/opt/projects/repositories/cisco-secure-client/analysis/BINARY_INVENTORY.md)
- [Decompilation Workflow](/opt/projects/repositories/cisco-secure-client/analysis/DECOMPILATION_WORKFLOW.md)
:::

**Package Distribution:**

| Version | Total Packages | Windows | Linux | macOS | Total Size |
|---------|----------------|---------|-------|-------|------------|
| **4.9.06037** | 17 | 7 | 4 | 6 | 754 MB |
| **4.10.08029** | 17 | 7 | 4 | 6 | 898 MB |
| **5.0.05040** | 16 | 7 | 4 | 5 | 888 MB |
| **5.1.12.146** | 20 | 8 | 4 | 8 | 2.3 GB |
| **Total** | **72** | **29** | **16** | **25** | **4.8 GB** |

---

## References

### Official Cisco Documentation

1. **Release Notes for Cisco AnyConnect Secure Mobility Client, Release 4.9**
   https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect49/release/notes/release-notes-anyconnect-4-9.html

2. **Release Notes for Cisco AnyConnect Secure Mobility Client, Release 4.10**
   https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/anyconnect410/release/notes/release-notes-anyconnect-4-10.html

3. **Release Notes for Cisco Secure Client (including AnyConnect), Release 5.0**
   https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/Cisco-Secure-Client-5/release/notes/release-notes-cisco-secure-client-5-0.html

4. **Release Notes for Cisco Secure Client (including AnyConnect), Release 5.1**
   https://www.cisco.com/c/en/us/td/docs/security/vpn_client/anyconnect/Cisco-Secure-Client-5/release/notes/release-notes-cisco-secure-client-5-1.html

### WolfGuard Project Documentation

- [Reverse Engineering Manifest](./reverse-engineering-manifest.md)
- [Methodology Comparison](./methodology-comparison.md)
- [IDA Pro Setup Guide](./tools/ida-pro-setup.md)
- [Binary Ninja Assessment](./tools/binary-ninja-assessment.md)
- [Batch Analysis Workflow](./workflows/batch-analysis.md)
- [Re-Implementation Roadmap](./re-implementation-roadmap.md)

### Standards References

- **RFC 8446**: The Transport Layer Security (TLS) Protocol Version 1.3
- **RFC 9147**: The Datagram Transport Layer Security (DTLS) Protocol Version 1.3
- **RFC 8784**: Mixing Preshared Keys in the Internet Key Exchange Protocol Version 2 (IKEv2)
- **NIST SP 800-52 Rev. 2**: Guidelines for the Selection, Configuration, and Use of TLS
- **17 U.S.C. § 1201(f)**: Reverse Engineering (DMCA Interoperability Exemption)

---

**Document Status**: ✅ Complete
**Last Updated**: 2025-10-30
**Analysis Coverage**: Cisco Secure Client versions 4.9.06037, 4.10.08029, 5.0.05040, 5.1.12.146

---
id: cisco-secure-client-5-1
title: Cisco Secure Client 5.1 Analysis
sidebar_label: Version 5.1
sidebar_position: 1
---

# Cisco Secure Client 5.1 Analysis

Analysis of Cisco Secure Client version 5.1.12.146 (latest as of analysis date).

:::info Analysis Methodology
This analysis was performed using professional reverse engineering tools including:
- **GNU Binutils** (readelf, nm, objdump, strings)
- **file**, **ldd** for binary identification and dependency analysis
- **Python** for automated cataloging and analysis
- Analysis date: October 30, 2025
:::

## Executive Summary

Cisco Secure Client 5.1.12.146 represents a significant iteration of Cisco's VPN client platform with **197 binaries** cataloged across **3 platforms** (Linux x64/ARM64, Windows x64, macOS).

### Key Findings

- **Linux x64**: 97 binaries analyzed (vpnagentd, libvpnapi.so, and module components)
- **Linux ARM64**: 91 binaries (full ARM64 support)
- **Windows x64**: 10 MSI packages identified
- **Total Binary Size**: ~400MB (Linux x64), ~380MB (Linux ARM64)
- **TLS Support**: TLS 1.3 capable with DTLS 1.2
- **Boost Libraries**: Version detected (multiple boost_* libraries)
- **Crypto**: OpenSSL 1.1.0+ (libacciscocrypto.so: 2.7MB, libacciscossl.so: 618KB)

## Architecture Overview

```kroki type=blockdiag
{
  orientation = portrait;

  // Client Components
  group {
    label = "Client Layer";
    color = "lightblue";

    vpnui [label = "VPN UI\n(vpnui)\n718KB", shape = "box"];
    vpn_cli [label = "VPN CLI\n(vpn)\n144KB", shape = "box"];
  }

  // Service Layer
  group {
    label = "Service Layer";
    color = "lightgreen";

    vpnagentd [label = "VPN Agent Daemon\n(vpnagentd)\n1.0MB", shape = "roundedbox"];
  }

  // API Layer
  group {
    label = "API Layer";
    color = "orange";

    libvpnapi [label = "VPN API\n(libvpnapi.so)\n1.9MB\n1019 exported functions"];
    libvpncommon [label = "VPN Common\n(libvpncommon.so)\n4.1MB"];
  }

  // Crypto Layer
  group {
    label = "Cryptography Layer";
    color = "pink";

    libacciscossl [label = "Cisco SSL\n(libacciscossl.so)\n618KB"];
    libacciscocrypto [label = "Cisco Crypto\n(libacciscocrypto.so)\n2.7MB"];
  }

  // Modules
  group {
    label = "Extension Modules";
    color = "yellow";

    dart [label = "DART\nDiagnostics\n6.3MB"];
    nvm [label = "NVM\nNetwork Visibility\n105MB"];
    ise [label = "ISE Posture\nCompliance\n3.2MB"];
  }

  // External
  openssl [label = "OpenSSL 1.1.0+", color = "gray"];

  // Connections
  vpnui -> vpnagentd;
  vpn_cli -> vpnagentd;

  vpnagentd -> libvpnapi;
  libvpnapi -> libvpncommon;

  libvpnapi -> libacciscossl;
  libacciscossl -> libacciscocrypto;
  libacciscocrypto -> openssl;

  vpnagentd -> dart [label = "diagnostics"];
  vpnagentd -> nvm [label = "telemetry"];
  vpnagentd -> ise [label = "posture"];
}
```

## Binary Catalog Summary

### Linux x64 Platform

| Component | Count | Total Size | Key Binaries |
|-----------|-------|------------|--------------|
| **VPN Core** | 24 | ~15 MB | vpnagentd (1.0MB), libvpnapi.so (1.9MB), libvpncommon.so (4.1MB) |
| **Crypto** | 2 | ~3.3 MB | libacciscocrypto.so, libacciscossl.so |
| **DART** | 6 | ~6.3 MB | dartui, dartcli, darthelper |
| **NVM** | 15 | ~105 MB | acnvmagent (13MB), osqueryi (87MB) |
| **ISE Posture** | 5 | ~3.2 MB | csc_iseagentd, libacise.so |
| **Posture** | 16 | ~128 MB | cscan, cstub, osqueryi, libwautils.so |
| **Localization** | 18 | ~6.8 MB | Language packs (18 languages) |
| **Boost Libraries** | 7 | ~760 KB | boost_filesystem, boost_thread, etc. |

### Linux ARM64 Platform

Full ARM64 support with 91 binaries across all modules (DART, NVM, ISE Posture, core VPN).

### Windows x64 Platform

| MSI Package | Size | Purpose |
|-------------|------|---------|
| core-vpn-predeploy-k9.msi | 23 MB | Core VPN functionality |
| nvm-predeploy-k9.msi | 25 MB | Network Visibility Module |
| posture-predeploy-k9.msi | 35 MB | Host posture assessment |
| dart-predeploy-k9.msi | 7.1 MB | Diagnostic and Reporting Tool |
| iseposture-predeploy-k9.msi | 4.9 MB | ISE Posture integration |
| nam-predeploy-k9.msi | 7.3 MB | Network Access Manager |
| umbrella-predeploy-k9.msi | 5.4 MB | Cisco Umbrella integration |
| sbl-predeploy-k9.msi | 3.2 MB | Start Before Logon |
| zta-predeploy-k9.msi | 33 MB | Zero Trust Access |
| thousandeyes-predeploy-k9.msi | 11 MB | ThousandEyes monitoring |

## Key Binaries Analysis

### vpnagentd (Main Daemon)

```
File: vpnagentd
Type: ELF 64-bit LSB PIE executable
Size: 1,045,385 bytes (1.0 MB)
Architecture: x86-64
BuildID: 4af7ec73effbf0cd568c4d089ccbeec1e5353ce3
Strip Status: Stripped (no debug symbols)
Dynamic Symbols: 1,174 symbols
Entry Point: 0x28660
```

**Key Dependencies**:
- libvpnapi.so (VPN API layer)
- libvpncommon.so (Common VPN functions)
- libacciscossl.so (Cisco SSL/TLS wrapper)
- libboost_system.so, libboost_thread.so (Boost C++)
- libxml2.so.2 (XML parsing)
- libgio-2.0.so.0, libglib-2.0.so.0 (GLib framework)

**Protocol Support** (from string analysis):
- `CSslProtocol` - SSL/TLS protocol handler
- `CTlsProtocol` - TLS protocol implementation
- `CDtlsProtocol` - DTLS protocol implementation
- Support for: `TLS 1.3+`, `TLS 1.2`, DTLS

### libvpnapi.so (Core API Library)

```
File: libvpnapi.so
Type: ELF 64-bit LSB shared object
Size: 1,916,773 bytes (1.9 MB)
BuildID: 13abf9962a879ad70da25203469dbc3a03ce4acc
Exported Functions: 1,019 functions
```

**Key Exports** (sample):
- OpenSSL integration (CRYPTO_*, SSL_*, EVP_PKEY_*, X509_*)
- cURL integration (curl_easy_*, curl_global_*)
- Certificate handling (d2i_X509, EC_KEY_*, RSA_*)

### libacciscossl.so (Cisco SSL/TLS Layer)

```
File: libacciscossl.so
Size: 617,693 bytes (618 KB)
Purpose: OpenSSL wrapper for TLS/DTLS
```

**Crypto Functions Detected**:
- `SSL_do_handshake`, `SSL_renegotiate`
- `DTLS_method`, `DTLS_server_method`, `DTLSv1_listen`
- `DTLS_get_data_mtu`, `DTLS_set_timer_cb`
- `BIO_new_ssl`, `BIO_ssl_shutdown`

## Module Analysis

### DART (Diagnostic and Reporting Tool)

**Purpose**: Client-side diagnostic collection and log archiving.

| Binary | Size | Purpose |
|--------|------|---------|
| dartcli | 3.9 MB | Command-line diagnostic tool |
| dartui | 1.3 MB | GTK-based diagnostic UI |
| darthelper | 1.1 MB | Helper daemon |

**Server Impact**: NONE (client-side only)

### NVM (Network Visibility Module)

**Purpose**: Flow telemetry collection using IPFIX (RFC 7011).

| Binary | Size | Purpose |
|--------|------|---------|
| acnvmagent | 13 MB | NVM agent daemon |
| osqueryi | 87 MB | osquery integration |
| libsock_fltr_api.so | 1.7 MB | Socket filter API |

**Protocol**: IPFIX over UDP port 2055
**Server Impact**: OPTIONAL (requires IPFIX collector)

### ISE Posture (Identity Services Engine)

**Purpose**: Cisco ISE integration for compliance checking.

| Binary | Size | Purpose |
|--------|------|---------|
| csc_iseagentd | 215 KB | ISE posture agent |
| libacise.so | 2.8 MB | ISE library |
| libacisectrl.so | 929 KB | ISE control plugin |

**Server Impact**: OPTIONAL (requires Cisco ISE deployment)

## Version Comparison: 5.1.2.42 vs 5.1.12.146

| Component | 5.1.2.42 | 5.1.12.146 | Change |
|-----------|----------|------------|--------|
| vpnagentd | 1.1 MB | 1.0 MB | -100 KB |
| libvpnapi.so | 1.8 MB | 1.9 MB | +100 KB |
| libvpncommon.so | 3.7 MB | 4.0 MB | +300 KB |

**Analysis**: Binary sizes show modest growth, likely from additional features and protocol support (TLS 1.3).

## Protocol Flow Diagram

```kroki type=mermaid
sequenceDiagram
    participant Client as VPN Client<br/>(vpnui/vpn)
    participant Daemon as vpnagentd
    participant API as libvpnapi.so
    participant SSL as libacciscossl.so
    participant Server as VPN Server

    Client->>Daemon: Connect request
    Daemon->>API: vpn_connect()
    API->>SSL: SSL_do_handshake()

    alt TLS 1.3 Supported
        SSL->>Server: ClientHello (TLS 1.3)
        Server-->>SSL: ServerHello (TLS 1.3)
        Note over SSL,Server: TLS 1.3 handshake
    else TLS 1.2 Fallback
        SSL->>Server: ClientHello (TLS 1.2)
        Server-->>SSL: ServerHello (TLS 1.2)
        Note over SSL,Server: TLS 1.2 handshake
    end

    SSL-->>API: Connection established
    API-->>Daemon: TLS session ready

    Daemon->>API: cstp_establish_tunnel()
    API->>Server: X-CSTP-Version: 1
    Server-->>API: X-CSTP-MTU: 1399

    opt DTLS Enabled
        Daemon->>API: dtls_establish_tunnel()
        API->>SSL: DTLS_method()
        SSL->>Server: DTLS handshake
        Server-->>SSL: DTLS session
    end

    Daemon-->>Client: Connected

    loop Data Transfer
        Client->>Daemon: Send data
        Daemon->>API: Encrypt & transmit
        API->>Server: Encrypted tunnel packet
    end
```

## Network Architecture

```kroki type=nwdiag
{
  network physical {
    address = "10.0.0.0/24"

    client [address = "10.0.0.100", description = "Client Machine"];
    gateway [address = "10.0.0.1"];
  }

  network tun_interface {
    address = "192.168.100.0/24"

    vpnagentd [address = "192.168.100.1", description = "vpnagentd\n(TUN device)"];
    tun0 [address = "192.168.100.2", description = "cscotun0"];
  }

  network internet {
    gateway;
    vpn_server [address = "203.0.113.1", description = "VPN Server\n(ocserv-modern)"];
  }

  network vpn_tunnel {
    address = "192.168.50.0/24"

    vpn_server [address = "192.168.50.1"];
  }
}
```

## Component State Machine

```kroki type=mermaid
stateDiagram-v2
    [*] --> Disconnected

    Disconnected --> Connecting: User initiates connection
    Connecting --> Authenticating: TCP/TLS established

    Authenticating --> Connected: Auth successful
    Authenticating --> Disconnected: Auth failed

    Connected --> TunnelEstablishing: Start tunnel
    TunnelEstablishing --> TunnelActive: CSTP established

    TunnelActive --> DTLSNegotiating: DTLS enabled
    DTLSNegotiating --> TunnelActive: DTLS failed
    DTLSNegotiating --> DTLSActive: DTLS established

    DTLSActive --> TunnelActive: DTLS timeout
    TunnelActive --> Reconnecting: Connection lost
    DTLSActive --> Reconnecting: Connection lost

    Reconnecting --> Connected: Reconnect successful
    Reconnecting --> Disconnected: Reconnect failed

    TunnelActive --> Disconnecting: User disconnect
    DTLSActive --> Disconnecting: User disconnect

    Disconnecting --> Disconnected
```

## Detailed Documentation

### Platform-Specific Documentation

- [Common Functionality (Cross-Platform)](./common-functionality) - Shared functions across all platforms
- [Linux Platform-Specific](./platform-linux) - TUN/TAP, systemd, kernel modules
- [Windows Platform-Specific](./platform-windows) - NDIS, services, drivers
- [macOS Platform-Specific](./platform-macos) - Network Extensions, kext/system extensions

### Component Analysis

- [Libraries and Frameworks](./libraries-frameworks) - Boost, OpenSSL, cURL, GLib
- [DART Module](./modules/dart) - Diagnostic and Reporting Tool
- [NVM Module](./modules/nvm) - Network Visibility Module (IPFIX)
- [ISE Posture Module](./modules/ise-posture) - Identity Services Engine integration

### Protocol Documentation

- [OpenConnect Protocol Reference](/docs/openconnect-protocol/reference/rfc-draft-enhanced) - Enhanced RFC draft with 5.1.12.146 changes

## Binary Catalog

Full binary catalog with all 197 binaries: [Binary Catalog (JSON)](./binary-catalog.json)

## Analysis Artifacts

All analysis artifacts are available in:
```
/opt/projects/repositories/cisco-secure-client/analysis/5.1.12.146-comprehensive/output/
```

Files include:
- `binary_catalog.json` - Complete binary inventory
- `vpnagentd_elf_header.txt` - ELF header analysis
- `vpnagentd_dependencies.txt` - Library dependencies
- `vpnagentd_protocol_strings.txt` - Protocol-related strings
- `libvpnapi_exported_functions.txt` - All 1,019 exported functions
- `libacciscossl_crypto_strings.txt` - Crypto/TLS strings
- `dart_analysis.txt` - DART module analysis
- `nvm_strings.txt` - NVM module analysis
- `ise_analysis.txt` - ISE Posture analysis
- `version_comparison.txt` - 5.1.2.42 vs 5.1.12.146 comparison

---

**Analysis Performed By**: Reverse Engineering Team
**Tools Used**: GNU Binutils, Python, file, ldd, readelf, nm, strings, objdump
**Date**: October 30, 2025
**Analysis Duration**: Comprehensive multi-platform analysis

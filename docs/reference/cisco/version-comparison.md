---
title: Version Comparison
sidebar_position: 2
---

# Cisco Secure Client Version Comparison

Comparison of different Cisco Secure Client versions analyzed for WolfGuard compatibility.

## Analyzed Versions

| Version | Release Date | Analysis Status | TLS Support | Notable Changes |
|---------|--------------|-----------------|-------------|-----------------|
| **5.1.12.146** | Sept 2024 | ✅ Complete | TLS 1.3 (preferred), TLS 1.2 | Boost C++ dependency, 197 binaries |
| **5.1.2.42** | 2023 | ✅ Complete | TLS 1.2 | Legacy reference version |
| **5.0.x** | 2022 | 📋 Partial | TLS 1.2 | First "Secure Client" rebrand |
| **4.x (AnyConnect)** | 2020-2021 | 📋 Partial | TLS 1.2 | Legacy AnyConnect |

## Detailed Comparison

### Version 5.1.12.146 vs 5.1.2.42

**See complete analysis**: [Version Comparison 5.1.2 vs 5.1.12](/docs/openconnect-protocol/reference/version-comparison-5.1.2-vs-5.1.12)

#### Key Differences

| Feature | 5.1.2.42 | 5.1.12.146 |
|---------|----------|------------|
| **TLS Version** | 1.2 only | 1.3 preferred, 1.2 fallback |
| **Binary Count** | ~150 | 197 |
| **Boost C++** | Not required | Required dependency |
| **OpenSSL** | 1.0.x | 1.1.0+ required |
| **DTLS** | 1.2 | 1.2 (DTLS 1.3 future) |
| **NVM Module** | Basic | Enhanced telemetry |
| **DART Module** | Included | Enhanced diagnostics |

#### Protocol Changes

**TLS 1.3 Support (5.1.12.146)**:
- Faster handshake (1-RTT)
- Improved cipher suites
- Better forward secrecy
- Mandatory certificate compression

**Authentication Enhancements**:
- SAML improvements
- Better SSO integration
- Enhanced certificate handling

**See**: [RFC Draft 5.1.12.146 Changes](/docs/openconnect-protocol/reference/rfc-draft-5.1.12.146-changes)

## Platform Support

### Linux

| Version | x86_64 | ARM64 | Kernel Requirement |
|---------|--------|-------|-------------------|
| 5.1.12.146 | ✅ | ✅ | 3.10+ |
| 5.1.2.42 | ✅ | ✅ | 3.10+ |

### Windows

| Version | x64 | x86 | Windows Requirement |
|---------|-----|-----|---------------------|
| 5.1.12.146 | ✅ | ❌ | Windows 10/11, Server 2016+ |
| 5.1.2.42 | ✅ | ✅ | Windows 7+, Server 2008+ |

### macOS

| Version | Intel | Apple Silicon | macOS Requirement |
|---------|-------|---------------|-------------------|
| 5.1.12.146 | ✅ | ✅ | 10.15+ |
| 5.1.2.42 | ✅ | ✅ (Rosetta) | 10.12+ |

## Compatibility Matrix

### WolfGuard Compatibility

| Client Version | WolfGuard Support | Protocol Version | Notes |
|----------------|-------------------|------------------|-------|
| 5.1.12.146 | ✅ Full | 1.2 | TLS 1.3 supported |
| 5.1.2.42 | ✅ Full | 1.2 | Reference version |
| 5.0.x | ✅ Compatible | 1.2 | Minor differences |
| 4.x | ⚠️ Mostly | 1.0-1.2 | Legacy protocol |

### Feature Support

| Feature | 5.1.12.146 | 5.1.2.42 | WolfGuard Support |
|---------|------------|----------|-------------------|
| **TLS 1.3** | ✅ | ❌ | ✅ |
| **TLS 1.2** | ✅ | ✅ | ✅ |
| **DTLS 1.2** | ✅ | ✅ | ✅ |
| **DTLS 1.3** | 🔄 Future | ❌ | 🔄 Planned |
| **SAML SSO** | ✅ | ✅ | ✅ |
| **2FA/MFA** | ✅ | ✅ | ✅ |
| **Split Tunnel** | ✅ | ✅ | ✅ |
| **OGS** | ✅ | ✅ | ✅ |
| **NVM Telemetry** | ✅ Enhanced | ✅ Basic | ⚠️ Partial |
| **DART** | ✅ Enhanced | ✅ Basic | ⚠️ Partial |

## Migration Considerations

### Upgrading from 5.1.2.42 to 5.1.12.146

**Breaking Changes**:
- Boost C++ library now required
- OpenSSL 1.1.0+ required
- Some binaries renamed/consolidated

**Recommendations**:
1. Test in staging environment first
2. Ensure OpenSSL 1.1.0+ is available
3. Install Boost C++ libraries
4. Update deployment scripts for new binary names
5. Test TLS 1.3 compatibility with server

### Server Compatibility

WolfGuard servers should support both versions simultaneously:

```bash
# Enable TLS 1.2 and 1.3
min-tls-version = 1.2
tls-priorities = NORMAL:-VERS-TLS1.0:-VERS-TLS1.1

# This allows:
# - 5.1.12.146 clients to use TLS 1.3
# - 5.1.2.42 clients to use TLS 1.2
```

## Security Improvements

### TLS 1.3 Benefits (5.1.12.146)

1. **Faster Connection**: 1-RTT handshake vs 2-RTT in TLS 1.2
2. **Better Security**: Removed weak cipher suites
3. **Forward Secrecy**: Mandatory ephemeral key exchange
4. **Encrypted Handshake**: More metadata protected

### Cipher Suite Evolution

**5.1.2.42 (TLS 1.2)**:
```
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-CHACHA20-POLY1305
```

**5.1.12.146 (TLS 1.3)**:
```
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
```

## Performance Comparison

| Metric | 5.1.2.42 | 5.1.12.146 | Improvement |
|--------|----------|------------|-------------|
| **Handshake Time** | ~500ms | ~250ms | 50% faster |
| **Connection Setup** | 2-RTT | 1-RTT | 1 round trip saved |
| **Memory Usage** | ~50 MB | ~60 MB | +20% (Boost C++) |
| **Binary Size** | ~120 MB | ~150 MB | +25% |

## Reverse Engineering Notes

### Analysis Tools Used

- **GNU Binutils**: readelf, nm, objdump, strings
- **Python**: Automated cataloging and comparison
- **file**: Binary identification
- **ldd**: Dependency analysis

### Key Findings

**5.1.12.146**:
- More modular architecture
- Enhanced error handling
- Better logging infrastructure
- Improved certificate validation

**See detailed analysis**:
- [Version 5.1.12.146 Analysis](/docs/cisco-secure-client/v5-1-12-146/)
- [Common Functionality](/docs/cisco-secure-client/v5-1-12-146/common-functionality)

## Recommendations

### For WolfGuard Deployment

1. **Support TLS 1.3**: Enable for best security and performance
2. **Maintain TLS 1.2**: For compatibility with older clients
3. **Test Both Versions**: Ensure compatibility across versions
4. **Monitor Usage**: Track which clients use which versions

### For Client Deployment

1. **Upgrade to 5.1.12.146**: For best security
2. **Test Before Rolling Out**: Verify compatibility
3. **Plan for Dependencies**: Ensure Boost C++, OpenSSL 1.1.0+
4. **Gradual Migration**: Don't force immediate upgrade

## Future Versions

**Expected in future releases**:
- DTLS 1.3 support
- Post-quantum cryptography
- Enhanced telemetry
- Improved mobile performance

## References

- [Cisco Secure Client Analysis](/docs/cisco-secure-client/)
- [Version 5.1.12.146 Details](/docs/cisco-secure-client/v5-1-12-146/)
- [OpenConnect Protocol Reference](/docs/openconnect-protocol/intro)
- [Version Comparison 5.1.2 vs 5.1.12](/docs/openconnect-protocol/reference/version-comparison-5.1.2-vs-5.1.12)

---

**Last Updated**: October 30, 2025
**Analysis Status**: Ongoing (new versions analyzed as released)

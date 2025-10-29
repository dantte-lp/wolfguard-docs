---
sidebar_position: 1
---

# RFC Draft: OpenConnect VPN Protocol

**Status**: Work in Progress
**Document Version**: 0.1
**Last Updated**: October 2025

:::info
This is a draft specification based on reverse engineering of Cisco Secure Client 5.x+. It is not an official RFC but aims to document the protocol for interoperability purposes.
:::

## Abstract

The OpenConnect VPN Protocol is a SSL/TLS and DTLS-based VPN protocol originally developed by Cisco Systems for its AnyConnect/Secure Client products. This document specifies the protocol as implemented in Cisco Secure Client version 5.x and later, based on comprehensive reverse engineering and binary analysis.

## Table of Contents

1. [Introduction](#introduction)
2. [Protocol Overview](#protocol-overview)
3. [Transport Layer](#transport-layer)
4. [Authentication](#authentication)
5. [Tunnel Establishment](#tunnel-establishment)
6. [Data Transfer](#data-transfer)
7. [Keep-Alive and Dead Peer Detection](#keep-alive-and-dead-peer-detection)
8. [Security Considerations](#security-considerations)
9. [IANA Considerations](#iana-considerations)
10. [References](#references)

## 1. Introduction

### 1.1 Purpose

This document describes the OpenConnect VPN protocol to enable:
- Interoperable server implementations
- Security analysis and research
- Protocol extensions and improvements
- Client compatibility testing

### 1.2 Scope

This specification covers:
- SSL/TLS control channel (TCP 443)
- DTLS data channel (UDP 443)
- Authentication methods (password, certificate, OTP, SAML)
- Tunnel establishment and configuration
- Data encapsulation and routing
- Keep-alive mechanisms

### 1.3 Terminology

**MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** are to be interpreted as described in RFC 2119.

Additional terms:
- **Control Channel**: TLS-encrypted TCP connection for signaling
- **Data Channel**: DTLS-encrypted UDP connection for IP packet transport
- **DPD**: Dead Peer Detection
- **CSTP**: Cisco SSL Tunnel Protocol
- **DTLS**: Datagram Transport Layer Security

## 2. Protocol Overview

### 2.1 Architecture

```
┌─────────────┐                              ┌─────────────┐
│   Client    │                              │   Server    │
│             │                              │             │
│ ┌─────────┐ │  TLS Handshake (TCP 443)    │ ┌─────────┐ │
│ │ Control │ │◄───────────────────────────►│ │ Control │ │
│ │ Channel │ │                              │ │ Handler │ │
│ └─────────┘ │                              │ └─────────┘ │
│      │      │                              │      │      │
│      ▼      │  HTTP-based Authentication   │      ▼      │
│ ┌─────────┐ │◄───────────────────────────►│ ┌─────────┐ │
│ │  Auth   │ │                              │ │  Auth   │ │
│ │ Handler │ │                              │ │ Backend │ │
│ └─────────┘ │                              │ └─────────┘ │
│      │      │                              │      │      │
│      ▼      │  Configuration Exchange      │      ▼      │
│ ┌─────────┐ │◄───────────────────────────►│ ┌─────────┐ │
│ │ Config  │ │                              │ │ Config  │ │
│ │ Handler │ │                              │ │ Manager │ │
│ └─────────┘ │                              │ └─────────┘ │
│      │      │                              │      │      │
│      ▼      │  DTLS Handshake (UDP 443)    │      ▼      │
│ ┌─────────┐ │◄───────────────────────────►│ ┌─────────┐ │
│ │  Data   │ │                              │ │  Data   │ │
│ │ Channel │ │  Encapsulated IP Packets     │ │ Channel │ │
│ │ (DTLS)  │ │◄═══════════════════════════►│ │ (DTLS)  │ │
│ └─────────┘ │                              │ └─────────┘ │
└─────────────┘                              └─────────────┘
```

### 2.2 Connection Flow

1. **TLS Connection**: Client connects to server on TCP 443
2. **Authentication**: HTTP-based authentication (forms, SAML, certificate)
3. **Configuration**: Server sends VPN configuration (IP, routes, DNS)
4. **DTLS Setup**: Client initiates DTLS handshake on UDP 443
5. **Data Transfer**: IP packets encapsulated over DTLS tunnel
6. **Keep-Alive**: Periodic DPD messages maintain connection

## 3. Transport Layer

### 3.1 TLS Control Channel

**Port**: TCP 443
**TLS Versions**: TLS 1.2, TLS 1.3
**Cipher Suites** (recommended):
```
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384 (TLS 1.3)
TLS_AES_128_GCM_SHA256 (TLS 1.3)
```

**HTTP Methods**:
- `CONNECT /CSCOSSLC/tunnel` - Establish tunnel
- `GET /` - Initial server probe
- `POST /auth` - Authentication submission

### 3.2 DTLS Data Channel

**Port**: UDP 443
**DTLS Versions**: DTLS 1.0, DTLS 1.2
**Cipher Suites**:
```
DTLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
DTLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
```

**MTU Considerations**:
- Default MTU: 1400 bytes
- Configurable via `X-CSTP-MTU` header
- Path MTU discovery supported

## 4. Authentication

### 4.1 Password Authentication

**HTTP POST to `/auth`**:
```http
POST /auth HTTP/1.1
Host: vpn.example.com
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=secretpass&group=DefaultGroup
```

**Server Response**:
```http
HTTP/1.1 200 OK
Set-Cookie: webvpn=auth_token_here; Secure; HttpOnly

<?xml version="1.0" encoding="UTF-8"?>
<auth id="success">
  <session-token>TOKEN_HERE</session-token>
  <config-hash>HASH_HERE</config-hash>
</auth>
```

### 4.2 Certificate Authentication

Client certificate presented during TLS handshake.

**Requirements**:
- X.509v3 certificate
- Key usage: Digital Signature
- Extended key usage: Client Authentication
- Subject CN or SAN must match username

### 4.3 Multi-Factor Authentication (MFA)

#### OTP Flow:
1. Initial authentication with username/password
2. Server responds with OTP challenge
3. Client sends OTP code
4. Server validates and issues session token

**OTP Challenge Response**:
```xml
<auth id="challenge">
  <message>Enter OTP code from your authenticator</message>
  <form method="post" action="/auth">
    <input type="text" name="otp" label="OTP Code"/>
  </form>
</auth>
```

#### SAML 2.0 Flow:
1. Server redirects to SAML IdP
2. User authenticates with IdP
3. IdP redirects back with SAML assertion
4. Server validates assertion and issues session

## 5. Tunnel Establishment

### 5.1 CONNECT Request

```http
CONNECT /CSCOSSLC/tunnel HTTP/1.1
Host: vpn.example.com
User-Agent: Cisco AnyConnect VPN Agent for Windows 5.1.0
Cookie: webvpn=auth_token_here
X-CSTP-Version: 1
X-CSTP-Hostname: client-hostname
X-CSTP-MTU: 1400
X-CSTP-Address-Type: IPv4
```

### 5.2 Server Configuration Response

```http
HTTP/1.1 200 CONNECTED
X-CSTP-Version: 1
X-CSTP-Address: 192.168.100.10
X-CSTP-Netmask: 255.255.255.0
X-CSTP-DNS: 8.8.8.8
X-CSTP-DNS: 8.8.4.4
X-CSTP-Default-Domain: corp.example.com
X-CSTP-Split-Include: 10.0.0.0/255.0.0.0
X-CSTP-Split-Include: 172.16.0.0/255.240.0.0
X-CSTP-MTU: 1400
X-CSTP-DPD: 300
X-CSTP-Keepalive: 20
X-DTLS-Port: 443
X-DTLS-MTU: 1400
X-DTLS-Session-ID: SESSION_ID_HERE

```

### 5.3 Configuration Headers

| Header | Description | Example |
|--------|-------------|---------|
| `X-CSTP-Address` | Client IP address | `192.168.100.10` |
| `X-CSTP-Netmask` | Subnet mask | `255.255.255.0` |
| `X-CSTP-DNS` | DNS server | `8.8.8.8` |
| `X-CSTP-Split-Include` | Routes to tunnel | `10.0.0.0/255.0.0.0` |
| `X-CSTP-Split-Exclude` | Routes to bypass | `192.168.1.0/255.255.255.0` |
| `X-CSTP-DPD` | DPD interval (seconds) | `300` |
| `X-CSTP-Keepalive` | Keepalive interval | `20` |
| `X-DTLS-Session-ID` | DTLS session identifier | Base64 encoded |

## 6. Data Transfer

### 6.1 Packet Encapsulation

**CSTP (over TLS)**:
```
+----------------+
| STX (0x02)     | 1 byte
+----------------+
| Length (BE)    | 2 bytes
+----------------+
| IP Packet      | N bytes
+----------------+
```

**DTLS**:
```
+----------------+
| DTLS Header    | 13 bytes
+----------------+
| IP Packet      | N bytes
+----------------+
```

### 6.2 Fragmentation

- Packets exceeding MTU MUST be fragmented at IP layer
- DTLS fragmentation handled by DTLS protocol
- Path MTU discovery RECOMMENDED

## 7. Keep-Alive and Dead Peer Detection

### 7.1 DPD Mechanism

**Client-to-Server**:
- Send DPD request every `X-CSTP-DPD` seconds
- Wait up to 30 seconds for response
- Reconnect if no response

**DPD Request** (over TLS control channel):
```
STX (0x03) + 0x0000
```

**DPD Response**:
```
STX (0x04) + 0x0000
```

### 7.2 Mobile DPD

For mobile clients (smartphones):
- Longer DPD interval (600 seconds typical)
- Prevents battery drain
- Configured via `X-CSTP-Mobile-DPD` header

## 8. Security Considerations

### 8.1 Cryptographic Requirements

- TLS 1.2 or higher REQUIRED
- Strong cipher suites (AES-256-GCM recommended)
- Certificate validation MUST be enforced
- Perfect Forward Secrecy (PFS) RECOMMENDED

### 8.2 Authentication Security

- Passwords SHOULD be hashed with bcrypt/scrypt
- MFA RECOMMENDED for production deployments
- Session tokens MUST be cryptographically random
- Tokens MUST expire after reasonable period

### 8.3 Network Security

- Source IP validation for DTLS
- Rate limiting for authentication attempts
- DDoS protection at network edge
- Firewall rules for tunnel traffic

## 9. IANA Considerations

This document makes no requests to IANA.

**Note**: The OpenConnect protocol uses well-known ports (443/tcp, 443/udp) but with proprietary encapsulation.

## 10. References

### Normative References

- **RFC 2119**: Key words for use in RFCs to Indicate Requirement Levels
- **RFC 5246**: The Transport Layer Security (TLS) Protocol Version 1.2
- **RFC 6347**: Datagram Transport Layer Security Version 1.2
- **RFC 8446**: The Transport Layer Security (TLS) Protocol Version 1.3

### Informative References

- Cisco Secure Client documentation
- OpenConnect VPN client source code
- ocserv-modern implementation

---

## Appendices

### Appendix A: Example Session

See [Comprehensive Analysis Summary](/docs/reference/summary) for complete packet captures and session examples.

### Appendix B: Compatibility Matrix

See [Version Differences](/docs/reference/version-diff) for client version compatibility details.

### Appendix C: Implementation Notes

See [WolfSSL Integration](/docs/implementation/wolfssl) for implementation guidance.

---

**Authors**:
- OpenConnect Protocol Documentation Project

**Copyright**: This document is provided for interoperability and educational purposes.

**Status**: This is a draft specification based on reverse engineering. It is not endorsed by Cisco Systems.

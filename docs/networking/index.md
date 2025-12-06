---
sidebar_position: 0
title: Network Engineering
slug: /networking/
---

# Network Engineering Guide

Network engineering documentation covering OpenConnect protocol, network topology, firewall configuration, and troubleshooting.

## Overview

This section is designed for **network engineers** who need to:

- Understand the OpenConnect protocol in depth
- Design network topologies for VPN deployments
- Configure firewalls, routing, and NAT
- Optimize DNS and DHCP integration
- Tune performance and troubleshoot issues
- Analyze network traffic and protocols

## Network Engineering Topics

### 1. Protocol Deep Dive

Understand OpenConnect protocol internals:

- **[OpenConnect Overview](./protocol/openconnect-overview)** - Protocol architecture and flow
- **[TLS Handshake](./protocol/tls-handshake)** - HTTPS authentication phase
- **[DTLS Tunnel](./protocol/dtls-tunnel)** - UDP tunnel establishment
- **[Authentication Flow](./protocol/authentication-flow)** - Auth methods and flows
- **[Cryptography](./protocol/crypto)** - Cipher suites and key exchange
- **[NVM Telemetry](./protocol/nvm-telemetry)** - Network Visibility Module

### 2. Network Topology

Design VPN network architectures:

- **[Deployment Scenarios](./topology/deployment-scenarios)** - Common deployment patterns
- **[Split Tunneling](./topology/split-tunneling)** - Route only specific traffic through VPN
- **[Full Tunneling](./topology/full-tunneling)** - Route all traffic through VPN
- **[Site-to-Site](./topology/site-to-site)** - Connect entire networks

### 3. Firewall & Routing

Configure network infrastructure:

- **[Port Requirements](./firewall/port-requirements)** - Required ports and protocols
- **[NAT Traversal](./firewall/nat-traversal)** - Work behind NAT/firewalls
- **[iptables Configuration](./firewall/iptables-config)** - Linux firewall setup
- **[Routing Configuration](./firewall/routing-config)** - Route tables and policies

### 4. DNS & DHCP

Configure name resolution and addressing:

- **[DNS Configuration](./dns/dns-configuration)** - DNS server setup
- **[Split DNS](./dns/split-dns)** - Different DNS for internal/external
- **[DHCP Integration](./dns/dhcp-integration)** - Dynamic IP assignment

### 5. Performance Tuning

Optimize VPN performance:

- **[DPD Timers](./performance/dpd-timers)** - Dead Peer Detection tuning
- **[MTU Optimization](./performance/mtu-optimization)** - Maximum transmission unit
- **[Quality of Service](./performance/qos)** - Traffic prioritization
- **[Bandwidth Management](./performance/bandwidth-management)** - Throttling and shaping

### 6. Troubleshooting

Diagnose and resolve network issues:

- **[Connectivity Issues](./troubleshooting/connectivity-issues)** - Cannot connect
- **[Packet Capture](./troubleshooting/packet-capture)** - Analyze traffic with tcpdump/Wireshark
- **[Protocol Analysis](./troubleshooting/protocol-analysis)** - Debug protocol issues
- **[Common Problems](./troubleshooting/common-problems)** - FAQ and solutions

## OpenConnect Protocol Overview

The OpenConnect protocol (also known as AnyConnect protocol) uses:

### Phase 1: HTTPS Authentication (TCP 443)
```
Client                          Server
  |                               |
  |--- TLS ClientHello ---------->|
  |<-- TLS ServerHello -----------|
  |--- Certificate Auth --------->|
  |<-- Authentication Response ---|
  |--- Username/Password -------->|
  |<-- CONNECT Response ----------|
  |<-- XML Configuration ---------|
```

### Phase 2: DTLS Tunnel (UDP 443)
```
Client                          Server
  |                               |
  |--- DTLS ClientHello --------->|
  |<-- DTLS ServerHello ----------|
  |--- DTLS Master Secret ------->|
  |<-- DTLS Connected ------------|
  |                               |
  |<====== IP Traffic ==========>|
  |    (Encrypted UDP tunnel)     |
```

## Network Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **Bandwidth** | 1 Mbps per user (minimum) |
| **Latency** | < 100ms (recommended) |
| **Ports** | TCP/UDP 443 (standard) |
| **IP Range** | /24 network minimum (254 addresses) |
| **DNS** | Internal DNS server or forwarding |

### Firewall Rules

**Inbound (Server)**:
- TCP 443 (HTTPS authentication)
- UDP 443 (DTLS tunnel)

**Outbound (Client)**:
- TCP 443 to VPN server
- UDP 443 to VPN server

**Internal (VPN Network)**:
- Allow forwarding between VPN and LAN
- Configure NAT for internet access

## Common Network Topologies

### 1. Simple Remote Access
```
[Remote Clients] ---> [WolfGuard] ---> [Corporate LAN]
                       (Split Tunnel)
```

### 2. Hub-and-Spoke
```
[Branch Office 1] ─┐
                    ├─> [WolfGuard Hub] ---> [Data Center]
[Branch Office 2] ─┘
```

### 3. Multi-Region HA
```
[Clients] ---> [Load Balancer]
                   ├─> [WolfGuard US-East]
                   ├─> [WolfGuard US-West]
                   └─> [WolfGuard EU]
```

## Quick Start for Network Engineers

### 1. Understand the Protocol

Start with [OpenConnect Overview](./protocol/openconnect-overview) to understand the protocol flow, then review:
- [TLS Handshake](./protocol/tls-handshake) - How authentication works
- [DTLS Tunnel](./protocol/dtls-tunnel) - How data tunnel is established

### 2. Plan Your Network

Choose your topology:
- **Remote access** → [Split Tunneling](./topology/split-tunneling)
- **All traffic through VPN** → [Full Tunneling](./topology/full-tunneling)
- **Connect offices** → [Site-to-Site](./topology/site-to-site)

### 3. Configure Firewall

Set up your firewall:
1. Review [Port Requirements](./firewall/port-requirements)
2. Configure [iptables](./firewall/iptables-config) or your firewall
3. Set up [NAT Traversal](./firewall/nat-traversal) if needed
4. Configure [Routing](./firewall/routing-config)

### 4. Set Up DNS

Configure name resolution:
- [DNS Configuration](./dns/dns-configuration) for basic setup
- [Split DNS](./dns/split-dns) for internal/external separation

### 5. Optimize Performance

Tune for your environment:
- Adjust [MTU](./performance/mtu-optimization) for your network
- Configure [DPD Timers](./performance/dpd-timers)
- Set up [QoS](./performance/qos) if needed

## Protocol Analysis Tools

### Packet Capture

```bash
# Capture VPN traffic
tcpdump -i any -w vpn-capture.pcap \
  'port 443 and host vpn.example.com'

# Analyze with Wireshark
wireshark vpn-capture.pcap
```

### Connection Testing

```bash
# Test TCP connectivity
nc -zv vpn.example.com 443

# Test UDP connectivity
nc -zvu vpn.example.com 443

# Test TLS handshake
openssl s_client -connect vpn.example.com:443

# Test DTLS (if supported by tool)
openssl s_client -dtls -connect vpn.example.com:443
```

### DNS Testing

```bash
# Test DNS resolution
dig vpn.example.com

# Test reverse DNS
dig -x 192.0.2.1

# Test split DNS from VPN client
nslookup internal.corp.com
```

## Performance Benchmarks

| Metric | Expected Value |
|--------|---------------|
| **Throughput** | 1-10 Gbps (depends on hardware) |
| **Latency** | +1-5ms (VPN overhead) |
| **Handshake Time** | 100-500ms |
| **Reconnect Time** | < 2 seconds |
| **Concurrent Users** | 1000+ (per server) |

## Troubleshooting Quick Reference

| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| Cannot connect | Firewall blocking | Check [Port Requirements](./firewall/port-requirements) |
| Slow performance | MTU issues | Review [MTU Optimization](./performance/mtu-optimization) |
| Frequent disconnects | DPD timeout | Adjust [DPD Timers](./performance/dpd-timers) |
| DNS not working | Split DNS misconfigured | Check [Split DNS](./dns/split-dns) |
| Some sites unreachable | Routing problem | Review [Routing Config](./firewall/routing-config) |

## Advanced Topics

### IPsec vs OpenConnect

| Feature | IPsec | OpenConnect |
|---------|-------|-------------|
| **Transport** | ESP/UDP | HTTPS/DTLS |
| **Firewall Friendly** | No | Yes |
| **NAT Traversal** | Complex | Built-in |
| **Setup Complexity** | High | Medium |
| **Client Support** | Native | Requires client |

### OpenConnect vs SSL VPN

OpenConnect **is** an SSL VPN protocol. It uses:
- **TLS** for authentication and control
- **DTLS** for high-performance data tunnel
- **Fallback to TLS** if UDP is blocked

## Security Considerations

1. **Use TLS 1.3** - Disable older versions
2. **Strong cipher suites** - See [Cryptography](./protocol/crypto)
3. **Perfect Forward Secrecy** - Use ephemeral key exchange
4. **Certificate pinning** - Pin server certificates
5. **Network segmentation** - Isolate VPN network
6. **Intrusion detection** - Monitor for anomalies

## Related Guides

- **[Administration](/docs/administration/)** - User and policy management
- **[Developer Guide](/docs/developers/)** - Protocol implementation details
- **[Reference](/docs/reference/)** - Protocol specifications

## Standards & RFCs

- **[RFC 5246](https://tools.ietf.org/html/rfc5246)** - TLS 1.2
- **[RFC 8446](https://tools.ietf.org/html/rfc8446)** - TLS 1.3
- **[RFC 6347](https://tools.ietf.org/html/rfc6347)** - DTLS 1.2
- **[OpenConnect Draft RFC](/docs/openconnect-protocol/reference/rfc-draft)** - Protocol specification

---

**Need help with network configuration?** Start with [Protocol Overview](./protocol/openconnect-overview) or [Troubleshooting](./troubleshooting/common-problems)

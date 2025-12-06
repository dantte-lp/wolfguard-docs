---
title: Diagrams
sidebar_position: 1
---

# Diagrams

Technical diagrams and visualizations for WolfGuard architecture and protocols.

> **Note**: This page has been moved from `/docs/guides/diagrams` to `/docs/resources/diagrams`

## Architecture Diagrams

### WolfGuard System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   WolfGuard Architecture                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   REST API   │  │   WebUI      │  │   CLI Tool   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│                           │                              │
│                  ┌────────▼────────┐                     │
│                  │  Control Plane  │                     │
│                  │  - Auth/Authz   │                     │
│                  │  - Config Mgmt  │                     │
│                  │  - User Mgmt    │                     │
│                  └────────┬────────┘                     │
│                           │                              │
│         ┌─────────────────┴─────────────────┐            │
│         │                                   │            │
│  ┌──────▼──────┐                    ┌──────▼──────┐     │
│  │  TLS/HTTPS  │                    │ DTLS Tunnel │     │
│  │  Handler    │                    │  Handler    │     │
│  └──────┬──────┘                    └──────┬──────┘     │
│         │                                   │            │
│         └──────────────┬────────────────────┘            │
│                        │                                 │
│                 ┌──────▼──────┐                          │
│                 │  WolfSentry  │                          │
│                 │   Firewall   │                          │
│                 └──────┬──────┘                          │
│                        │                                 │
│                 ┌──────▼──────┐                          │
│                 │   IP Stack   │                          │
│                 │   (TUN/TAP)  │                          │
│                 └─────────────┘                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Protocol Flow Diagrams

### OpenConnect Connection Establishment

```
Client                          Server
  |                               |
  |--- 1. TLS ClientHello ------->|
  |                               | Establish
  |<-- 2. TLS ServerHello --------|  TLS 1.3
  |                               | Connection
  |--- 3. TLS Finished ---------->|
  |                               |
  |--- 4. HTTP POST /auth ------->|
  |                               | Present
  |<-- 5. Auth Challenge ---------|  Login Form
  |                               |
  |--- 6. Credentials ----------->|
  |    (username/password/2FA)    | Authenticate
  |                               |
  |<-- 7. CONNECT Response -------|
  |    (Session cookie)           |
  |                               |
  |<-- 8. XML Configuration ------|
  |    (IP, routes, DNS, etc.)    |
  |                               |
  |--- 9. DTLS ClientHello ------>|
  |                               | Establish
  |<-- 10. DTLS ServerHello ------|  DTLS
  |                               | Data Tunnel
  |--- 11. DTLS Finished -------->|
  |                               |
  |<====== IP Traffic ==========>|
  |    (Encrypted UDP tunnel)     |
  |                               |
```

### Authentication Flow

```
┌────────┐          ┌──────────┐          ┌────────┐
│ Client │          │ WolfGuard│          │ Backend│
└───┬────┘          └────┬─────┘          └───┬────┘
    │                    │                    │
    │ 1. Connect         │                    │
    ├───────────────────>│                    │
    │                    │                    │
    │ 2. Present Form    │                    │
    │<───────────────────┤                    │
    │                    │                    │
    │ 3. Credentials     │                    │
    ├───────────────────>│                    │
    │                    │ 4. Verify         │
    │                    ├──────────────────>│
    │                    │                    │
    │                    │ 5. Auth Response  │
    │                    │<──────────────────┤
    │                    │                    │
    │ 6. Session Token   │                    │
    │<───────────────────┤                    │
    │                    │                    │
    │ 7. Establish VPN   │                    │
    ├───────────────────>│                    │
    │                    │                    │
```

## Network Topology Diagrams

### Split-Tunnel Configuration

```
                    Internet
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    Non-VPN        VPN Server      Corporate
    Traffic            │            Network
        │              │              │
        │         ┌────▼────┐         │
        │         │WolfGuard│         │
        │         └────┬────┘         │
        │              │              │
        └──────────────┼──────────────┘
                       │
                  VPN Client
```

### Full-Tunnel Configuration

```
                    Internet
                       │
                       │
                   VPN Server
                       │
                  ┌────▼────┐
                  │WolfGuard│────────> Corporate
                  └────┬────┘          Network
                       │
                       │
                  VPN Client
            (All traffic via VPN)
```

### High Availability Setup

```
                    Internet
                       │
                ┌──────▼──────┐
                │Load Balancer│
                └──────┬──────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
   │WolfGuard│    │WolfGuard│    │WolfGuard│
   │ Node 1  │    │ Node 2  │    │ Node 3  │
   └────┬────┘    └────┬────┘    └────┬────┘
        │              │              │
        └──────────────┴──────────────┘
                       │
                 Shared Backend
              (Database, Storage)
```

## Deployment Diagrams

### Docker Deployment

```
┌─────────────────────────────────────────┐
│              Docker Host                 │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │      WolfGuard Container           │ │
│  │                                    │ │
│  │  ┌──────────────────────────────┐ │ │
│  │  │    WolfGuard Process         │ │ │
│  │  └──────────────────────────────┘ │ │
│  │                                    │ │
│  │  Volumes:                          │ │
│  │  - /etc/wolfguard (config)        │ │
│  │  - /etc/wolfguard/certs (certs)   │ │
│  │                                    │ │
│  │  Ports:                            │ │
│  │  - 443/tcp                         │ │
│  │  - 443/udp                         │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Kubernetes Deployment

```
┌─────────────────────────────────────────────┐
│           Kubernetes Cluster                 │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │          Ingress/LoadBalancer          │ │
│  └─────────────────┬──────────────────────┘ │
│                    │                         │
│  ┌─────────────────▼──────────────────────┐ │
│  │          Service (wolfguard)           │ │
│  └─────────────────┬──────────────────────┘ │
│                    │                         │
│      ┌─────────────┼─────────────┐           │
│      │             │             │           │
│  ┌───▼───┐     ┌───▼───┐     ┌───▼───┐     │
│  │  Pod  │     │  Pod  │     │  Pod  │     │
│  │ Node1 │     │ Node2 │     │ Node3 │     │
│  └───┬───┘     └───┬───┘     └───┬───┘     │
│      │             │             │           │
│      └─────────────┴─────────────┘           │
│                    │                         │
│  ┌─────────────────▼──────────────────────┐ │
│  │    PersistentVolume (Config/Certs)     │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Data Flow Diagrams

### VPN Traffic Flow

```
┌────────────┐
│   Client   │
│Application │
└─────┬──────┘
      │ Plain IP packets
      │
┌─────▼──────┐
│   TUN/TAP  │
│   Device   │
└─────┬──────┘
      │ IP packets
      │
┌─────▼──────┐
│   WolfGuard│
│   Client   │
└─────┬──────┘
      │ DTLS encrypted
      │
      │ Network (UDP 443)
      │
┌─────▼──────┐
│   WolfGuard│
│   Server   │
└─────┬──────┘
      │ Decrypted IP packets
      │
┌─────▼──────┐
│  WolfSentry│
│  Firewall  │
└─────┬──────┘
      │ Filtered packets
      │
┌─────▼──────┐
│   TUN/TAP  │
│   Device   │
└─────┬──────┘
      │ Routed packets
      │
┌─────▼──────┐
│  Corporate │
│   Network  │
└────────────┘
```

## See Also

- [Architecture Overview](/docs/developers/architecture/overview)
- [Protocol Deep Dive](/docs/networking/protocol/openconnect-overview)
- [Deployment Guide](/docs/administration/deployment/server-setup)

---

For more diagrams and visualizations, see the specific documentation sections or view the source in [GitHub](https://github.com/dantte-lp/wolfguard-docs).

---
sidebar_position: 0
title: Developer Guide
slug: /developers/
---

# Developer Guide

Comprehensive developer documentation for building, extending, and integrating with WolfGuard.

## Overview

This section is designed for **developers** who need to:

- Understand WolfGuard's architecture and design
- Use the REST API for automation and integration
- Implement custom authentication or authorization
- Contribute code or protocol improvements
- Build integrations with external systems
- Write tests and ensure compatibility

## Developer Topics

### 1. Reverse Engineering

Comprehensive reverse engineering methodology for analyzing Cisco Secure Client:

- **[Reverse Engineering Manifest](./reverse-engineering-manifest)** - Complete RE methodology and tool stack
- **[Methodology Comparison](./methodology-comparison)** - Current vs. enhanced approach analysis
- **[Implementation Roadmap](./re-implementation-roadmap)** - 6-month enhancement plan
- **[IDA Pro Setup](./tools/ida-pro-setup)** - IDA Pro 9.2 installation and configuration
- **[Binary Ninja Assessment](./tools/binary-ninja-assessment)** - Tool evaluation and recommendation
- **[Batch Analysis Workflow](./workflows/batch-analysis)** - Automated analysis of 197 binaries

### 2. Architecture

Understand the system design:

- **[Architecture Overview](./architecture/overview)** - High-level system architecture
- **[Modern VPN Design](./architecture/modern-vpn-design)** - Design principles and patterns
- **[WolfSentry Integration](./architecture/wolfsentry-integration)** - Embedded firewall integration
- **[Components](./architecture/components)** - Detailed component breakdown

### 3. API Reference

Integrate with WolfGuard programmatically:

- **[REST API](./api/rest-api)** - Complete REST API documentation
- **[Configuration API](./api/configuration-api)** - Dynamic configuration management
- **[Monitoring API](./api/monitoring-api)** - Metrics and health endpoints
- **[Webhooks](./api/webhooks)** - Event-driven integrations

### 4. Code Examples

Learn by example:

- **[C23 Examples](./examples/c23-examples)** - Modern C programming examples
- **[WolfSSL Integration](./examples/wolfssl-integration)** - Cryptographic API usage
- **[Custom Authentication](./examples/custom-auth)** - Implement custom auth methods
- **[Plugins](./examples/plugins)** - Extend functionality with plugins

### 5. Protocol Implementation

Deep dive into protocol details:

- **[OpenConnect v1.2](./protocol/openconnect-v1.2)** - Protocol specification implementation
- **[Cisco Compatibility](./protocol/cisco-compatibility)** - Ensure client compatibility
- **[TLS/DTLS](./protocol/tls-dtls)** - Transport layer security
- **[Protocol Extensions](./protocol/extensions)** - Custom protocol extensions

### 6. Integration

Connect WolfGuard to external systems:

- **[External Authentication](./integration/external-auth)** - Integrate with external auth systems
- **[Single Sign-On (SSO)](./integration/sso)** - SAML, OAuth2, OIDC integration
- **[Scripts & Hooks](./integration/scripts)** - Lifecycle hooks and scripts
- **[Event Hooks](./integration/hooks)** - React to system events

### 7. Testing

Ensure quality and compatibility:

- **[Unit Tests](./testing/unit-tests)** - Write and run unit tests
- **[Integration Tests](./testing/integration-tests)** - End-to-end testing
- **[Compatibility Tests](./testing/compatibility-tests)** - Test with Cisco clients

## Quick Start for Developers

### Set Up Development Environment

```bash
# Clone the repository
git clone https://github.com/dantte-lp/wolfguard.git
cd wolfguard

# Install dependencies (Ubuntu/Debian)
sudo apt-get install -y \
    build-essential cmake \
    libwolfssl-dev libev-dev \
    libreadline-dev check

# Build with debug symbols
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Debug ..
make -j$(nproc)

# Run tests
make test
```

### Make Your First API Call

```bash
# Get server status
curl -X GET https://vpn.example.com/api/v1/status \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# List active connections
curl -X GET https://vpn.example.com/api/v1/connections \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

See [REST API Documentation](./api/rest-api) for complete reference.

## Architecture Overview

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

## Common Development Tasks

### Adding a New API Endpoint

1. **Define the endpoint** in API specification
2. **Implement the handler** in C
3. **Add authentication** and authorization checks
4. **Write unit tests** for the endpoint
5. **Document** in API reference
6. **Update OpenAPI spec** (if applicable)

See [REST API Guide](./api/rest-api) for details.

### Implementing Custom Authentication

1. **Create auth module** following plugin architecture
2. **Implement auth interface** (validate, authorize)
3. **Register module** in configuration
4. **Test with real clients**
5. **Document configuration**

See [Custom Authentication](./examples/custom-auth) for examples.

### Contributing Code

1. **Fork the repository** on GitHub
2. **Create a feature branch** (`git checkout -b feature/my-feature`)
3. **Write code** following [coding standards](#coding-standards)
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Submit pull request** with clear description

See [Contributing Guide](/docs/resources/contributing) for details.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **Language** | C23 (ISO/IEC 9899:2023) |
| **TLS/Crypto** | WolfSSL 5.6.0+ |
| **Event Loop** | libev |
| **Firewall** | WolfSentry |
| **Build System** | CMake 3.20+ |
| **Testing** | Check, CTest |
| **Documentation** | Doxygen |

## Coding Standards

### C23 Best Practices

- Use `nullptr` instead of `NULL`
- Use `bool`, `true`, `false` from `<stdbool.h>`
- Use `static_assert` for compile-time checks
- Use `_Generic` for type-generic functions
- Follow MISRA-C guidelines where applicable

### Code Style

```c
// Function naming: snake_case
int wolfguard_auth_validate(const char *username, const char *password);

// Constants: UPPER_SNAKE_CASE
#define WOLFGUARD_MAX_USERS 1000

// Structs: snake_case with _t suffix
typedef struct wolfguard_config_t {
    char *server_name;
    uint16_t port;
    bool tls13_only;
} wolfguard_config_t;

// Error handling: always check return values
int result = wolfguard_init();
if (result != WOLFGUARD_SUCCESS) {
    log_error("Initialization failed: %s", wolfguard_strerror(result));
    return result;
}
```

### Security Considerations

1. **Input validation** - Validate all external input
2. **Buffer safety** - Use safe string functions
3. **Constant-time comparisons** - For cryptographic operations
4. **Secure memory** - Zero sensitive data after use
5. **Least privilege** - Drop privileges as early as possible

## API Design Principles

1. **RESTful** - Follow REST conventions
2. **Versioned** - API version in URL (`/api/v1/`)
3. **Authenticated** - All endpoints require authentication
4. **JSON** - Use JSON for request/response bodies
5. **Idempotent** - GET/PUT/DELETE operations are idempotent
6. **Documented** - Complete OpenAPI specification

## Performance Optimization

### Connection Handling

- **Zero-copy** where possible
- **Connection pooling** for database
- **Async I/O** with libev event loop
- **Caching** for frequently accessed data

### Memory Management

- **Arena allocators** for temporary allocations
- **Object pools** for frequently created/destroyed objects
- **Reference counting** for shared resources
- **Valgrind testing** to detect leaks

## Debugging Tools

| Tool | Purpose |
|------|---------|
| **GDB** | Interactive debugging |
| **Valgrind** | Memory leak detection |
| **AddressSanitizer** | Memory error detection |
| **strace** | System call tracing |
| **tcpdump/Wireshark** | Network protocol analysis |
| **perf** | Performance profiling |

## Related Guides

- **[Network Engineering](/docs/networking/)** - Protocol deep dive
- **[Administration](/docs/administration/)** - Deployment and configuration
- **[DevOps](/docs/devops/)** - Container deployment

## Resources

- **[Architecture Documentation](./architecture/overview)** - Detailed design
- **[API Reference](./api/rest-api)** - Complete API docs
- **[Code Examples](./examples/c23-examples)** - Learn by example
- **[Contributing Guide](/docs/resources/contributing)** - How to contribute
- **[GitHub Repository](https://github.com/dantte-lp/wolfguard)** - Source code

---

**Ready to start developing?** Check out the [Architecture Overview](./architecture/overview) or dive into [Code Examples](./examples/c23-examples)

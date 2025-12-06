---
title: Documentation Navigation Migration Guide
sidebar_position: 99
---

# Documentation Navigation Migration Guide

**Date**: October 30, 2025
**Version**: 2.0.0 (Persona-Based Navigation)
**Previous Version**: 1.0.0 (Technology-Based Navigation)

## Summary of Changes

The WolfGuard documentation has been reorganized from a **technology-focused** structure to a **user persona-based** structure. This change makes it easier for different types of users to find the information they need quickly.

## Navigation Changes

### Previous Structure (v1.0.0)

```
├── OpenConnect Protocol
│   ├── Protocol Specifications
│   ├── Reverse Engineering
│   └── Protocol Reference
├── ocserv (Vanilla)
│   ├── Features
│   └── Integration
├── wolfguard
│   ├── Getting Started
│   ├── Architecture
│   ├── Protocol Implementation
│   └── Implementation Guide
├── Guides
└── Release Notes
```

### New Structure (v2.0.0)

```
├── 📘 Getting Started (Simple Users)
├── 🔧 Administration (Org Administrators)
│   ├── Deployment
│   ├── User Management
│   ├── Security & Compliance
│   ├── Monitoring & Logging
│   └── Policies & Configuration
├── 🚀 DevOps (DevOps Engineers)
│   ├── Container Deployment
│   ├── Infrastructure as Code
│   ├── CI/CD Integration
│   ├── High Availability
│   └── Observability
├── 💻 Developer Guide (Developers)
│   ├── Architecture
│   ├── API Reference
│   ├── Code Examples
│   ├── Protocol Implementation
│   ├── Integration
│   └── Testing
├── 🌐 Network Engineering (Network Engineers)
│   ├── Protocol Deep Dive
│   ├── Network Topology
│   ├── Firewall & Routing
│   ├── DNS & DHCP
│   ├── Performance Tuning
│   └── Troubleshooting
├── 📚 Reference
│   ├── Cisco Secure Client Analysis
│   ├── OpenConnect Protocol
│   ├── ocserv Documentation
│   └── Configuration/Command Reference
└── 📋 Resources
    ├── Release Notes
    ├── Diagrams
    ├── Contributing
    └── Support
```

## URL Migration Mapping

### Old URLs → New URLs

#### Getting Started / Quick Start

| Old URL | New URL | Notes |
|---------|---------|-------|
| `/docs/wolfguard/getting-started/quick-start` | `/docs/getting-started/quick-start` | Moved to top-level |
| `/docs/wolfguard/getting-started/overview` | `/docs/getting-started/what-is-wolfguard` | Renamed |
| `/docs/wolfguard/intro` | `/docs/getting-started/` | Now landing page |

#### Administration

| Old URL | New URL | Notes |
|---------|---------|-------|
| `/docs/wolfguard/implementation/deployment` | `/docs/administration/deployment/server-setup` | Reorganized |
| `/docs/ocserv-vanilla/features/twofactor-auth` | `/docs/administration/users/two-factor-auth` | Moved |
| `/docs/ocserv-vanilla/integration/radius` | `/docs/administration/users/radius-integration` | Moved |
| `/docs/ocserv-vanilla/integration/scripts` | `/docs/administration/users/scripts` | Moved |

#### DevOps

| Old URL | New URL | Notes |
|---------|---------|-------|
| *New section* | `/docs/devops/containers/docker` | New content |
| *New section* | `/docs/devops/containers/kubernetes` | New content |
| *New section* | `/docs/devops/iac/terraform` | New content |

#### Developer Guide

| Old URL | New URL | Notes |
|---------|---------|-------|
| `/docs/wolfguard/architecture/modern-vpn-design` | `/docs/developers/architecture/modern-vpn-design` | Moved |
| `/docs/wolfguard/architecture/wolfsentry-integration` | `/docs/developers/architecture/wolfsentry-integration` | Moved |
| `/docs/wolfguard/implementation/wolfssl` | `/docs/developers/examples/wolfssl-integration` | Reorganized |
| `/docs/wolfguard/protocol/openconnect-v1.2` | `/docs/developers/protocol/openconnect-v1.2` | Moved |
| `/docs/wolfguard/protocol/cisco-compatibility` | `/docs/developers/protocol/cisco-compatibility` | Moved |

#### Network Engineering

| Old URL | New URL | Notes |
|---------|---------|-------|
| `/docs/openconnect-protocol/intro` | `/docs/networking/protocol/openconnect-overview` | Cross-referenced |
| `/docs/openconnect-protocol/protocol/crypto` | `/docs/networking/protocol/crypto` | Cross-referenced |
| `/docs/openconnect-protocol/protocol/authentication` | `/docs/networking/protocol/authentication-flow` | Renamed |
| `/docs/ocserv-vanilla/features/dpd-timers` | `/docs/networking/performance/dpd-timers` | Moved |
| `/docs/ocserv-vanilla/features/dns` | `/docs/networking/dns/dns-configuration` | Moved |

#### Reference Documentation

| Old URL | New URL | Notes |
|---------|---------|-------|
| `/docs/openconnect-protocol/*` | `/docs/reference/` → OpenConnect Protocol | Moved to Reference |
| `/docs/ocserv-vanilla/*` | `/docs/reference/` → ocserv Documentation | Moved to Reference |
| `/docs/cisco-secure-client/*` | `/docs/cisco-secure-client/*` | **No change** |
| `/docs/guides/diagrams` | `/docs/resources/diagrams` | Moved to Resources |

#### Resources

| Old URL | New URL | Notes |
|---------|---------|-------|
| `/docs/releases/` | `/docs/releases/` | **No change** |
| `/docs/guides/diagrams` | `/docs/resources/diagrams` | Moved |
| *New* | `/docs/resources/contributing` | New |
| *New* | `/docs/resources/support` | New |

## Content Reorganization

### Content Preserved

All existing content has been **preserved**. No documentation has been deleted. The changes are primarily:

1. **Organizational** - Content moved to user-centric categories
2. **Cross-linking** - Better connections between related content
3. **Landing pages** - New overview pages for each category
4. **Navigation** - Clearer navigation structure

### Content Added

New placeholder sections for:

- **Administration**: Deployment planning, user management, security
- **DevOps**: Container deployment, IaC, CI/CD, HA, observability
- **Developer**: API reference, code examples, testing
- **Network Engineering**: Topology, firewall config, troubleshooting

These sections will be populated with existing content from `wolfguard` and `ocserv-vanilla` sections, plus new content as it's created.

### Legacy Content

Old `wolfguard` documentation remains accessible under:
- `/docs/reference/` → wolfguard Legacy Docs

This allows for gradual migration and ensures no broken links.

## Redirects

### Recommended Redirects

Add these redirects to maintain backward compatibility:

```javascript
// In docusaurus.config.js
module.exports = {
  // ...
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // Getting Started
          {
            from: '/docs/wolfguard/getting-started/quick-start',
            to: '/docs/getting-started/quick-start',
          },
          {
            from: '/docs/wolfguard/intro',
            to: '/docs/getting-started/',
          },

          // Architecture -> Developer Guide
          {
            from: '/docs/wolfguard/architecture/modern-vpn-design',
            to: '/docs/developers/architecture/modern-vpn-design',
          },
          {
            from: '/docs/wolfguard/architecture/wolfsentry-integration',
            to: '/docs/developers/architecture/wolfsentry-integration',
          },

          // Protocol -> Developer Guide
          {
            from: '/docs/wolfguard/protocol/openconnect-v1.2',
            to: '/docs/developers/protocol/openconnect-v1.2',
          },
          {
            from: '/docs/wolfguard/protocol/cisco-compatibility',
            to: '/docs/developers/protocol/cisco-compatibility',
          },

          // Diagrams
          {
            from: '/docs/guides/diagrams',
            to: '/docs/resources/diagrams',
          },
        ],
      },
    ],
  ],
};
```

## Migration Checklist

### For Documentation Maintainers

- [x] Update `sidebars.js` with new structure
- [x] Update `docusaurus.config.js` navbar
- [x] Create `_category_.json` files for all categories
- [x] Create landing pages for each persona
- [ ] Move existing content to new locations
- [ ] Update internal links in documentation
- [ ] Add redirects for old URLs
- [ ] Test all navigation paths
- [ ] Update external links (if any)
- [ ] Announce changes to users

### For Content Migration

**Priority 1 (High)**: Essential user-facing content
- [ ] Move wolfguard/getting-started → getting-started/
- [ ] Move wolfguard/implementation → administration/deployment/
- [ ] Move ocserv features → appropriate sections

**Priority 2 (Medium)**: Developer content
- [ ] Move wolfguard/architecture → developers/architecture/
- [ ] Move wolfguard/protocol → developers/protocol/
- [ ] Create API documentation stubs

**Priority 3 (Low)**: Reference content
- [ ] Ensure all protocol docs are in reference/
- [ ] Create glossary
- [ ] Create command reference
- [ ] Create configuration reference

## User Impact

### Target User Experience

**Simple User** (wants to install):
- Clicks "Getting Started" → Finds "Quick Start" in < 10 seconds ✅

**Administrator** (needs deployment guide):
- Clicks "Administration" → Finds "Deployment" → "Server Setup" in < 10 seconds ✅

**DevOps Engineer** (wants Docker deployment):
- Clicks "DevOps" → Finds "Container Deployment" → "Docker" in < 10 seconds ✅

**Developer** (needs API docs):
- Clicks "Developer Guide" → Finds "API Reference" in < 10 seconds ✅

**Network Engineer** (troubleshooting):
- Clicks "Network Engineering" → Finds "Troubleshooting" in < 10 seconds ✅

### Search Impact

The built-in search will continue to work. Keywords have been added to category metadata to improve search results.

## Testing the New Navigation

### Manual Testing

1. **Start at homepage** `/docs/`
2. **Test each persona path**:
   - Getting Started → Quick Start
   - Administration → Deployment → Server Setup
   - DevOps → Containers → Docker
   - Developer Guide → API Reference
   - Network Engineering → Protocol → Overview
   - Reference → Cisco Client Analysis
3. **Verify no broken links**
4. **Test search functionality**
5. **Check mobile navigation**

### Automated Testing

```bash
# Build the documentation
npm run build

# Check for broken links
npm run check-links

# Serve locally and test
npm run serve
```

## Rollback Plan

If issues arise, the old structure can be restored:

1. **Restore old sidebars.js** from git history
2. **Restore old navbar** in docusaurus.config.js
3. **Keep landing pages** as they add value
4. **Remove redirects** if they cause issues

Git commit before migration:
```bash
git checkout <commit-hash-before-migration> -- sidebars.js docusaurus.config.js
```

## Timeline

- **Phase 1 (Week 1)**: Navigation structure updated ✅
- **Phase 2 (Week 2)**: Move existing content to new locations
- **Phase 3 (Week 3)**: Create placeholder content for new sections
- **Phase 4 (Week 4)**: Update all internal links and cross-references
- **Phase 5 (Week 5)**: Testing and validation
- **Phase 6 (Week 6)**: Deployment and announcement

## Support

Questions about the migration?

- **GitHub Issues**: https://github.com/dantte-lp/wolfguard-docs/issues
- **Email**: docs@wolfguard.io (if available)
- **Migration Questions**: Tag with `navigation-migration` label

## Feedback

We welcome feedback on the new navigation structure:

1. **File an issue**: Describe what's confusing or hard to find
2. **Suggest improvements**: Better categorization or organization
3. **Report broken links**: Any 404s or incorrect redirects

---

**Last Updated**: October 30, 2025
**Migration Status**: Phase 1 Complete (Navigation Structure)
**Next Phase**: Content Migration (Phase 2)

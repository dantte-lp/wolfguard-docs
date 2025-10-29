# Security Policy

## 🔒 Security Overview

WolfGuard is a security-critical VPN server implementation. We take security seriously and appreciate responsible disclosure of security vulnerabilities.

## 🛡️ Supported Versions

| Version | Status | Support |
|---------|--------|---------|
| 1.0.x   | ✅ Active | Full security support |
| < 1.0   | ⚠️ Beta | Best effort, upgrade recommended |

## 🚨 Reporting a Vulnerability

**DO NOT** open public issues for security vulnerabilities.

### Preferred Reporting Methods

1. **GitHub Security Advisories** (Recommended):
   - Navigate to: https://github.com/dantte-lp/wolfguard/security/advisories
   - Click "New draft security advisory"
   - Provide detailed information

2. **Direct Contact**:
   - For critical vulnerabilities requiring immediate attention
   - Contact via GitHub discussions (mark as security-sensitive)

### Information to Include

Please provide as much information as possible:

- **Vulnerability Type**: Buffer overflow, authentication bypass, etc.
- **Affected Component**: Which module/file is affected
- **Severity**: Your assessment (Critical/High/Medium/Low)
- **Proof of Concept**: Steps to reproduce
- **Impact**: What an attacker could achieve

## ⏱️ Response Timeline

We aim to respond to security reports within:

- **24 hours**: Initial acknowledgment
- **72 hours**: Preliminary assessment
- **7 days**: Detailed analysis and fix timeline
- **30 days**: Public disclosure (coordinated)

## 🎯 Scope

### In Scope

Security vulnerabilities in:

- WolfGuard Server core implementation
- Authentication mechanisms (SAML, OTP, certificates)
- Cryptography (TLS/DTLS)
- Session Management
- Configuration and privilege handling

### Out of Scope

- DDoS attacks
- Social engineering
- Physical access attacks
- Documentation typos (report as issues instead)

## 🔐 Security Best Practices

### For Administrators

1. Keep WolfGuard updated to latest stable version
2. Run as non-root user (principle of least privilege)
3. Enable security logging and monitoring
4. Protect private keys and passwords
5. Disable unused features

### For Developers

1. Validate all user input
2. Prevent buffer overflows
3. Use safe string functions
4. Don't roll your own crypto
5. Get security-critical code reviewed

## 📞 Contact

- **Security Issues**: GitHub Security Advisories (preferred)
- **General Questions**: https://github.com/dantte-lp/wolfguard/discussions
- **Non-Security Bugs**: https://github.com/dantte-lp/wolfguard/issues

---

**Thank you for helping keep WolfGuard secure!**

Last Updated: 2025-10-29

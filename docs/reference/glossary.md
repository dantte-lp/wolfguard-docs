---
title: Glossary
sidebar_position: 1
---

# Glossary

Technical terms and definitions used throughout WolfGuard documentation.

## A

**AnyConnect**
: Legacy name for Cisco's VPN client, now called Cisco Secure Client. The protocol is still commonly referred to as "AnyConnect protocol".

**Authentication**
: The process of verifying the identity of a user or device attempting to connect to the VPN.

**Authorization**
: The process of determining what resources an authenticated user is allowed to access.

## C

**Certificate Authority (CA)**
: An entity that issues digital certificates for verifying identities in PKI systems.

**Cisco Secure Client**
: Official VPN client from Cisco that implements the OpenConnect/AnyConnect protocol. Formerly known as AnyConnect.

**Cipher Suite**
: A combination of cryptographic algorithms used for key exchange, encryption, and message authentication in TLS/DTLS.

## D

**Dead Peer Detection (DPD)**
: A mechanism to detect if the remote VPN endpoint is still alive and responsive.

**DTLS (Datagram Transport Layer Security)**
: UDP-based variant of TLS used for the VPN data tunnel, providing better performance than TCP-based tunnels.

## M

**MTU (Maximum Transmission Unit)**
: The largest packet size that can be transmitted over a network. VPN tunnels typically require MTU adjustment.

**Multi-Factor Authentication (MFA)**
: Authentication requiring multiple forms of verification (e.g., password + OTP code).

## O

**OpenConnect**
: The protocol implemented by Cisco AnyConnect/Secure Client and compatible servers like WolfGuard and ocserv.

**ocserv**
: The original open-source OpenConnect VPN server implementation using GnuTLS.

## P

**PKI (Public Key Infrastructure)**
: A system for managing digital certificates and public-key encryption.

**Perfect Forward Secrecy (PFS)**
: A property of key exchange protocols where session keys are not compromised even if long-term keys are compromised.

## S

**Split Tunneling**
: VPN configuration where only specific traffic goes through the VPN tunnel, while other traffic goes directly to the internet.

**SSL VPN**
: A VPN that uses SSL/TLS protocols for encryption, as opposed to IPsec VPNs.

## T

**TLS (Transport Layer Security)**
: The cryptographic protocol used for secure communications over networks. Successor to SSL.

**Two-Factor Authentication (2FA)**
: A type of MFA using exactly two factors (typically password + OTP).

## W

**WolfGuard**
: Modern OpenConnect VPN server implementation built with WolfSSL and C23.

**WolfSSL**
: A lightweight SSL/TLS library optimized for embedded and IoT systems, with FIPS validation options.

**WolfSentry**
: An embedded firewall engine integrated into WolfGuard for dynamic access control.

---

**Missing a term?** [Suggest an addition](https://github.com/dantte-lp/wolfguard-docs/issues)

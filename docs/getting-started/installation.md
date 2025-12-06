---
sidebar_position: 3
title: Installation
---

# Installation Guide

Detailed installation instructions for WolfGuard VPN server on various platforms.

## Platform Support

WolfGuard supports the following platforms:

| Platform | Version | Status |
|----------|---------|--------|
| **Ubuntu** | 22.04 LTS, 24.04 LTS | ✅ Fully Supported |
| **Debian** | 11 (Bullseye), 12 (Bookworm) | ✅ Fully Supported |
| **RHEL** | 9.x | ✅ Fully Supported |
| **Rocky Linux** | 9.x | ✅ Fully Supported |
| **AlmaLinux** | 9.x | ✅ Fully Supported |
| **Docker** | Latest | ✅ Fully Supported |
| **Kubernetes** | 1.28+ | ✅ Fully Supported |

## System Requirements

### Minimum Requirements

- **CPU**: 2 cores
- **RAM**: 2 GB
- **Disk**: 10 GB
- **Network**: 10 Mbps
- **Users**: Up to 50 concurrent

### Recommended Requirements

- **CPU**: 4+ cores
- **RAM**: 4+ GB
- **Disk**: 20+ GB SSD
- **Network**: 100+ Mbps
- **Users**: 100+ concurrent

### Enterprise Requirements

- **CPU**: 8+ cores
- **RAM**: 16+ GB
- **Disk**: 50+ GB SSD
- **Network**: 1+ Gbps
- **Users**: 500+ concurrent

## Installation Methods

### 1. Package Manager (Recommended)

**Ubuntu/Debian** → See [Ubuntu Installation](#ubuntu--debian)
**RHEL/Rocky/Alma** → See [RHEL Installation](#rhel--rocky--alma)

### 2. Docker

**Quick deployment** → See [Docker Installation](#docker)

### 3. Kubernetes

**Production scale** → See [Kubernetes Guide](/docs/devops/containers/kubernetes)

### 4. From Source

**Development/customization** → See [Build from Source](#build-from-source)

## Ubuntu / Debian

### Add Repository

```bash
# Add WolfGuard GPG key
curl -fsSL https://repo.wolfguard.io/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/wolfguard.gpg

# Add repository
echo "deb [signed-by=/usr/share/keyrings/wolfguard.gpg] https://repo.wolfguard.io/apt stable main" | \
  sudo tee /etc/apt/sources.list.d/wolfguard.list

# Update package list
sudo apt update
```

### Install WolfGuard

```bash
# Install WolfGuard and recommended dependencies
sudo apt install -y wolfguard

# Optional: Install additional modules
sudo apt install -y \
  wolfguard-radius \   # RADIUS authentication
  wolfguard-ldap \     # LDAP/AD authentication
  wolfguard-tools      # CLI tools and utilities
```

### Verify Installation

```bash
# Check version
wolfguard --version

# Verify service
sudo systemctl status wolfguard
```

## RHEL / Rocky / Alma

### Add Repository

```bash
# Add WolfGuard repository
sudo tee /etc/yum.repos.d/wolfguard.repo <<EOF
[wolfguard]
name=WolfGuard Repository
baseurl=https://repo.wolfguard.io/rpm/el\$releasever/\$basearch
enabled=1
gpgcheck=1
gpgkey=https://repo.wolfguard.io/gpg.key
EOF
```

### Install WolfGuard

```bash
# Install WolfGuard
sudo dnf install -y wolfguard

# Optional: Install additional modules
sudo dnf install -y \
  wolfguard-radius \
  wolfguard-ldap \
  wolfguard-tools
```

### Configure SELinux

```bash
# Set SELinux policy for WolfGuard
sudo semanage port -a -t wolfguard_port_t -p tcp 443
sudo semanage port -a -t wolfguard_port_t -p udp 443

# Or temporarily set to permissive (not recommended for production)
sudo setenforce 0
```

## Docker

### Pull Image

```bash
# Pull latest stable image
docker pull wolfguard/wolfguard:latest

# Or specific version
docker pull wolfguard/wolfguard:v1.0.0
```

### Run Container

```bash
# Create volumes for persistence
docker volume create wolfguard-config
docker volume create wolfguard-certs

# Run WolfGuard container
docker run -d \
  --name wolfguard \
  --cap-add=NET_ADMIN \
  --device=/dev/net/tun \
  -p 443:443/tcp \
  -p 443:443/udp \
  -v wolfguard-config:/etc/wolfguard \
  -v wolfguard-certs:/etc/wolfguard/certs \
  --restart unless-stopped \
  wolfguard/wolfguard:latest
```

See [Docker Guide](/docs/devops/containers/docker) for detailed configuration.

## Build from Source

### Install Build Dependencies

**Ubuntu/Debian**:
```bash
sudo apt install -y \
  build-essential \
  cmake \
  git \
  libwolfssl-dev \
  libev-dev \
  libreadline-dev \
  libnl-genl-3-dev \
  libseccomp-dev \
  check
```

**RHEL/Rocky**:
```bash
sudo dnf groupinstall "Development Tools"
sudo dnf install -y \
  cmake \
  git \
  wolfssl-devel \
  libev-devel \
  readline-devel \
  libnl3-devel \
  libseccomp-devel \
  check-devel
```

### Clone and Build

```bash
# Clone repository
git clone https://github.com/dantte-lp/wolfguard.git
cd wolfguard

# Create build directory
mkdir build && cd build

# Configure with CMake
cmake -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_INSTALL_PREFIX=/usr \
      ..

# Build
make -j$(nproc)

# Run tests
make test

# Install
sudo make install

# Install systemd service
sudo cp ../contrib/systemd/wolfguard.service /etc/systemd/system/
sudo systemctl daemon-reload
```

## Post-Installation

After installation, complete these steps:

### 1. Create Configuration

```bash
# Copy example configuration
sudo cp /usr/share/doc/wolfguard/examples/wolfguard.conf /etc/wolfguard/

# Edit configuration
sudo nano /etc/wolfguard/wolfguard.conf
```

See [Configuration Guide](/docs/administration/deployment/server-setup) for details.

### 2. Generate Certificates

```bash
# Create certificate directory
sudo mkdir -p /etc/wolfguard/certs

# Generate certificates (see Quick Start for commands)
# Or use Let's Encrypt
sudo certbot certonly --standalone -d vpn.example.com
```

See [Certificate Management](/docs/administration/security/certificates).

### 3. Configure Firewall

```bash
# Allow VPN traffic
sudo ufw allow 443/tcp
sudo ufw allow 443/udp

# Or with firewalld
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=443/udp
sudo firewall-cmd --reload
```

### 4. Enable IP Forwarding

```bash
# Enable forwarding
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 5. Start Service

```bash
# Start WolfGuard
sudo systemctl start wolfguard

# Enable auto-start
sudo systemctl enable wolfguard

# Check status
sudo systemctl status wolfguard
```

## Upgrade

### Package Manager

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade wolfguard

# RHEL/Rocky
sudo dnf update wolfguard
```

### Docker

```bash
# Pull new image
docker pull wolfguard/wolfguard:latest

# Stop and remove old container
docker stop wolfguard
docker rm wolfguard

# Run new container (with same volumes)
docker run -d \
  --name wolfguard \
  # ... same parameters as before ...
  wolfguard/wolfguard:latest
```

## Uninstall

### Package Manager

```bash
# Ubuntu/Debian
sudo apt remove --purge wolfguard

# RHEL/Rocky
sudo dnf remove wolfguard

# Remove configuration (optional)
sudo rm -rf /etc/wolfguard
```

### Docker

```bash
# Stop and remove container
docker stop wolfguard
docker rm wolfguard

# Remove volumes (optional)
docker volume rm wolfguard-config wolfguard-certs

# Remove image
docker rmi wolfguard/wolfguard:latest
```

## Troubleshooting Installation

### Dependency Issues

**Problem**: Missing dependencies

**Solution**:
```bash
# Ubuntu/Debian
sudo apt install -f

# RHEL/Rocky
sudo dnf install --skip-broken
```

### Repository Issues

**Problem**: Cannot fetch repository

**Solution**:
```bash
# Check internet connectivity
ping repo.wolfguard.io

# Verify GPG key
curl -fsSL https://repo.wolfguard.io/gpg.key

# Check firewall/proxy settings
```

### Permission Issues

**Problem**: Permission denied during installation

**Solution**:
```bash
# Ensure you have sudo privileges
sudo -v

# Check ownership of directories
ls -l /etc/wolfguard
```

## Next Steps

After installation:

1. **[Quick Start Guide](./quick-start)** - Get your first VPN running
2. **[Server Setup](/docs/administration/deployment/server-setup)** - Production configuration
3. **[Security Hardening](/docs/administration/security/hardening)** - Secure your server

---

**Need help?** See [Common Problems](/docs/networking/troubleshooting/common-problems) or [get support](/docs/resources/support).

# DevOps Guide - WolfGuard Documentation

Modern DevOps workflow for the WolfGuard Documentation project using Task and Podman Quadlet SystemD integration.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Task Commands](#task-commands)
- [SystemD Quadlet Service](#systemd-quadlet-service)
- [Deployment Workflows](#deployment-workflows)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)
- [Migration from Make](#migration-from-make)

## Overview

This project uses modern DevOps tools for development and deployment:

- **Task (Taskfile)**: Modern Make alternative for task automation
- **Podman Quadlet**: SystemD integration for container lifecycle management
- **Traefik**: Automatic HTTPS with Let's Encrypt (Cloudflare DNS)
- **Podman Compose**: Multi-container orchestration (Compose Spec 2025)

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SystemD (Root)                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  wolfguard-docs.service (Quadlet)               │   │
│  │  ├─ wolfguard-docs container (Nginx + Docs)    │   │
│  │  └─ wolfguard-kroki container (Diagram service)│   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
                   Traefik Reverse Proxy
                          │
                          ↓
             https://docs.wolfguard.io (Public)
```

## Prerequisites

### Install Task

```bash
# Install Task (Taskfile runner)
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin

# Verify installation
task --version
```

### System Requirements

- **Podman**: Container engine (rootless or rootful)
- **Podman Compose**: Multi-container orchestration
- **SystemD**: For Quadlet integration (system-level)
- **Git**: Version control
- **Node.js 22+**: For local development (optional)

```bash
# Verify installations
podman --version
podman-compose --version
systemctl --version
node --version
```

## Quick Start

### Local Development

```bash
# Navigate to project
cd /opt/projects/repositories/wolfguard-docs

# View all available commands
task

# Install dependencies
task install

# Start Kroki service
task start-kroki

# Start development server
task dev
# Access at: http://localhost:3000
```

### Production Deployment

```bash
# Complete deployment
task deploy

# Or step by step:
task build      # Build container image
task start      # Start all services
task health     # Verify health
```

## Task Commands

### Development Commands

| Command | Description | Equivalent Make Command |
|---------|-------------|------------------------|
| `task install` | Install Node.js dependencies | `make install` |
| `task dev` | Start development server | `make dev` |
| `task dev-full` | Start Kroki + dev server | N/A |
| `task start-kroki` | Start only Kroki service | `make start-kroki` |
| `task build-local` | Build static site locally | `make build-local` |

### Container Build Commands

| Command | Description | Equivalent Make Command |
|---------|-------------|------------------------|
| `task build` | Build production container | `make build` |
| `task build-buildah` | Build with buildah | `make build-buildah` |
| `task inspect-labels` | Inspect OCI labels | `make inspect-labels` |

### Deployment Commands

| Command | Description | Equivalent Make Command |
|---------|-------------|------------------------|
| `task deploy` | Build and deploy | `make deploy` |
| `task start` | Start all containers | `make start` |
| `task stop` | Stop all containers | `make stop` |
| `task restart` | Restart containers | `make restart` |
| `task update` | Pull changes and redeploy | `make update` |

### Testing Commands

| Command | Description | Equivalent Make Command |
|---------|-------------|------------------------|
| `task test` | Run all tests | `make test` |
| `task test-kroki` | Test Kroki diagram generation | `make test-kroki` |
| `task health` | Check container health | `make health` |
| `task health-kroki` | Check Kroki health | `make health-kroki` |

### Maintenance Commands

| Command | Description | Equivalent Make Command |
|---------|-------------|------------------------|
| `task clean` | Clean build artifacts | `make clean` |
| `task logs` | View container logs | `make logs` |
| `task shell` | Open shell in app container | `make shell` |
| `task inspect` | Inspect container config | `make inspect` |

### Security Commands

| Command | Description | Equivalent Make Command |
|---------|-------------|------------------------|
| `task security-scan` | Scan for vulnerabilities | `make security-scan` |
| `task check-caps` | Check container capabilities | `make check-caps` |
| `task check-resources` | Check resource usage | `make check-resources` |

### Information Commands

| Command | Description | Equivalent Make Command |
|---------|-------------|------------------------|
| `task info` | Show project information | `make info` |
| `task quickstart` | Show quick start guide | `make quickstart` |
| `task --list` | List all tasks | `make help` |

## SystemD Quadlet Service

### Installation

The project includes Podman Quadlet units for automatic service management via SystemD.

#### 1. Copy Quadlet Files

```bash
# Copy systemd units to system directory
sudo cp /opt/projects/repositories/wolfguard-docs/systemd/*.container /etc/containers/systemd/
sudo cp /opt/projects/repositories/wolfguard-docs/systemd/*.network /etc/containers/systemd/

# Files installed:
# - wolfguard-docs.container (main app)
# - wolfguard-kroki.container (diagram service)
# - wolfguard-docs-internal.network (internal network)
```

#### 2. Build Container Image

Before enabling the service, build the container image:

```bash
cd /opt/projects/repositories/wolfguard-docs
task build
```

#### 3. Ensure traefik-public Network Exists

```bash
# Check if network exists
podman network ls | grep traefik-public

# Create if missing
sudo podman network create traefik-public
```

#### 4. Enable and Start Service

```bash
# Reload systemd to detect new quadlet files
sudo systemctl daemon-reload

# Enable services (start on boot)
sudo systemctl enable wolfguard-docs.service
sudo systemctl enable wolfguard-kroki.service

# Start services now
sudo systemctl start wolfguard-docs.service
sudo systemctl start wolfguard-kroki.service

# Check status
sudo systemctl status wolfguard-docs.service
sudo systemctl status wolfguard-kroki.service
```

### Service Management

```bash
# Start service
sudo systemctl start wolfguard-docs.service

# Stop service
sudo systemctl stop wolfguard-docs.service

# Restart service
sudo systemctl restart wolfguard-docs.service

# Check status
sudo systemctl status wolfguard-docs.service

# View logs (follow mode)
sudo journalctl -u wolfguard-docs.service -f

# View last 100 lines
sudo journalctl -u wolfguard-docs.service -n 100

# Disable service (prevent auto-start on boot)
sudo systemctl disable wolfguard-docs.service
```

### Update Workflow with SystemD

```bash
# 1. Pull latest changes
cd /opt/projects/repositories/wolfguard-docs
git pull

# 2. Rebuild container image
task build

# 3. Restart service (Quadlet will use new image)
sudo systemctl restart wolfguard-docs.service

# 4. Verify health
task health
```

## Deployment Workflows

### Development Workflow

```bash
# 1. Install dependencies
task install

# 2. Start Kroki for diagram rendering
task start-kroki

# 3. Start development server
task dev
# Access at http://localhost:3000

# 4. Make changes to docs (hot reload enabled)

# 5. Test Kroki integration
task test-kroki
```

### Production Deployment (Manual)

```bash
# Complete deployment with one command
task deploy

# Verify deployment
task health
task traefik-status

# View logs
task logs

# Access production site
# https://docs.wolfguard.io
```

### Production Deployment (SystemD Quadlet)

```bash
# 1. Build latest image
task build

# 2. Restart systemd service
sudo systemctl restart wolfguard-docs.service

# 3. Verify health
sudo journalctl -u wolfguard-docs.service -n 50
task health
```

### CI/CD Pipeline Example

```yaml
# Example GitHub Actions workflow
name: Deploy Documentation

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Task
        run: sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d

      - name: Build container
        run: task build

      - name: Run tests
        run: task test

      - name: Deploy to production
        run: |
          ssh production "cd /opt/projects/repositories/wolfguard-docs && \
                          git pull && \
                          task build && \
                          sudo systemctl restart wolfguard-docs.service"
```

## Monitoring and Maintenance

### Health Checks

```bash
# Check all container health
task health

# Check specific services
task health-kroki

# View resource usage
task check-resources

# Check container capabilities (security audit)
task check-caps
```

### Log Management

```bash
# View all logs (follow mode)
task logs

# View specific service logs
task logs-app      # Nginx/app logs
task logs-kroki    # Kroki logs

# SystemD logs (when using Quadlet)
sudo journalctl -u wolfguard-docs.service -f
sudo journalctl -u wolfguard-kroki.service -f

# Log rotation is configured:
# - Max size: 10MB per file
# - Max files: 3 (total 30MB)
```

### Resource Monitoring

```bash
# Real-time container stats
podman stats wolfguard-docs wolfguard-kroki

# Check resource limits
task check-resources

# SystemD resource limits (when using Quadlet)
systemctl show wolfguard-docs.service | grep -E "Memory|CPU"
```

### Security Scanning

```bash
# Scan container for vulnerabilities
task security-scan

# Check container capabilities
task check-caps

# Verify security context
podman inspect wolfguard-docs --format '{{json .HostConfig.SecurityOpt}}' | python3 -m json.tool
```

### Backup and Recovery

```bash
# Backup source code (Git repository)
cd /opt/projects/repositories/wolfguard-docs
git bundle create wolfguard-docs-backup.bundle --all

# Backup container volumes (if any persistent data)
podman volume export wolfguard-docs-data > wolfguard-docs-volume-backup.tar

# Restore from backup
git clone wolfguard-docs-backup.bundle wolfguard-docs-restored
```

## Troubleshooting

### Container Issues

#### Container won't start

```bash
# Check container logs
task logs

# Check systemd logs
sudo journalctl -u wolfguard-docs.service -n 100

# Inspect container configuration
task inspect

# Verify image exists
podman images | grep wolfguard-docs

# Rebuild if necessary
task build
```

#### Kroki not responding

```bash
# Check Kroki health
task health-kroki

# View Kroki logs
task logs-kroki

# Test Kroki endpoint
curl http://localhost:8000/health

# Restart Kroki
task stop-kroki
task start-kroki
```

#### Port binding conflicts

```bash
# Check what's using port 8000
sudo ss -tulpn | grep 8000

# Kill conflicting process or change port in compose.yaml
```

### Traefik Integration Issues

#### Site not accessible via HTTPS

```bash
# Check Traefik router status
task traefik-status

# Verify container is connected to traefik-public network
podman network inspect traefik-public | grep wolfguard-docs

# Check Traefik logs
podman logs traefik -f | grep wolfguard-docs

# Verify DNS resolution
dig docs.wolfguard.io
```

#### SSL certificate not generating

```bash
# Check Traefik ACME logs
podman logs traefik | grep acme

# Verify Cloudflare credentials (if using Cloudflare DNS)
# Check Traefik configuration file

# Force certificate renewal
sudo systemctl restart traefik.service
```

### Build Issues

#### Build fails

```bash
# Clean build cache
task clean

# Rebuild without cache
task build-buildah

# Check Containerfile syntax
podman build -f Containerfile -t test:latest .
```

#### Node.js dependency issues

```bash
# Clean npm cache
rm -rf node_modules package-lock.json
task install

# Or use fresh container build
task build
```

### Performance Issues

#### Site loading slowly

```bash
# Check resource usage
task check-resources

# Increase container memory limit (edit compose.yaml or systemd unit)
# Default: 128M for app, 512M for Kroki

# Check network latency
curl -w "@curl-format.txt" -o /dev/null -s https://docs.wolfguard.io
```

#### Kroki diagram generation slow

```bash
# Increase Kroki memory limit
# Edit compose.yaml or systemd/wolfguard-kroki.container
# Default: 512M, consider increasing to 1G

# Restart with new limits
sudo systemctl restart wolfguard-kroki.service
```

## Migration from Make

The project maintains backward compatibility with Make while offering improved functionality via Task.

### Command Migration Table

| Make Command | Task Command | Notes |
|--------------|--------------|-------|
| `make help` | `task` or `task --list` | Task shows descriptions by default |
| `make install` | `task install` | Identical functionality |
| `make dev` | `task dev` | Identical functionality |
| `make build` | `task build` | Identical functionality |
| `make deploy` | `task deploy` | Identical functionality |
| `make start` | `task start` | Identical functionality |
| `make stop` | `task stop` | Identical functionality |
| `make restart` | `task restart` | Identical functionality |
| `make logs` | `task logs` | Identical functionality |
| `make clean` | `task clean` | Identical functionality |
| `make test` | `task test` | Identical functionality |
| `make health` | `task health` | Identical functionality |

### Why Task Over Make?

**Advantages of Task:**

1. **Better UX**: Colored output, built-in help, task summaries
2. **Modern YAML syntax**: More readable than Makefile syntax
3. **Cross-platform**: Works on Linux, macOS, Windows
4. **Built-in features**: Variables, dependencies, preconditions, etc.
5. **No special characters**: No need for `@` or `.PHONY`
6. **Task descriptions**: `task --list` shows all available tasks with descriptions
7. **Dynamic variables**: Shell command outputs as variables
8. **Better error handling**: Automatic `errexit` and `pipefail`

**Keeping Makefile:**

The Makefile is retained for:
- Backward compatibility
- CI/CD pipelines that use Make
- Developers familiar with Make
- Gradual migration

You can use both interchangeably:
```bash
make deploy   # Still works
task deploy   # Modern alternative
```

### Migrating Your Workflow

**Week 1-2**: Learn Task commands
```bash
task --list          # Explore available tasks
task info            # View project information
task quickstart      # Quick start guide
```

**Week 3-4**: Use Task for daily work
```bash
task dev             # Development
task deploy          # Deployment
task logs            # Debugging
```

**Week 5+**: Full Task adoption
- Update documentation to reference Task
- Update CI/CD pipelines to use Task
- Remove Make dependency (optional)

## Best Practices

### Development

1. **Always start Kroki before dev server**
   ```bash
   task start-kroki
   task dev
   ```

2. **Run tests before deploying**
   ```bash
   task test
   task deploy
   ```

3. **Use health checks after deployment**
   ```bash
   task deploy
   task health
   ```

### Production

1. **Use SystemD Quadlet for production**
   - Automatic restart on failure
   - Starts on system boot
   - Integrated with system logging
   - Resource limits enforcement

2. **Monitor logs regularly**
   ```bash
   sudo journalctl -u wolfguard-docs.service -f
   ```

3. **Perform health checks**
   ```bash
   task health
   task traefik-status
   ```

4. **Keep containers updated**
   ```bash
   git pull
   task build
   sudo systemctl restart wolfguard-docs.service
   ```

### Security

1. **Regular vulnerability scanning**
   ```bash
   task security-scan
   ```

2. **Audit container capabilities**
   ```bash
   task check-caps
   ```

3. **Review security options**
   ```bash
   podman inspect wolfguard-docs --format '{{json .HostConfig.SecurityOpt}}'
   ```

4. **Keep base images updated**
   ```bash
   podman pull docker.io/yuzutech/kroki:0.25.0
   task build
   ```

## Additional Resources

- **Task Documentation**: https://taskfile.dev
- **Podman Quadlet Guide**: https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html
- **Compose Specification**: https://github.com/compose-spec/compose-spec
- **Traefik Documentation**: https://doc.traefik.io/traefik/

## Support

For issues or questions:
- Check this documentation
- Run `task info` for project information
- Run `task quickstart` for quick start guide
- View logs: `task logs` or `sudo journalctl -u wolfguard-docs.service -f`
- Check health: `task health`

---

**Last Updated**: 2025-11-13
**Maintainer**: WolfGuard Documentation Team

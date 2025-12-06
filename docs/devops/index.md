---
sidebar_position: 0
title: DevOps
slug: /devops/
---

# DevOps Guide

Infrastructure automation and DevOps practices for WolfGuard deployment and operations.

## Overview

This section is designed for **DevOps engineers** who need to:

- Deploy WolfGuard using containers (Docker, Podman, Kubernetes)
- Automate infrastructure with IaC (Terraform, Ansible, Helm)
- Integrate with CI/CD pipelines
- Implement high availability and scalability
- Set up comprehensive observability

## DevOps Topics

### 1. Container Deployment

Deploy WolfGuard using containerization:

- **[Docker](./containers/docker)** - Run WolfGuard in Docker containers
- **[Podman](./containers/podman)** - Use Podman for rootless containers
- **[Kubernetes](./containers/kubernetes)** - Deploy on Kubernetes clusters
- **[Docker Compose](./containers/compose)** - Multi-container orchestration

### 2. Infrastructure as Code

Automate infrastructure provisioning:

- **[Ansible](./iac/ansible)** - Ansible playbooks for WolfGuard deployment
- **[Terraform](./iac/terraform)** - Terraform modules for cloud deployment
- **[Helm Charts](./iac/helm-charts)** - Kubernetes Helm charts

### 3. CI/CD Integration

Integrate with continuous deployment pipelines:

- **[GitHub Actions](./cicd/github-actions)** - Automate with GitHub Actions
- **[GitLab CI](./cicd/gitlab-ci)** - GitLab CI/CD pipelines
- **[Jenkins](./cicd/jenkins)** - Jenkins pipeline examples

### 4. High Availability

Build resilient, scalable infrastructure:

- **[Load Balancing](./ha/load-balancing)** - Distribute traffic across instances
- **[Failover](./ha/failover)** - Automatic failover configuration
- **[Scaling](./ha/scaling)** - Horizontal and vertical scaling
- **[Backup & Recovery](./ha/backup-recovery)** - Disaster recovery procedures

### 5. Observability

Monitor, trace, and debug your infrastructure:

- **[Prometheus](./observability/prometheus)** - Metrics collection with Prometheus
- **[Grafana](./observability/grafana)** - Visualization with Grafana dashboards
- **[ELK Stack](./observability/elk-stack)** - Centralized logging with Elasticsearch
- **[Distributed Tracing](./observability/tracing)** - Request tracing with Jaeger/Tempo

## Quick Start for DevOps

### Deploy with Docker (5 minutes)

```bash
# Pull the latest image
docker pull wolfguard/wolfguard:latest

# Run with basic configuration
docker run -d \
  --name wolfguard \
  -p 443:443 \
  -p 443:443/udp \
  -v /etc/wolfguard:/etc/wolfguard \
  wolfguard/wolfguard:latest
```

See [Docker Guide](./containers/docker) for complete instructions.

### Deploy on Kubernetes

```bash
# Add Helm repository
helm repo add wolfguard https://charts.wolfguard.io
helm repo update

# Install with Helm
helm install wolfguard wolfguard/wolfguard \
  --set replicaCount=3 \
  --set ingress.enabled=true
```

See [Kubernetes Guide](./containers/kubernetes) for complete instructions.

## Common DevOps Workflows

### Container-Based Deployment

1. **Choose Your Platform** → [Docker](./containers/docker), [Podman](./containers/podman), or [Kubernetes](./containers/kubernetes)
2. **Configure Secrets** → Use environment variables or secret management
3. **Set Up Persistence** → Configure volumes for certificates and configuration
4. **Deploy** → Run containers with appropriate resource limits
5. **Monitor** → Integrate with [Prometheus](./observability/prometheus) and [Grafana](./observability/grafana)

### Infrastructure Automation

1. **Select IaC Tool** → [Terraform](./iac/terraform) for cloud, [Ansible](./iac/ansible) for configuration
2. **Define Infrastructure** → Create modules/playbooks
3. **Version Control** → Store IaC in Git repositories
4. **CI/CD Integration** → Automate with [GitHub Actions](./cicd/github-actions) or [GitLab CI](./cicd/gitlab-ci)
5. **Test & Deploy** → Validate and apply changes

### High Availability Setup

1. **Deploy Multiple Instances** → Use [Kubernetes](./containers/kubernetes) or cloud auto-scaling
2. **Configure Load Balancer** → Set up [Load Balancing](./ha/load-balancing)
3. **Enable Health Checks** → Monitor instance health
4. **Set Up Failover** → Configure automatic [Failover](./ha/failover)
5. **Test Recovery** → Validate [Backup & Recovery](./ha/backup-recovery) procedures

## Architecture Patterns

### Single-Server Deployment
- Simple Docker/Podman deployment
- Suitable for small teams (< 50 users)
- Lower cost and complexity

### High-Availability Cluster
- Multiple instances behind load balancer
- Database replication for state
- Suitable for medium organizations (50-500 users)

### Multi-Region Deployment
- Kubernetes clusters across regions
- Global load balancing
- Disaster recovery across regions
- Suitable for large enterprises (500+ users)

## Best Practices

1. **Use immutable infrastructure** - Rebuild containers instead of patching
2. **Implement GitOps** - Manage infrastructure through Git
3. **Automate everything** - No manual configuration changes
4. **Monitor proactively** - Set up alerts before issues occur
5. **Test disaster recovery** - Regular DR drills
6. **Use secrets management** - Vault, Sealed Secrets, or cloud KMS
7. **Implement blue-green deployments** - Zero-downtime updates
8. **Resource limits** - Set appropriate CPU/memory limits

## Container Security

- **Run as non-root** user inside containers
- **Use minimal base images** (Alpine, distroless)
- **Scan images** for vulnerabilities
- **Sign images** with container signing tools
- **Use network policies** in Kubernetes
- **Enable Pod Security Standards**

## Performance Optimization

- **Resource allocation** - Right-size CPU and memory
- **Connection pooling** - Optimize database connections
- **Caching** - Use Redis for session caching
- **CDN** - Distribute static assets
- **Horizontal scaling** - Add instances as needed

## Related Guides

- **[Administration](/docs/administration/)** - User management and policies
- **[Developer Guide](/docs/developers/)** - API and integration
- **[Network Engineering](/docs/networking/)** - Network troubleshooting

## Tools & Integrations

| Category | Tools |
|----------|-------|
| **Containers** | Docker, Podman, Kubernetes, OpenShift |
| **IaC** | Terraform, Ansible, Pulumi, Helm |
| **CI/CD** | GitHub Actions, GitLab CI, Jenkins, ArgoCD |
| **Monitoring** | Prometheus, Grafana, Datadog, New Relic |
| **Logging** | ELK Stack, Loki, Fluentd, Splunk |
| **Secrets** | Vault, Sealed Secrets, AWS Secrets Manager |

---

**Ready to deploy?** Start with [Docker Deployment](./containers/docker) or [Kubernetes](./containers/kubernetes)

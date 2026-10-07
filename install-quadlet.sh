#!/bin/bash
# ═══════════════════════════════════════════════════════════════════
# Quadlet Installation Script for WolfGuard Documentation
# Installs SystemD Quadlet units for automatic service management
# ═══════════════════════════════════════════════════════════════════
# Usage:
#   sudo ./install-quadlet.sh
#
# What this script does:
#   1. Copies Quadlet unit files to /etc/containers/systemd/
#   2. Creates traefik-public network if missing
#   3. Builds container image
#   4. Reloads SystemD daemon
#   5. Enables and starts services
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root (use sudo)${NC}"
   exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  WolfGuard Documentation - Quadlet Installation${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# 1. Create systemd directory if missing
echo -e "${YELLOW}Step 1: Creating /etc/containers/systemd/ directory...${NC}"
mkdir -p /etc/containers/systemd/
echo -e "${GREEN}✓ Directory created${NC}"
echo ""

# 2. Copy Quadlet unit files
echo -e "${YELLOW}Step 2: Copying Quadlet unit files...${NC}"
cp -v systemd/wolfguard-docs.container /etc/containers/systemd/
cp -v systemd/wolfguard-kroki.container /etc/containers/systemd/
cp -v systemd/wolfguard-docs-internal.network /etc/containers/systemd/
echo -e "${GREEN}✓ Quadlet files installed${NC}"
echo ""

# 3. Ensure traefik-public network exists
echo -e "${YELLOW}Step 3: Checking traefik-public network...${NC}"
if podman network exists traefik-public; then
    echo -e "${GREEN}✓ traefik-public network already exists${NC}"
else
    echo -e "${YELLOW}Creating traefik-public network...${NC}"
    podman network create traefik-public
    echo -e "${GREEN}✓ traefik-public network created${NC}"
fi
echo ""

# 4. Build container image
echo -e "${YELLOW}Step 4: Building container image...${NC}"
echo -e "${BLUE}This may take a few minutes...${NC}"

# Check if task is installed
if command -v task &> /dev/null; then
    echo -e "${BLUE}Using Task to build image...${NC}"
    task build
elif command -v make &> /dev/null; then
    echo -e "${BLUE}Using Make to build image...${NC}"
    make build
else
    echo -e "${YELLOW}Task and Make not found, using podman-compose directly...${NC}"
    podman-compose -f compose.yaml build app
fi

echo -e "${GREEN}✓ Container image built${NC}"
echo ""

# 5. Reload SystemD daemon
echo -e "${YELLOW}Step 5: Reloading SystemD daemon...${NC}"
systemctl daemon-reload
echo -e "${GREEN}✓ SystemD daemon reloaded${NC}"
echo ""

# 6. Enable services
echo -e "${YELLOW}Step 6: Enabling services...${NC}"
systemctl enable wolfguard-kroki.service
systemctl enable wolfguard-docs.service
echo -e "${GREEN}✓ Services enabled (will start on boot)${NC}"
echo ""

# 7. Start services
echo -e "${YELLOW}Step 7: Starting services...${NC}"
systemctl start wolfguard-kroki.service
sleep 5  # Wait for Kroki to be healthy
systemctl start wolfguard-docs.service
echo -e "${GREEN}✓ Services started${NC}"
echo ""

# 8. Check service status
echo -e "${YELLOW}Step 8: Checking service status...${NC}"
echo ""
echo -e "${BLUE}Kroki Service Status:${NC}"
systemctl status wolfguard-kroki.service --no-pager -l || true
echo ""
echo -e "${BLUE}Docs Service Status:${NC}"
systemctl status wolfguard-docs.service --no-pager -l || true
echo ""

# 9. Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Installation Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Services Installed:${NC}"
echo -e "  • wolfguard-kroki.service"
echo -e "  • wolfguard-docs.service"
echo ""
echo -e "${GREEN}Management Commands:${NC}"
echo -e "  ${BLUE}Status:${NC}   systemctl status wolfguard-docs.service"
echo -e "  ${BLUE}Logs:${NC}     journalctl -u wolfguard-docs.service -f"
echo -e "  ${BLUE}Restart:${NC}  systemctl restart wolfguard-docs.service"
echo -e "  ${BLUE}Stop:${NC}     systemctl stop wolfguard-docs.service"
echo -e "  ${BLUE}Disable:${NC}  systemctl disable wolfguard-docs.service"
echo ""
echo -e "${GREEN}Access Points:${NC}"
echo -e "  ${BLUE}Production:${NC}  https://docs.wolfguard.io"
echo -e "  ${BLUE}Kroki Local:${NC} http://localhost:8000"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Verify services are healthy: systemctl status wolfguard-docs.service"
echo -e "  2. Check logs: journalctl -u wolfguard-docs.service -f"
echo -e "  3. Test site: curl -I https://docs.wolfguard.io"
echo ""

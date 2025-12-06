# Makefile for Cisco Secure Client Documentation (Modernized 2025)

.PHONY: help install dev build clean deploy start stop restart logs ps health validate

# Default target
.DEFAULT_GOAL := help

# Variables
COMPOSE_FILE := compose.yaml
COMPOSE := podman-compose -f $(COMPOSE_FILE)
VERSION ?= 1.0.0
BUILD_DATE := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
VCS_REF := $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
RED := \033[0;31m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo -e "$(BLUE)Cisco Secure Client Documentation - Make Commands$(NC)"
	@echo -e ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo -e ""
	@echo -e "$(YELLOW)Environment Variables:$(NC)"
	@echo -e "  VERSION=$(VERSION)"
	@echo -e "  BUILD_DATE=$(BUILD_DATE)"
	@echo -e "  VCS_REF=$(VCS_REF)"

# ═══════════════════════════════════════════════════════════════════
# Local Development Commands
# ═══════════════════════════════════════════════════════════════════

install: ## Install Node.js dependencies
	@echo -e "$(BLUE)Installing dependencies...$(NC)"
	npm install
	@echo -e "$(GREEN)✓ Dependencies installed$(NC)"

dev: ## Start development server (localhost:3000)
	@echo -e "$(BLUE)Starting development server...$(NC)"
	@echo -e "$(YELLOW)Make sure Kroki is running: make start-kroki$(NC)"
	npm start

build-local: ## Build static site locally
	@echo -e "$(BLUE)Building static site...$(NC)"
	npm run build
	@echo -e "$(GREEN)✓ Build complete$(NC)"

serve-local: ## Serve built site locally
	@echo -e "$(BLUE)Serving built site...$(NC)"
	npm run serve

# ═══════════════════════════════════════════════════════════════════
# Container Build Commands
# ═══════════════════════════════════════════════════════════════════

build: ## Build container image with podman-compose
	@echo -e "$(BLUE)Building container image...$(NC)"
	$(COMPOSE) build \
		--build-arg BUILD_DATE=$(BUILD_DATE) \
		--build-arg VERSION=$(VERSION) \
		--build-arg VCS_REF=$(VCS_REF) \
		app
	@echo -e "$(GREEN)✓ Image built successfully!$(NC)"
	@echo -e "$(BLUE)Image details:$(NC)"
	@podman images cisco-secure-client-docs_app:latest

build-buildah: ## Build with buildah (alternative)
	@echo -e "$(BLUE)Building with buildah...$(NC)"
	buildah bud -t ocproto-docs:latest \
		--build-arg BUILD_DATE=$(BUILD_DATE) \
		--build-arg VERSION=$(VERSION) \
		--build-arg VCS_REF=$(VCS_REF) \
		-f Containerfile .
	@echo -e "$(GREEN)✓ Image built with buildah!$(NC)"

inspect-labels: ## Inspect OCI labels of built image
	@echo -e "$(BLUE)OCI Labels:$(NC)"
	@podman inspect ocproto-docs:latest --format '{{json .Labels}}' | python3 -m json.tool || echo "$(RED)Image not found. Run 'make build' first.$(NC)"

# ═══════════════════════════════════════════════════════════════════
# Compose Management Commands
# ═══════════════════════════════════════════════════════════════════

validate: ## Validate compose.yaml syntax
	@echo -e "$(BLUE)Validating compose.yaml...$(NC)"
	@$(COMPOSE) config --quiet && echo "$(GREEN)✓ Syntax valid$(NC)" || echo "$(RED)✗ Syntax error$(NC)"

compose-config: ## Show resolved compose configuration
	@echo -e "$(BLUE)Resolved compose configuration:$(NC)"
	@$(COMPOSE) config

start: ## Start all containers with podman-compose
	@echo -e "$(BLUE)Starting containers...$(NC)"
	$(COMPOSE) up -d
	@echo -e "$(GREEN)✓ Containers started!$(NC)"
	@echo -e "$(BLUE)Access at: https://docs.wolfguard.io$(NC)"
	@echo -e "$(BLUE)Kroki local: http://localhost:8000$(NC)"

start-kroki: ## Start only Kroki service (for local development)
	@echo -e "$(BLUE)Starting Kroki service...$(NC)"
	$(COMPOSE) up -d kroki
	@echo -e "$(GREEN)✓ Kroki started!$(NC)"
	@echo -e "$(BLUE)Kroki available at: http://localhost:8000$(NC)"
	@sleep 2
	@make health-kroki

stop: ## Stop all containers
	@echo -e "$(BLUE)Stopping containers...$(NC)"
	$(COMPOSE) down
	@echo -e "$(GREEN)✓ Containers stopped!$(NC)"

stop-kroki: ## Stop only Kroki service
	@echo -e "$(BLUE)Stopping Kroki service...$(NC)"
	$(COMPOSE) stop kroki
	@echo -e "$(GREEN)✓ Kroki stopped!$(NC)"

restart: stop start ## Restart all containers

logs: ## View all container logs
	$(COMPOSE) logs -f

logs-app: ## View app (nginx) logs only
	$(COMPOSE) logs -f app

logs-kroki: ## View Kroki logs only
	$(COMPOSE) logs -f kroki

ps: ## Show running containers
	@echo -e "$(BLUE)Running containers:$(NC)"
	@$(COMPOSE) ps

# ═══════════════════════════════════════════════════════════════════
# Health Check Commands
# ═══════════════════════════════════════════════════════════════════

health: ## Check all container health
	@echo -e "$(BLUE)Container Health Status:$(NC)"
	@echo -e ""
	@echo -e "$(BLUE)App (nginx) status:$(NC)"
	@podman inspect ocproto-docs --format='{{.State.Status}}' 2>/dev/null || echo "$(RED)Container not running$(NC)"
	@echo -e ""
	@echo -e "$(BLUE)Kroki status:$(NC)"
	@podman inspect ocproto-kroki --format='{{.State.Status}}' 2>/dev/null || echo "$(RED)Container not running$(NC)"
	@echo -e ""
	@echo -e "$(BLUE)Testing HTTPS access:$(NC)"
	@curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://docs.wolfguard.io || echo "$(RED)Failed to connect$(NC)"

health-kroki: ## Check Kroki health
	@echo -e "$(BLUE)Checking Kroki health...$(NC)"
	@curl -s http://localhost:8000/health && echo "$(GREEN)✓ Kroki healthy$(NC)" || echo "$(RED)✗ Kroki not responding$(NC)"

test-kroki: ## Test Kroki diagram generation
	@echo -e "$(BLUE)Testing Kroki diagram generation...$(NC)"
	@echo -e ""
	@echo -e "$(BLUE)1. PlantUML test:$(NC)"
	@curl -X POST http://localhost:8000/plantuml/svg \
		-H "Content-Type: text/plain" \
		-d '@startuml\nAlice -> Bob: Hello\n@enduml' \
		--max-time 5 -s -o /tmp/kroki-test-plantuml.svg \
		&& echo "$(GREEN)✓ PlantUML OK (saved to /tmp/kroki-test-plantuml.svg)$(NC)" \
		|| echo "$(RED)✗ PlantUML failed$(NC)"
	@echo -e ""
	@echo -e "$(BLUE)2. Mermaid test:$(NC)"
	@curl -X POST http://localhost:8000/mermaid/svg \
		-H "Content-Type: text/plain" \
		-d 'graph TD\nA-->B' \
		--max-time 5 -s -o /tmp/kroki-test-mermaid.svg \
		&& echo "$(GREEN)✓ Mermaid OK (saved to /tmp/kroki-test-mermaid.svg)$(NC)" \
		|| echo "$(RED)✗ Mermaid failed$(NC)"

# ═══════════════════════════════════════════════════════════════════
# Deployment Commands
# ═══════════════════════════════════════════════════════════════════

deploy: build start ## Build and deploy containers
	@echo -e "$(GREEN)✓ Deployment complete!$(NC)"
	@echo -e "$(BLUE)Site available at: https://docs.wolfguard.io$(NC)"
	@echo -e "$(BLUE)Check Traefik dashboard: https://tr-01.infra4.dev$(NC)"
	@echo -e "$(BLUE)Kroki local access: http://localhost:8000$(NC)"
	@sleep 3
	@make health

update: ## Pull latest changes, rebuild, and redeploy
	@echo -e "$(BLUE)Updating documentation site...$(NC)"
	git pull
	$(MAKE) migrate
	$(MAKE) deploy
	@echo -e "$(GREEN)✓ Update complete!$(NC)"

# ═══════════════════════════════════════════════════════════════════
# Maintenance Commands
# ═══════════════════════════════════════════════════════════════════

clean: ## Remove build artifacts and containers
	@echo -e "$(BLUE)Cleaning up...$(NC)"
	rm -rf build .docusaurus node_modules
	$(COMPOSE) down -v 2>/dev/null || true
	podman rmi ocproto-docs:latest 2>/dev/null || true
	@echo -e "$(GREEN)✓ Cleanup complete!$(NC)"

migrate: ## Re-run documentation migration
	@echo -e "$(BLUE)Migrating documentation files...$(NC)"
	./migrate-docs.sh
	@echo -e "$(GREEN)✓ Migration complete!$(NC)"

shell: ## Open shell in running app container
	@echo -e "$(BLUE)Opening shell in app container...$(NC)"
	podman exec -it ocproto-docs sh

shell-kroki: ## Open shell in running Kroki container
	@echo -e "$(BLUE)Opening shell in Kroki container...$(NC)"
	podman exec -it ocproto-kroki sh

inspect: ## Inspect app container configuration
	@echo -e "$(BLUE)App container configuration:$(NC)"
	@podman inspect ocproto-docs | python3 -m json.tool | less

inspect-kroki: ## Inspect Kroki container configuration
	@echo -e "$(BLUE)Kroki container configuration:$(NC)"
	@podman inspect ocproto-kroki | python3 -m json.tool | less

# ═══════════════════════════════════════════════════════════════════
# Traefik Integration Commands
# ═══════════════════════════════════════════════════════════════════

traefik-status: ## Check Traefik router status
	@echo -e "$(BLUE)Checking Traefik router status...$(NC)"
	@curl -s https://tr-01.infra4.dev/api/http/routers | python3 -m json.tool | grep -A 10 "ocproto" || echo "$(RED)Router not found$(NC)"

# ═══════════════════════════════════════════════════════════════════
# Testing Commands
# ═══════════════════════════════════════════════════════════════════

test: ## Run basic tests
	@echo -e "$(BLUE)Running tests...$(NC)"
	@echo -e ""
	@echo -e "$(BLUE)1. Checking if app container is running...$(NC)"
	@podman ps | grep ocproto-docs && echo "$(GREEN)✓ App container running$(NC)" || (echo "$(RED)✗ App container not running$(NC)" && exit 1)
	@echo -e ""
	@echo -e "$(BLUE)2. Checking if Kroki container is running...$(NC)"
	@podman ps | grep ocproto-kroki && echo "$(GREEN)✓ Kroki container running$(NC)" || (echo "$(RED)✗ Kroki container not running$(NC)" && exit 1)
	@echo -e ""
	@echo -e "$(BLUE)3. Testing HTTPS access...$(NC)"
	@curl -s -f -o /dev/null https://docs.wolfguard.io && echo "$(GREEN)✓ Site accessible$(NC)" || (echo "$(RED)✗ Site not accessible$(NC)" && exit 1)
	@echo -e ""
	@echo -e "$(BLUE)4. Testing Kroki health...$(NC)"
	@curl -s http://localhost:8000/health >/dev/null && echo "$(GREEN)✓ Kroki responding$(NC)" || (echo "$(RED)✗ Kroki not responding$(NC)" && exit 1)
	@echo -e ""
	@echo -e "$(GREEN)✓ All tests passed!$(NC)"

# ═══════════════════════════════════════════════════════════════════
# Security & Compliance Commands
# ═══════════════════════════════════════════════════════════════════

security-scan: ## Scan image for vulnerabilities with grype
	@echo -e "$(BLUE)Scanning image for vulnerabilities...$(NC)"
	@command -v grype >/dev/null 2>&1 && grype ocproto-docs:latest || \
		echo "$(YELLOW)grype not installed. Install: https://github.com/anchore/grype$(NC)"

check-caps: ## Check container capabilities
	@echo -e "$(BLUE)App container capabilities:$(NC)"
	@podman inspect ocproto-docs --format '{{json .EffectiveCaps}}' | python3 -m json.tool || echo "$(RED)Container not running$(NC)"
	@echo -e ""
	@echo -e "$(BLUE)Kroki container capabilities:$(NC)"
	@podman inspect ocproto-kroki --format '{{json .EffectiveCaps}}' | python3 -m json.tool || echo "$(RED)Container not running$(NC)"

check-resources: ## Check resource usage
	@echo -e "$(BLUE)Container resource usage:$(NC)"
	@podman stats --no-stream ocproto-docs ocproto-kroki 2>/dev/null || echo "$(RED)Containers not running$(NC)"

# ═══════════════════════════════════════════════════════════════════
# Documentation & Information
# ═══════════════════════════════════════════════════════════════════

info: ## Show project information
	@echo -e "$(BLUE)═══════════════════════════════════════════════════════$(NC)"
	@echo -e "$(BLUE)  OpenConnect Protocol Documentation$(NC)"
	@echo -e "$(BLUE)═══════════════════════════════════════════════════════$(NC)"
	@echo -e ""
	@echo -e "  $(GREEN)Production URL:$(NC)   https://docs.wolfguard.io"
	@echo -e "  $(GREEN)Kroki Local:$(NC)      http://localhost:8000"
	@echo -e "  $(GREEN)Traefik Dashboard:$(NC) https://tr-01.infra4.dev"
	@echo -e ""
	@echo -e "  $(GREEN)Version:$(NC)          $(VERSION)"
	@echo -e "  $(GREEN)Build Date:$(NC)       $(BUILD_DATE)"
	@echo -e "  $(GREEN)VCS Ref:$(NC)          $(VCS_REF)"
	@echo -e ""
	@echo -e "  $(GREEN)Technology Stack:$(NC)"
	@echo -e "    • Docusaurus 3.5.2"
	@echo -e "    • Node.js 22 (Debian Trixie Slim)"
	@echo -e "    • Nginx 1.29 (Debian Trixie Perl)"
	@echo -e "    • Kroki 0.25.0 (Diagram Service)"
	@echo -e "    • Podman + Compose Spec 2025"
	@echo -e "    • Traefik (Global Reverse Proxy)"
	@echo -e ""
	@echo -e "$(BLUE)═══════════════════════════════════════════════════════$(NC)"

quickstart: ## Quick start guide
	@echo -e "$(BLUE)Quick Start Guide:$(NC)"
	@echo -e ""
	@echo -e "$(GREEN)1. Local Development:$(NC)"
	@echo -e "   make install          # Install dependencies"
	@echo -e "   make start-kroki      # Start Kroki service"
	@echo -e "   make dev              # Start dev server"
	@echo -e ""
	@echo -e "$(GREEN)2. Production Deployment:$(NC)"
	@echo -e "   make deploy           # Build and deploy"
	@echo -e "   make health           # Check health"
	@echo -e "   make logs             # View logs"
	@echo -e ""
	@echo -e "$(GREEN)3. Testing:$(NC)"
	@echo -e "   make test             # Run all tests"
	@echo -e "   make test-kroki       # Test Kroki"
	@echo -e ""
	@echo -e "$(GREEN)4. Maintenance:$(NC)"
	@echo -e "   make update           # Pull and redeploy"
	@echo -e "   make clean            # Clean everything"
	@echo -e ""
	@echo -e "$(BLUE)For full help: make help$(NC)"

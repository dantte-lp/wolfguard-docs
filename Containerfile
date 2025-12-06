# syntax=docker/dockerfile:1.12
# ═══════════════════════════════════════════════════════════════════
# Multi-stage Build for OpenConnect Protocol Documentation
# Compose Specification 2025 compliant
# ═══════════════════════════════════════════════════════════════════

# Build arguments для OCI labels
ARG BUILD_DATE
ARG VERSION=1.0.0
ARG VCS_REF
ARG VCS_URL=https://github.com/dantte-lp/wolfguard-docs

# ═══════════════════════════════════════════════════════════════════
# Stage 1: Build Docusaurus Static Site
# ═══════════════════════════════════════════════════════════════════
FROM docker.io/library/node:lts-trixie AS builder

# Set working directory
WORKDIR /app

# Install build dependencies for native modules (sharp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies and rebuild native modules (sharp)
RUN pnpm install --frozen-lockfile || pnpm install
RUN cd node_modules/.pnpm/sharp@*/node_modules/sharp && npm run install 2>/dev/null || pnpm rebuild sharp

# Copy source files
COPY . .

# Build static site
RUN pnpm run build

# ═══════════════════════════════════════════════════════════════════
# Stage 2: Production Nginx Server (minimal image)
# ═══════════════════════════════════════════════════════════════════
FROM docker.io/library/nginx:stable-perl

# Install curl for healthcheck (more universal than wget in Debian)
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built site from builder stage (includes Docusaurus-generated index.html)
COPY --from=builder /app/build /usr/share/nginx/html

# Remove default nginx config and copy custom configuration
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp

# Set proper permissions for nginx user
RUN chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /usr/share/nginx/html

# OCI Standard Labels
LABEL org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.authors="WolfGuard Team" \
      org.opencontainers.image.url="https://docs.wolfguard.io" \
      org.opencontainers.image.documentation="https://docs.wolfguard.io/docs" \
      org.opencontainers.image.source="${VCS_URL}" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="WolfGuard" \
      org.opencontainers.image.title="WolfGuard Documentation" \
      org.opencontainers.image.description="WolfGuard VPN Server Documentation (Docusaurus 3 + Nginx)" \
      org.opencontainers.image.base.name="docker.io/library/nginx:stable-perl"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Expose port 8080 (non-privileged, rootless-friendly)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

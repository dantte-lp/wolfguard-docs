# ═══════════════════════════════════════════════════════════════════
# Multi-stage Build for OpenConnect Protocol Documentation
# ═══════════════════════════════════════════════════════════════════

# Build arguments для OCI labels
ARG BUILD_DATE
ARG VERSION=1.0.0
ARG VCS_REF
ARG VCS_URL=https://github.com/dantte-lp/cisco-secure-client-docs

# ═══════════════════════════════════════════════════════════════════
# Stage 1: Build Docusaurus Static Site
# ═══════════════════════════════════════════════════════════════════
FROM docker.io/library/node:22-trixie-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
# Note: Using npm install (not npm ci) since package-lock.json is not committed
# - --prefer-offline: Use cache when possible
# - --no-audit: Skip audit for faster builds
# - --production: Production dependencies only
RUN npm install --production --prefer-offline --no-audit \
    && npm cache clean --force

# Copy source files
COPY . .

# Build static site
RUN npm run build

# ═══════════════════════════════════════════════════════════════════
# Stage 2: Production Nginx Server
# ═══════════════════════════════════════════════════════════════════
FROM docker.io/nginx:1.29-trixie-perl

# Install curl for healthcheck (more universal than wget in Debian)
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built site from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy root redirect index.html (client-side redirect to /docs/)
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html

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
      org.opencontainers.image.authors="Your Organization" \
      org.opencontainers.image.url="https://ocproto.infra4.dev" \
      org.opencontainers.image.documentation="https://ocproto.infra4.dev/docs" \
      org.opencontainers.image.source="${VCS_URL}" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="OpenConnect Protocol Documentation" \
      org.opencontainers.image.title="OpenConnect Protocol Documentation" \
      org.opencontainers.image.description="Cisco Secure Client 5.x+ Reverse Engineering Documentation (Docusaurus 3 + Nginx 1.29)" \
      org.opencontainers.image.base.name="docker.io/nginx:1.29-trixie-perl"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Expose port 8080 (non-privileged, rootless-friendly)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

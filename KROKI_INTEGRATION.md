# Kroki Integration Guide

## Overview

This documentation site now includes **Kroki** - a universal diagram service that converts text-based diagram descriptions into SVG images. Kroki runs as a separate container and is accessible both internally (for Docusaurus build) and locally (for development and Claude Code).

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ compose.yaml                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │   app (nginx)    │◄────►│   kroki          │        │
│  │  ocproto.        │      │   :8000          │        │
│  │  infra4.dev      │      │                  │        │
│  │  Port: 8080      │      │  PlantUML        │        │
│  └────────┬─────────┘      │  Mermaid         │        │
│           │                │  GraphViz        │        │
│           │                │  Ditaa           │        │
│  ┌────────┴─────────┐      │  BPMN            │        │
│  │  traefik-public  │      │  Excalidraw      │        │
│  │  (external)      │      │  + 15 more       │        │
│  └──────────────────┘      └────────┬─────────┘        │
│                                     │                   │
│                          Localhost: │                   │
│                          127.0.0.1:8000                │
└─────────────────────────────────────┼───────────────────┘
                                      │
                             ┌────────┴──────────┐
                             │  Claude Code      │
                             │  Local Dev        │
                             │  Testing          │
                             └───────────────────┘
```

## Deployment Configuration

### Compose Services

**app (Nginx + Docusaurus)**:
- Image: `localhost/ocproto-docs:latest` (multi-stage build)
- Networks: `traefik-public` + `internal`
- Access: https://docs.wolfguard.io (public)
- Dependencies: Waits for Kroki to be healthy

**kroki**:
- Image: `docker.io/yuzutech/kroki:0.25.0`
- Network: `internal`
- Ports: `127.0.0.1:8000:8000` (localhost only)
- Access: http://localhost:8000 (local) + http://kroki:8000 (internal)

### Resource Limits

- **app**: 128MB RAM, 25% CPU
- **kroki**: 512MB RAM, 50% CPU (diagram generation is CPU-intensive)

### Security Hardening

Both containers:
- `no-new-privileges:true`
- `cap_drop: ALL`
- Minimal added capabilities (SETUID, SETGID for nginx)
- Log rotation (10MB × 3 files = 30MB max)

## Usage

### 1. In Documentation (Markdown)

Create diagrams using fenced code blocks:

#### PlantUML
\`\`\`plantuml
@startuml
Alice -> Bob: Hello
Bob --> Alice: Hi there!
@enduml
\`\`\`

#### Mermaid
\`\`\`mermaid
graph TD
    A[Client] --> B[Server]
    B --> C{Database}
\`\`\`

#### GraphViz
\`\`\`dot
digraph G {
    A -> B;
    B -> C;
}
\`\`\`

### 2. Local Development

```bash
# Start Kroki for local development
make start-kroki

# Verify Kroki is healthy
make health-kroki

# Start Docusaurus dev server
make dev

# Test Kroki diagram generation
make test-kroki
```

### 3. With Claude Code

Claude Code can use Kroki to generate diagrams:

```bash
# Generate PlantUML diagram
curl -X POST http://localhost:8000/plantuml/svg \
  -H "Content-Type: text/plain" \
  -d '@startuml
Alice -> Bob: Hello
@enduml'

# Generate Mermaid diagram
curl -X POST http://localhost:8000/mermaid/svg \
  -H "Content-Type: text/plain" \
  -d 'graph TD
A-->B'
```

## Supported Diagram Types

Kroki supports 20+ diagram types:

- **PlantUML** - UML, sequence, component diagrams
- **Mermaid** - Flowcharts, sequence, Gantt charts
- **GraphViz** (dot) - Graph visualizations
- **Ditaa** - ASCII art diagrams
- **BlockDiag** - Block, sequence, network diagrams
- **C4-PlantUML** - Architecture diagrams
- **BPMN** - Business process modeling
- **Excalidraw** - Hand-drawn style
- **WaveDrom** - Digital timing diagrams
- **ERD** - Entity relationship diagrams
- And more...

Full list: https://kroki.io/#support

## Configuration

### Docusaurus Integration

Kroki is configured in `docusaurus.config.js`:

```javascript
remarkPlugins: [
  [
    require('remark-kroki').remarkKroki,
    {
      server: process.env.KROKI_SERVER_URL || 'http://kroki:8000',
      output: 'inline-svg',
      types: ['plantuml', 'mermaid', 'graphviz', ...],
    },
  ],
],
```

### Environment Variables

- `KROKI_SERVER_URL` - Override Kroki server URL (default: `http://kroki:8000`)

## Make Commands

```bash
# Start all services
make start

# Start only Kroki (for local dev)
make start-kroki

# Stop services
make stop

# Health checks
make health
make health-kroki

# Test Kroki diagram generation
make test-kroki

# View logs
make logs
make logs-kroki

# Full deployment
make deploy
```

## Troubleshooting

### Kroki Not Responding

```bash
# Check Kroki status
podman ps | grep kroki

# View logs
make logs-kroki

# Test health endpoint
curl http://localhost:8000/health
```

### Diagram Not Rendering

1. Ensure Kroki is healthy: `make health-kroki`
2. Check diagram syntax at https://kroki.io/
3. View build logs: `npm run build`

### Port Already in Use

If port 8000 is already in use:

```bash
# Find process using port 8000
ss -tulpn | grep 8000

# Kill process or change port in compose.yaml
```

## Performance Notes

- Diagrams are rendered during **build time** (not in browser)
- Rendered as **inline SVG** (embedded in HTML)
- No external dependencies in production
- Fast page load times
- Kroki startup takes ~30 seconds (Java application)

## Security

- Kroki runs with minimal capabilities
- Port 8000 bound to localhost only (not exposed publicly)
- Internal docker network isolates Kroki from internet
- Safe mode enabled: `KROKI_SAFE_MODE=secure`
- Max URI length limited: `KROKI_MAX_URI_LENGTH=8000`

## Resources

- **Kroki Documentation**: https://kroki.io/
- **PlantUML Guide**: https://plantuml.com/
- **Mermaid Docs**: https://mermaid.js.org/
- **Diagram Examples**: [/docs/guides/diagrams.md](/docs/guides/diagrams.md)

## Next Steps

1. Explore diagram examples: `/docs/guides/diagrams.md`
2. Add diagrams to existing documentation
3. Use Kroki with Claude Code for automated diagram generation
4. Refer to https://kroki.io/ for advanced features

---

**Integration Status**: ✅ Complete
**Services**: app + kroki
**Access**: https://docs.wolfguard.io (public), http://localhost:8000 (local)
**Version**: Kroki 0.25.0, Docusaurus 3.5.2

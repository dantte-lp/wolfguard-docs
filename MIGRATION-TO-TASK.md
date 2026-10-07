# Migration Guide: Make → Task

Quick reference for migrating from Make to Task for WolfGuard Documentation.

## Installation

```bash
# Install Task
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b /usr/local/bin

# Verify installation
task --version
```

## Quick Command Reference

### Show Available Commands

```bash
# Make
make help

# Task
task
# or
task --list
```

### Development Workflow

```bash
# Install dependencies
make install  →  task install

# Start development server
make dev  →  task dev

# Start Kroki + Dev server (new!)
task dev-full

# Start only Kroki
make start-kroki  →  task start-kroki
```

### Build & Deploy

```bash
# Build container
make build  →  task build

# Deploy to production
make deploy  →  task deploy

# Start containers
make start  →  task start

# Stop containers
make stop  →  task stop

# Restart containers
make restart  →  task restart
```

### Testing

```bash
# Run all tests
make test  →  task test

# Test Kroki
make test-kroki  →  task test-kroki

# Check health
make health  →  task health
```

### Logs & Debugging

```bash
# View all logs
make logs  →  task logs

# View app logs
make logs-app  →  task logs-app

# View Kroki logs
make logs-kroki  →  task logs-kroki

# Open shell in container
make shell  →  task shell
```

### Maintenance

```bash
# Clean everything
make clean  →  task clean

# Update and redeploy
make update  →  task update

# Inspect container
make inspect  →  task inspect
```

### Information

```bash
# Project info
make info  →  task info

# Quick start guide
make quickstart  →  task quickstart
```

## Key Differences

### 1. Help System

**Make:**
```bash
make help
# Shows list of targets with descriptions
```

**Task:**
```bash
task
# Shows list of tasks with descriptions (colored, formatted)

task --list-all
# Shows all tasks including internal ones
```

### 2. Task Descriptions

**Make:**
- Inline comments with `##`
- Basic formatting

**Task:**
- Built-in `desc` field
- Optional `summary` field for detailed help
- Better formatting

### 3. Variables

**Make:**
```makefile
VERSION ?= 1.0.0
BUILD_DATE := $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
```

**Task:**
```yaml
vars:
  VERSION:
    sh: echo "${VERSION:-1.0.0}"
  BUILD_DATE:
    sh: date -u +"%Y-%m-%dT%H:%M:%SZ"
```

### 4. Task Dependencies

**Make:**
```makefile
deploy: build start
    @echo "Deployed"
```

**Task:**
```yaml
deploy:
  deps:
    - build
    - start
  cmds:
    - echo "Deployed"
```

### 5. Error Handling

**Make:**
- Manual error handling with `||` and `&&`
- Need to set `.SILENT` for quiet output

**Task:**
- Automatic `errexit` and `pipefail` (configurable)
- Built-in `silent` mode per task

## Advantages of Task

1. **Better UX**
   - Colored output
   - Clear formatting
   - Descriptive help system

2. **Modern Syntax**
   - YAML instead of Makefile
   - More readable
   - Better structure

3. **Cross-Platform**
   - Works on Linux, macOS, Windows
   - No platform-specific quirks

4. **Built-in Features**
   - Task dependencies
   - Preconditions
   - Dynamic variables
   - Status checks

5. **Better Documentation**
   - `desc` for short description
   - `summary` for detailed help
   - Automatically formatted

## Backward Compatibility

**Both Make and Task are available:**

```bash
# Still works
make deploy

# New way
task deploy
```

**The Makefile is kept for:**
- Backward compatibility
- CI/CD pipelines using Make
- Team members not yet using Task
- Gradual migration

## Migration Timeline

### Week 1-2: Learn
```bash
# Explore Task
task --list
task info
task quickstart

# Try basic commands
task install
task dev
```

### Week 3-4: Adopt
```bash
# Use Task for daily work
task dev
task deploy
task logs
```

### Week 5+: Standardize
- Update personal scripts to use Task
- Update team documentation
- Share benefits with team

## Common Questions

### Q: Can I use both Make and Task?
**A:** Yes! Both work simultaneously. Use whichever you prefer.

### Q: Will Make be removed?
**A:** Not immediately. The Makefile remains for compatibility.

### Q: Do I need to learn Task?
**A:** No requirement, but recommended for better DX.

### Q: What if Task breaks?
**A:** Makefile is always available as fallback.

## Getting Help

```bash
# List all tasks
task --list

# Show project info
task info

# Show quick start guide
task quickstart

# Read full documentation
cat DEVOPS.md
```

## Resources

- **Task Documentation**: https://taskfile.dev
- **Task Installation**: https://taskfile.dev/installation/
- **Task Usage**: https://taskfile.dev/usage/
- **This Project's Taskfile**: `Taskfile.yml`

---

**Ready to switch?**

```bash
task
```

That's it! Task will show you everything you can do.

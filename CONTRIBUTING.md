# Contributing to OpenConnect Protocol Documentation

Thank you for your interest in contributing!

## How to Contribute

### 1. Documentation Improvements

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/cisco-secure-client-docs.git

# Create branch
git checkout -b docs/improve-section

# Make changes
vim docs/path/to/file.md

# Test locally
npm start

# Commit and push
git commit -m "docs: improve XYZ section"
git push origin docs/improve-section
```

### 2. Protocol Analysis

If you've reverse engineered additional protocol details:

1. Document your methodology
2. Provide evidence (network traces, decompiled code)
3. Follow our analysis format
4. Submit PR with clear explanations

### 3. Bug Reports

Use GitHub Issues with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## Style Guide

### Markdown

- Use ATX headers (`#`, `##`, `###`)
- Code blocks with language tags
- Maximum line length: 120 characters
- One sentence per line (for git diffs)

### Code Examples

```bash
# Good: Include comments
make build  # Build the container image

# Bad: No context
make build
```

### Diagrams

Use Kroki-supported formats:
- PlantUML for UML diagrams
- Mermaid for flowcharts
- GraphViz for graphs

## Commit Messages

Follow Conventional Commits:

```
feat: add DTLS 1.3 analysis
fix: correct cipher suite list
docs: update deployment guide
refactor: reorganize protocol section
```

## Pull Request Process

1. Update documentation if needed
2. Test locally (`npm start`)
3. Ensure build passes (`npm run build`)
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

## Legal & Ethical Guidelines

### Reverse Engineering

- Only analyze legally obtained software
- Document for interoperability purposes
- Do NOT distribute proprietary binaries
- Follow responsible disclosure for vulnerabilities

### Copyright

- Ensure you have rights to content
- Attribute sources properly
- Use CC-BY-SA-4.0 compatible materials
- Don't copy proprietary documentation

## Questions?

- Open a Discussion on GitHub
- Email: contribute@ocproto.infra4.dev

Thank you for contributing!

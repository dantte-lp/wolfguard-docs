# Batch Binary Analysis Workflow

**Version**: 1.0
**Date**: 2025-10-30
**Target**: Analyze 197 Cisco Secure Client binaries efficiently
**Time Estimate**: 1 week (with 8-core workstation and parallel processing)

---

## Overview

This document describes the automated batch analysis workflow for processing multiple Cisco Secure Client binaries simultaneously. The workflow is optimized for efficiency, using parallel processing and automated aggregation.

**Goals**:
- Analyze all 197 binaries in minimum time
- Extract key functions, strings, and structures
- Generate unified report for manual deep-dive analysis
- Enable version comparison and trend detection

---

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│              197 Cisco Secure Client Binaries             │
│   (Linux ELF, Windows PE, macOS Mach-O)                   │
└───────────────────┬───────────────────────────────────────┘
                    │
        ┌───────────┴──────────┐
        │ Stage 1: Parallel    │  GNU Parallel (8 workers)
        │ Reconnaissance       │  strings, nm, readelf
        └───────────┬──────────┘  ⏱ 2 hours
                    │
        ┌───────────┴──────────┐
        │ Stage 2: Parallel    │  Reko (8 workers)
        │ Struct Recovery      │  Automated struct extraction
        └───────────┬──────────┘  ⏱ 12 hours
                    │
        ┌───────────┴──────────┐
        │ Stage 3: Selective   │  IDA Pro / Ghidra headless
        │ Deep Analysis        │  20 critical binaries only
        └───────────┬──────────┘  ⏱ 60 hours (3 days)
                    │
        ┌───────────┴──────────┐
        │ Stage 4: Aggregation │  Python scripts
        │ & Reporting          │  JSON → Markdown/HTML reports
        └───────────┬──────────┘  ⏱ 4 hours
                    │
┌───────────────────┴────────────────────────────┐
│          Unified Analysis Database             │
│   - 197 binaries cataloged                     │
│   - 3,369+ functions identified                │
│   - Interesting strings extracted              │
│   - Cross-binary patterns detected             │
└────────────────────────────────────────────────┘
```

**Total Time**: ~78 hours sequential → **~1 week with 8 cores**

---

## Stage 1: Parallel Reconnaissance

### 1.1 Purpose

Quick extraction of basic information from all binaries without deep analysis.

**Outputs**:
- File type and architecture
- Symbol tables (functions, variables)
- String tables (search keywords)
- Dependencies (shared libraries)

### 1.2 Script: `stage1_recon.sh`

**Location**: `/opt/analysis/scripts/batch/stage1_recon.sh`

```bash
#!/bin/bash
# stage1_recon.sh - Parallel reconnaissance of all binaries

set -euo pipefail

BINARY_DIR="${1:-/opt/analysis/cisco-binaries}"
OUTPUT_DIR="${2:-/opt/analysis/output/stage1_recon}"
WORKERS="${3:-8}"

mkdir -p "$OUTPUT_DIR"

# Function to analyze single binary
analyze_binary() {
    local binary="$1"
    local output_dir="$2"
    local base=$(basename "$binary")

    echo "[*] Analyzing: $base"

    # Create output subdirectory
    mkdir -p "$output_dir/$base"

    # File type
    file "$binary" > "$output_dir/$base/file_type.txt" 2>&1 || true

    # Strings (min 8 chars)
    strings -a -n 8 "$binary" > "$output_dir/$base/strings.txt" 2>&1 || true

    # Search for keywords
    grep -iE "otp|totp|auth|token|secret|verify|cstp|dtls|x-cstp|x-dtls|vpn|tls|hmac|aes|sha" \
        "$output_dir/$base/strings.txt" \
        > "$output_dir/$base/keywords.txt" 2>&1 || true

    # Symbols (dynamic)
    nm -D "$binary" 2>/dev/null > "$output_dir/$base/nm_dynamic.txt" || true

    # Symbols (all, if not stripped)
    nm -C "$binary" 2>/dev/null > "$output_dir/$base/nm_all.txt" || true

    # Dependencies
    if file "$binary" | grep -q "ELF"; then
        ldd "$binary" 2>/dev/null > "$output_dir/$base/dependencies.txt" || true
        readelf -h "$binary" > "$output_dir/$base/elf_header.txt" 2>&1 || true
        readelf -S "$binary" > "$output_dir/$base/elf_sections.txt" 2>&1 || true
    elif file "$binary" | grep -q "PE32"; then
        objdump -x "$binary" > "$output_dir/$base/pe_info.txt" 2>&1 || true
    fi

    echo "[✓] Completed: $base"
}

export -f analyze_binary

# Find all binaries and process in parallel
find "$BINARY_DIR" -type f \( -executable -o -name "*.exe" -o -name "*.dll" -o -name "*.dylib" \) \
    -print0 | \
    parallel -0 -j "$WORKERS" --timeout 300 \
    analyze_binary {} "$OUTPUT_DIR"

echo "[*] Stage 1 complete: $OUTPUT_DIR"
echo "[*] Run: ./stage2_struct_recovery.sh"
```

**Run**:
```bash
cd /opt/analysis/scripts/batch
./stage1_recon.sh /opt/analysis/cisco-binaries /opt/analysis/output/stage1_recon 8
```

**Time**: ~2 hours with 8 workers

---

## Stage 2: Parallel Struct Recovery

### 2.1 Purpose

Extract data structure definitions using Reko's fast type inference.

**Outputs**:
- Struct definitions (.h files)
- Function signatures
- Type hints for later analysis

### 2.2 Script: `stage2_struct_recovery.sh`

**Location**: `/opt/analysis/scripts/batch/stage2_struct_recovery.sh`

```bash
#!/bin/bash
# stage2_struct_recovery.sh - Parallel struct recovery with Reko

set -euo pipefail

BINARY_DIR="${1:-/opt/analysis/cisco-binaries}"
OUTPUT_DIR="${2:-/opt/analysis/output/stage2_struct}"
WORKERS="${3:-8}"
REKO_PATH="${4:-/opt/tools/reko/Reko.exe}"

mkdir -p "$OUTPUT_DIR"

# Function to run Reko on single binary
analyze_with_reko() {
    local binary="$1"
    local output_dir="$2"
    local reko_path="$3"
    local base=$(basename "$binary")

    echo "[*] Reko analyzing: $base"

    # Create output subdirectory
    mkdir -p "$output_dir/$base"

    # Run Reko decompilation
    timeout 1800 mono "$reko_path" \
        --arch=x86-64 \
        --loader=elf \
        --output="$output_dir/$base" \
        "$binary" > "$output_dir/$base/reko.log" 2>&1 || {
            echo "[!] Reko failed or timed out: $base"
            return 1
        }

    # Extract struct definitions if generated
    if [ -f "$output_dir/$base/types.h" ]; then
        echo "[✓] Structs extracted: $base"
    else
        echo "[⚠] No structs found: $base"
    fi
}

export -f analyze_with_reko

# Find all ELF binaries and process in parallel
find "$BINARY_DIR" -type f -executable \
    -exec file {} \; | \
    grep "ELF 64-bit" | \
    cut -d: -f1 | \
    parallel -j "$WORKERS" --timeout 1800 \
    analyze_with_reko {} "$OUTPUT_DIR" "$REKO_PATH"

echo "[*] Stage 2 complete: $OUTPUT_DIR"
echo "[*] Run: ./stage3_deep_analysis.sh"
```

**Run**:
```bash
./stage2_struct_recovery.sh /opt/analysis/cisco-binaries /opt/analysis/output/stage2_struct 8
```

**Time**: ~12 hours with 8 workers

---

## Stage 3: Selective Deep Analysis

### 3.1 Purpose

Perform deep decompilation on **critical binaries only** (not all 197).

**Selection Criteria**:
- Binaries with authentication keywords (otp, totp, auth)
- Binaries with network protocol keywords (cstp, dtls)
- Main executables (vpnagentd, vpnagent.exe)
- Core libraries (libvpnapi.so, vpnapi.dll)

**Expected**: ~20 binaries (10% of total)

### 3.2 Script: `stage3_deep_analysis.sh`

**Location**: `/opt/analysis/scripts/batch/stage3_deep_analysis.sh`

```bash
#!/bin/bash
# stage3_deep_analysis.sh - Deep analysis of critical binaries

set -euo pipefail

BINARY_DIR="${1:-/opt/analysis/cisco-binaries}"
OUTPUT_DIR="${2:-/opt/analysis/output/stage3_deep}"
WORKERS="${3:-4}"  # Fewer workers (CPU-intensive)
IDA_PATH="${4:-/opt/ida-9.2/idat64}"
IDA_SCRIPT="${5:-/opt/analysis/scripts/ida_batch_export.py}"

mkdir -p "$OUTPUT_DIR"

# Identify critical binaries (from Stage 1 keyword analysis)
identify_critical_binaries() {
    local stage1_output="$1"

    # Find binaries with interesting keywords
    find "$stage1_output" -name "keywords.txt" -type f | while read -r keyfile; do
        if [ -s "$keyfile" ]; then
            # Extract binary name from path
            binary_name=$(dirname "$keyfile" | xargs basename)
            echo "$binary_name"
        fi
    done | sort -u
}

# Analyze with IDA Pro
analyze_with_ida() {
    local binary="$1"
    local output_dir="$2"
    local ida_path="$3"
    local ida_script="$4"
    local base=$(basename "$binary")

    echo "[*] IDA Pro analyzing: $base"

    mkdir -p "$output_dir/$base"

    # Run IDA headless
    timeout 3600 "$ida_path" \
        -A \
        -S"$ida_script" \
        -L"$output_dir/$base/ida.log" \
        "$binary" > /dev/null 2>&1 || {
            echo "[!] IDA analysis failed: $base"
            return 1
        }

    # Move generated JSON
    if [ -f "$binary.json" ]; then
        mv "$binary.json" "$output_dir/$base/functions.json"
        echo "[✓] IDA analysis complete: $base"
    else
        echo "[⚠] No output from IDA: $base"
    fi
}

export -f analyze_with_ida

# Identify critical binaries
CRITICAL_LIST=$(identify_critical_binaries "/opt/analysis/output/stage1_recon")

echo "[*] Identified $(echo "$CRITICAL_LIST" | wc -l) critical binaries"

# Analyze each critical binary
echo "$CRITICAL_LIST" | while read -r binary_name; do
    binary_path=$(find "$BINARY_DIR" -name "$binary_name" -type f | head -1)

    if [ -n "$binary_path" ]; then
        analyze_with_ida "$binary_path" "$OUTPUT_DIR" "$IDA_PATH" "$IDA_SCRIPT"
    fi
done

echo "[*] Stage 3 complete: $OUTPUT_DIR"
echo "[*] Run: ./stage4_aggregate.py"
```

**Run**:
```bash
./stage3_deep_analysis.sh /opt/analysis/cisco-binaries /opt/analysis/output/stage3_deep 4
```

**Time**: ~60 hours (3 days) with 4 workers for 20 binaries

---

## Stage 4: Aggregation & Reporting

### 4.1 Purpose

Combine all analysis results into unified database and generate reports.

**Outputs**:
- `aggregated_results.json` - All binaries summary
- `interesting_functions.json` - Auth/crypto functions only
- `analysis_report.md` - Markdown report
- `analysis_report.html` - HTML report (optional)

### 4.2 Script: `stage4_aggregate.py`

**Location**: `/opt/analysis/scripts/batch/stage4_aggregate.py`

```python
#!/usr/bin/env python3
# stage4_aggregate.py - Aggregate all analysis results

import json
import glob
import sys
from pathlib import Path
from collections import defaultdict

def aggregate_stage1(stage1_dir):
    """Aggregate reconnaissance data"""
    results = []

    for binary_dir in Path(stage1_dir).iterdir():
        if not binary_dir.is_dir():
            continue

        binary_name = binary_dir.name

        # Read file type
        file_type = ""
        if (binary_dir / "file_type.txt").exists():
            file_type = (binary_dir / "file_type.txt").read_text().strip()

        # Count strings
        string_count = 0
        if (binary_dir / "strings.txt").exists():
            string_count = len((binary_dir / "strings.txt").read_text().splitlines())

        # Count keywords
        keyword_count = 0
        keywords = []
        if (binary_dir / "keywords.txt").exists():
            keyword_lines = (binary_dir / "keywords.txt").read_text().splitlines()
            keyword_count = len(keyword_lines)
            keywords = keyword_lines[:20]  # Top 20

        # Count symbols
        symbol_count = 0
        if (binary_dir / "nm_all.txt").exists():
            symbol_count = len((binary_dir / "nm_all.txt").read_text().splitlines())

        results.append({
            'binary': binary_name,
            'file_type': file_type,
            'string_count': string_count,
            'keyword_count': keyword_count,
            'keywords_sample': keywords,
            'symbol_count': symbol_count,
        })

    return results

def aggregate_stage3(stage3_dir):
    """Aggregate deep analysis data"""
    results = []

    for binary_dir in Path(stage3_dir).iterdir():
        if not binary_dir.is_dir():
            continue

        functions_file = binary_dir / "functions.json"
        if not functions_file.exists():
            continue

        try:
            with open(functions_file, 'r') as f:
                data = json.load(f)

            results.append({
                'binary': binary_dir.name,
                'functions': data.get('functions', []),
                'function_count': len(data.get('functions', [])),
            })
        except Exception as e:
            print(f"[!] Error processing {functions_file}: {e}", file=sys.stderr)

    return results

def identify_interesting_functions(stage3_data):
    """Extract functions related to auth/crypto/VPN"""
    keywords = ['otp', 'totp', 'auth', 'login', 'token', 'verify',
                'cstp', 'dtls', 'vpn', 'tls', 'hmac', 'aes', 'sha',
                'crypt', 'cipher', 'key']

    interesting = []

    for binary_data in stage3_data:
        binary_name = binary_data['binary']

        for func in binary_data['functions']:
            func_name = func.get('name', '').lower()

            if any(kw in func_name for kw in keywords):
                interesting.append({
                    'binary': binary_name,
                    'name': func['name'],
                    'address': func['address'],
                    'size': func.get('size', 0),
                })

    return interesting

def generate_markdown_report(aggregated_data, output_file):
    """Generate Markdown report"""

    stage1_data = aggregated_data['stage1']
    stage3_data = aggregated_data['stage3']
    interesting_funcs = aggregated_data['interesting_functions']

    with open(output_file, 'w') as f:
        f.write("# Cisco Secure Client Batch Analysis Report\n\n")
        f.write(f"**Date**: {aggregated_data['date']}\n")
        f.write(f"**Total Binaries Analyzed**: {len(stage1_data)}\n")
        f.write(f"**Deep Analysis Binaries**: {len(stage3_data)}\n")
        f.write(f"**Interesting Functions**: {len(interesting_funcs)}\n\n")

        f.write("---\n\n")

        f.write("## Summary Statistics\n\n")
        f.write("| Metric | Value |\n")
        f.write("|--------|-------|\n")
        f.write(f"| Total binaries | {len(stage1_data)} |\n")

        total_strings = sum(b['string_count'] for b in stage1_data)
        f.write(f"| Total strings | {total_strings} |\n")

        total_keywords = sum(b['keyword_count'] for b in stage1_data)
        f.write(f"| Interesting strings | {total_keywords} |\n")

        total_functions = sum(b['function_count'] for b in stage3_data)
        f.write(f"| Functions (deep analysis) | {total_functions} |\n")

        f.write(f"| Auth/crypto functions | {len(interesting_funcs)} |\n\n")

        f.write("---\n\n")

        f.write("## Top 20 Binaries by Keyword Count\n\n")
        sorted_binaries = sorted(stage1_data, key=lambda x: x['keyword_count'], reverse=True)[:20]

        f.write("| Binary | File Type | Keywords | Strings | Symbols |\n")
        f.write("|--------|-----------|----------|---------|----------|\n")

        for binary in sorted_binaries:
            file_type_short = binary['file_type'].split(',')[0] if binary['file_type'] else 'Unknown'
            f.write(f"| `{binary['binary']}` | {file_type_short} | {binary['keyword_count']} | {binary['string_count']} | {binary['symbol_count']} |\n")

        f.write("\n---\n\n")

        f.write("## Interesting Functions (Top 50)\n\n")
        f.write("| Binary | Function | Address | Size |\n")
        f.write("|--------|----------|---------|------|\n")

        for func in interesting_funcs[:50]:
            f.write(f"| `{func['binary']}` | `{func['name']}` | `{func['address']}` | {func['size']} |\n")

        f.write("\n---\n\n")
        f.write("**Analysis Pipeline**: See [Batch Analysis Workflow](../workflows/batch-analysis.md)\n")

    print(f"[✓] Markdown report generated: {output_file}")

def main():
    import datetime

    stage1_dir = sys.argv[1] if len(sys.argv) > 1 else '/opt/analysis/output/stage1_recon'
    stage3_dir = sys.argv[2] if len(sys.argv) > 2 else '/opt/analysis/output/stage3_deep'
    output_dir = sys.argv[3] if len(sys.argv) > 3 else '/opt/analysis/output/stage4_aggregate'

    Path(output_dir).mkdir(parents=True, exist_ok=True)

    print("[*] Aggregating Stage 1 (reconnaissance)...")
    stage1_data = aggregate_stage1(stage1_dir)
    print(f"    Found {len(stage1_data)} binaries")

    print("[*] Aggregating Stage 3 (deep analysis)...")
    stage3_data = aggregate_stage3(stage3_dir)
    print(f"    Found {len(stage3_data)} deep-analyzed binaries")

    print("[*] Identifying interesting functions...")
    interesting_funcs = identify_interesting_functions(stage3_data)
    print(f"    Found {len(interesting_funcs)} interesting functions")

    # Combine all data
    aggregated_data = {
        'date': datetime.datetime.now().isoformat(),
        'stage1': stage1_data,
        'stage3': stage3_data,
        'interesting_functions': interesting_funcs,
    }

    # Save JSON
    json_output = Path(output_dir) / 'aggregated_results.json'
    with open(json_output, 'w') as f:
        json.dump(aggregated_data, f, indent=2)
    print(f"[✓] JSON saved: {json_output}")

    # Generate Markdown report
    md_output = Path(output_dir) / 'analysis_report.md'
    generate_markdown_report(aggregated_data, md_output)

    print(f"\n[*] Aggregation complete!")
    print(f"    JSON: {json_output}")
    print(f"    Report: {md_output}")

if __name__ == '__main__':
    main()
```

**Run**:
```bash
python3 ./stage4_aggregate.py \
    /opt/analysis/output/stage1_recon \
    /opt/analysis/output/stage3_deep \
    /opt/analysis/output/stage4_aggregate
```

**Time**: ~4 hours

---

## Master Control Script

### `batch_analyze_all.sh`

**Location**: `/opt/analysis/scripts/batch/batch_analyze_all.sh`

```bash
#!/bin/bash
# batch_analyze_all.sh - Master control script for all stages

set -euo pipefail

BINARY_DIR="${1:-/opt/analysis/cisco-binaries}"
OUTPUT_BASE="${2:-/opt/analysis/output}"
WORKERS="${3:-8}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "  Cisco Secure Client Batch Analysis    "
echo "=========================================="
echo "Binary Directory: $BINARY_DIR"
echo "Output Directory: $OUTPUT_BASE"
echo "Workers: $WORKERS"
echo "=========================================="
echo

# Stage 1: Reconnaissance
echo "[Stage 1] Reconnaissance (ETA: 2 hours)"
"$SCRIPT_DIR/stage1_recon.sh" "$BINARY_DIR" "$OUTPUT_BASE/stage1_recon" "$WORKERS"
echo

# Stage 2: Struct Recovery
echo "[Stage 2] Struct Recovery (ETA: 12 hours)"
"$SCRIPT_DIR/stage2_struct_recovery.sh" "$BINARY_DIR" "$OUTPUT_BASE/stage2_struct" "$WORKERS"
echo

# Stage 3: Deep Analysis
echo "[Stage 3] Deep Analysis (ETA: 60 hours)"
"$SCRIPT_DIR/stage3_deep_analysis.sh" "$BINARY_DIR" "$OUTPUT_BASE/stage3_deep" 4
echo

# Stage 4: Aggregation
echo "[Stage 4] Aggregation (ETA: 4 hours)"
python3 "$SCRIPT_DIR/stage4_aggregate.py" \
    "$OUTPUT_BASE/stage1_recon" \
    "$OUTPUT_BASE/stage3_deep" \
    "$OUTPUT_BASE/stage4_aggregate"
echo

echo "=========================================="
echo "  Analysis Complete!                     "
echo "=========================================="
echo "Report: $OUTPUT_BASE/stage4_aggregate/analysis_report.md"
echo "JSON: $OUTPUT_BASE/stage4_aggregate/aggregated_results.json"
```

**Run**:
```bash
cd /opt/analysis/scripts/batch
./batch_analyze_all.sh /opt/analysis/cisco-binaries /opt/analysis/output 8
```

---

## Performance Optimization

### 1. Parallel Processing

**GNU Parallel** is critical for performance:
```bash
# Install
sudo dnf install -y parallel

# Configure for maximum efficiency
echo "will cite" | parallel --citation
```

**Optimization**: Use `--timeout` to prevent stuck jobs

---

### 2. Resource Management

**CPU Cores**:
- Stage 1 (I/O-bound): 8 workers (high parallelism)
- Stage 2 (Memory-bound): 8 workers (Reko is fast)
- Stage 3 (CPU-bound): 4 workers (IDA/Ghidra are heavy)

**Memory**:
- Each IDA Pro instance: ~2 GB RAM
- 4 workers × 2 GB = 8 GB minimum
- Recommended: 16 GB RAM

**Disk I/O**:
- Use SSD for `/opt/analysis/output/` (faster)
- NFS/network storage will slow down significantly

---

### 3. Checkpoint and Resume

**Problem**: Analysis takes days; failures happen

**Solution**: Track completed binaries

```bash
# stage3_deep_analysis.sh (enhanced)
CHECKPOINT_FILE="$OUTPUT_DIR/.checkpoint"

analyze_with_ida() {
    local binary="$1"
    local base=$(basename "$binary")

    # Check if already analyzed
    if grep -q "^$base$" "$CHECKPOINT_FILE" 2>/dev/null; then
        echo "[SKIP] Already analyzed: $base"
        return 0
    fi

    # ... existing analysis code ...

    # Mark as complete
    echo "$base" >> "$CHECKPOINT_FILE"
}
```

**Resume**:
```bash
# Re-run script, it will skip already-analyzed binaries
./stage3_deep_analysis.sh /opt/analysis/cisco-binaries /opt/analysis/output/stage3_deep 4
```

---

## CI/CD Integration

### GitHub Actions

**`.github/workflows/batch-analysis.yml`**:

```yaml
name: Batch Binary Analysis

on:
  push:
    paths:
      - 'binaries/**'
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday 2 AM

jobs:
  analyze:
    runs-on: self-hosted  # Requires beefy machine
    timeout-minutes: 10080  # 1 week max

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run batch analysis
        run: |
          cd /opt/analysis/scripts/batch
          ./batch_analyze_all.sh \
            /opt/analysis/cisco-binaries \
            /opt/analysis/output \
            8

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: analysis-results
          path: /opt/analysis/output/stage4_aggregate/

      - name: Generate commit
        run: |
          cp /opt/analysis/output/stage4_aggregate/analysis_report.md \
             docs/analysis/latest-analysis-report.md

          git config user.name "Analysis Bot"
          git config user.email "bot@wolfguard.dev"
          git add docs/analysis/latest-analysis-report.md
          git commit -m "docs: Update batch analysis report [skip ci]"
          git push
```

---

## Troubleshooting

### Issue: Parallel jobs hang

**Symptom**: Some workers never complete

**Solution**: Use `--timeout` parameter
```bash
parallel -j 8 --timeout 1800 ...  # 30-minute timeout per job
```

---

### Issue: Out of memory

**Symptom**: System freezes, OOM killer activates

**Solution**: Reduce worker count
```bash
./batch_analyze_all.sh /opt/binaries /opt/output 4  # Was 8
```

---

### Issue: Missing dependencies

**Symptom**: Reko or IDA fails to run

**Solution**: Check installations
```bash
# Reko
mono /opt/tools/reko/Reko.exe --version

# IDA Pro
/opt/ida-9.2/idat64 --version

# GNU Parallel
parallel --version
```

---

## Best Practices

1. **Start small**: Test on 10 binaries before running full 197
2. **Monitor resources**: Use `htop` to watch CPU/memory
3. **Check logs**: Review `*.log` files in output directories
4. **Backup results**: Copy `/opt/analysis/output/` to NAS after completion
5. **Version control**: Commit scripts and reports to Git

---

## References

- [Reverse Engineering Manifest](../reverse-engineering-manifest.md)
- [IDA Pro Setup Guide](../tools/ida-pro-setup.md)
- [Methodology Comparison](../methodology-comparison.md)

---

**Document Status**: Production Ready
**Maintained By**: WolfGuard RE Team
**Last Updated**: 2025-10-30

---

**END OF WORKFLOW**

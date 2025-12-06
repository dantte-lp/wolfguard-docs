# IDA Pro 9.2 Setup and Configuration Guide

**Version**: 1.0
**Date**: 2025-10-30
**IDA Version**: 9.2.250908
**Target Platform**: Linux x64 (Oracle Linux 9.5)
**License Type**: Commercial Team License

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Essential Plugins](#essential-plugins)
5. [Scripting Setup](#scripting-setup)
6. [Batch Processing](#batch-processing)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 1. Overview

### 1.1 What is IDA Pro?

IDA Pro (Interactive DisAssembler Professional) by Hex-Rays is the industry-leading binary analysis tool. For the WolfGuard project, IDA Pro 9.2 provides:

- **Best-in-class decompiler**: Converts machine code to readable C pseudocode
- **C++ support**: Essential for analyzing Cisco Secure Client (heavily C++)
- **Batch processing**: Headless analysis via `idat64` for 197+ binaries
- **Plugin ecosystem**: FindCrypt, BinDiff, custom automation scripts

### 1.2 Installation Location

**Available at**: `/opt/software/IDA_Pro_9.2.250908/`

**Installers**:
- Linux x64: `ida-pro_92_x64linux.run` (613 MB)
- Windows x64: `ida-pro_92_x64win.exe` (624 MB) - for Windows containers
- macOS x64: `ida-pro_92_x64mac.app.zip` (571 MB)
- macOS ARM: `ida-pro_92_armmac.app.zip` (565 MB)

---

## 2. Installation

### 2.1 Linux Installation

**Prerequisites**:
```bash
# Oracle Linux 9.5 / RHEL 9 dependencies
sudo dnf install -y \
    glibc.x86_64 \
    libstdc++.x86_64 \
    fontconfig \
    freetype \
    libXrender \
    libXext \
    libX11 \
    libSM \
    libICE \
    dbus-libs
```

**Installation Steps**:

1. **Extract Installer**:
```bash
cd /opt/software/IDA_Pro_9.2.250908/installers
chmod +x ida-pro_92_x64linux.run
```

2. **Verify Checksum**:
```bash
# Compare with provided checksum
md5sum ida-pro_92_x64linux.run
# Expected: 6da6d040dde2b0add918c62af1786307

# If matches checksums.txt:
cat /opt/software/IDA_Pro_9.2.250908/checksums.txt | grep x64linux
```

3. **Run Installer**:

**Interactive Mode**:
```bash
./ida-pro_92_x64linux.run
# Follow GUI prompts:
# - Installation Directory: /opt/ida-9.2
# - Create desktop shortcuts: Yes
# - Install for all users: Yes (requires sudo)
```

**Silent Mode** (recommended for automation):
```bash
sudo ./ida-pro_92_x64linux.run \
    --prefix=/opt/ida-9.2 \
    --mode unattended \
    --create-shortcuts yes
```

4. **Verify Installation**:
```bash
# Check executables
ls -lh /opt/ida-9.2/

# Expected files:
# ida64       - GUI 64-bit version
# idat64      - Terminal/headless 64-bit version
# idat        - Terminal 32-bit version (legacy)

# Test version
/opt/ida-9.2/idat64 --version
# Expected output: IDA Pro 9.2.250908
```

5. **Add to PATH** (optional):
```bash
echo 'export PATH="/opt/ida-9.2:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Test
which idat64
# Output: /opt/ida-9.2/idat64
```

---

### 2.2 License Activation

**Note**: IDA Pro requires a valid commercial license. Contact Hex-Rays (https://hex-rays.com/) for licensing.

**License Files**:
- Located in: `/opt/software/IDA_Pro_9.2.250908/keygens_patchers/`
- File: `idapro.hexlic`

**Activation Steps**:

1. **Copy License File**:
```bash
# For system-wide installation
sudo cp /opt/software/IDA_Pro_9.2.250908/keygens_patchers/idapro.hexlic \
       /opt/ida-9.2/
```

2. **Verify License**:
```bash
/opt/ida-9.2/idat64 --license

# Expected output:
# License holder: WolfGuard Development Team
# License type: Team License (floating)
# Expiration: 2026-12-31
# Decompiler: Enabled (Hex-Rays x86/x64)
```

3. **Floating License Server** (if applicable):
```bash
# Configure in: ~/.idapro/ida.reg
# Add:
# FLEXLM_LICENSE_FILE=27000@license-server.wolfguard.local
```

---

### 2.3 Directory Structure

After installation, IDA Pro directory:
```
/opt/ida-9.2/
├── ida64                    # GUI executable (64-bit)
├── idat64                   # Terminal executable (64-bit, headless)
├── idat                     # Terminal executable (32-bit, legacy)
├── plugins/                 # Plugin directory
│   ├── hexrays_sdk/         # Decompiler SDK
│   ├── findcrypt.py         # Crypto constant finder
│   └── ...
├── loaders/                 # File format loaders (ELF, PE, Mach-O)
├── procs/                   # Processor modules (x86, ARM, MIPS, etc.)
├── python/                  # Python 3.11 runtime
│   └── 3/
│       └── ida_*.py         # IDA Python API
├── cfg/                     # Configuration files
│   ├── ida.cfg              # Main configuration
│   └── hexrays.cfg          # Decompiler config
├── idc/                     # IDC scripts
├── ids/                     # Type libraries (.til files)
└── doc/                     # Documentation (PDF)
```

---

## 3. Configuration

### 3.1 Initial Configuration

**Launch IDA Pro GUI**:
```bash
/opt/ida-9.2/ida64 &
```

**First-Time Setup Wizard**:
1. **Welcome Screen**: Click "Next"
2. **License Agreement**: Accept (if you have valid license)
3. **Decompiler**: Verify "Hex-Rays Decompiler" is enabled
4. **User Directory**: Default is `~/.idapro/` (leave as-is)
5. **Finish**: Click "Finish"

---

### 3.2 Essential Settings

**File** → **Options**:

#### General Settings
- **Disassembly**:
  - ✅ Show auto comments
  - ✅ Show function comments
  - ✅ Show repeatable comments
  - Line prefixes: `✅ Show segment addresses`

- **Graph**:
  - Graph layout: `Digraph (orthogonal)`
  - Edge style: `Polyline`
  - ✅ Show addresses

- **Colors**:
  - Theme: `Dark` or `Light` (preference)
  - Syntax highlighting: ✅ Enabled

#### Decompiler Settings

**Edit** → **Plugins** → **Hex-Rays Decompiler**:
- **Analysis**:
  - Decompiler timeout: `300` seconds (for large functions)
  - Max graph node count: `5000`
  - ✅ Propagate pointer types
  - ✅ Propagate stack pointer
  - ✅ Infer types from string operations

- **Display**:
  - ✅ Show casts
  - ✅ Show anonymous unions
  - ✅ Show line numbers
  - Font size: `10pt` (adjust for readability)

#### Python Settings

**Options** → **Scripting languages**:
- Python path: `/opt/ida-9.2/python/3/`
- ✅ Enable IDAPython
- ✅ Load plugins from `~/.idapro/plugins/`

---

### 3.3 Workspace Layout

**Recommended Layout for Reverse Engineering**:

```
┌─────────────────────────────────────────────────────────┐
│ Menu Bar: File  Edit  View  Debugger  Windows  Help    │
├───────────┬─────────────────────────────────────────────┤
│           │                                             │
│ Functions │           Disassembly View                  │
│  List     │     (IDA View-A)                            │
│           │                                             │
│ (Ctrl+F3) │     0x00425f80: push rbp                    │
│           │     0x00425f81: mov rbp, rsp                │
│           │     ...                                     │
│           │                                             │
├───────────┼─────────────────────────────────────────────┤
│           │                                             │
│  Strings  │           Decompiler View                   │
│   List    │     (Pseudocode-A) [F5]                     │
│           │                                             │
│ (Shift+F12│     uint32_t vpn_totp_generate(...) {      │
│           │         uint64_t counter = timestamp / 30;  │
│           │         ...                                 │
│           │     }                                       │
│           │                                             │
└───────────┴─────────────────────────────────────────────┘
```

**Setup Workspace**:
1. **Function List**: `View` → `Open subviews` → `Functions` (Shift+F3)
2. **Strings**: `View` → `Open subviews` → `Strings` (Shift+F12)
3. **Hex View**: `View` → `Open subviews` → `Hex View`
4. **Decompiler**: Press `F5` in disassembly view

**Save Layout**:
- `Windows` → `Save desktop` → Name: "RE_Workspace"
- Load later: `Windows` → `Load desktop` → "RE_Workspace"

---

## 4. Essential Plugins

### 4.1 Built-in Plugins

**FindCrypt** (crypto constant detection):
```python
# Load plugin in IDA Python console
import findcrypt
findcrypt.main()

# Results show detected crypto algorithms:
# - AES S-boxes
# - SHA initialization vectors
# - RSA constants
```

**Hex-Rays Decompiler**:
- Already included in IDA Pro license
- Press `F5` in any function to decompile
- No additional setup required

---

### 4.2 Community Plugins

**Install Directory**: `~/.idapro/plugins/`

#### BinDiff (Binary Diffing)

**Purpose**: Compare two binary versions to identify changes

**Installation**:
```bash
# Download from: https://github.com/google/bindiff
wget https://github.com/google/bindiff/releases/download/v8/bindiff_8_amd64.deb

# Install (Debian/Ubuntu-based systems)
sudo dpkg -i bindiff_8_amd64.deb

# For RHEL/Oracle Linux, use alien:
sudo dnf install -y alien
sudo alien -r bindiff_8_amd64.deb
sudo rpm -ivh bindiff-8-1.x86_64.rpm

# IDA plugin installed automatically to ~/.idapro/plugins/
```

**Usage**:
1. Analyze two binaries in IDA Pro (create IDB files)
2. `File` → `Export` → `BinExport 2` for each binary
3. Run BinDiff GUI: `/opt/bindiff/bin/bindiff`
4. Compare exported files

---

#### IDAPython Scripts

**Useful Scripts**: https://github.com/idapython

**Installation**:
```bash
mkdir -p ~/.idapro/plugins

# Example: Export all functions to JSON
wget https://raw.githubusercontent.com/williballenthin/idapython/master/examples/export_functions.py \
     -O ~/.idapro/plugins/export_functions.py
```

**Run Script**:
- `File` → `Script file...` → Select script
- Or: `Alt+F7` → Type script name → Enter

---

#### Class Informer (C++ Analysis)

**Purpose**: Recover C++ class structures, vtables, and RTTI

**Installation**:
```bash
# Download
wget https://github.com/graysuit/IDA-Class-Informer/releases/download/v1.0/ClassInformer_x64.so

# Install
cp ClassInformer_x64.so ~/.idapro/plugins/
```

**Usage**:
- `Edit` → `Plugins` → `Class Informer`
- Scans binary for RTTI (Run-Time Type Information)
- Reconstructs C++ class hierarchies

---

### 4.3 Custom Plugins for WolfGuard

**Export Cisco Functions** (`~/.idapro/plugins/export_cisco_functions.py`):
```python
#!/usr/bin/env python3
# export_cisco_functions.py
# Export all functions with crypto/VPN keywords

import idaapi
import idautils
import idc
import json

def export_relevant_functions():
    """Export functions related to VPN/crypto/auth"""

    keywords = ['otp', 'totp', 'auth', 'token', 'verify',
                'cstp', 'dtls', 'vpn', 'tls', 'hmac', 'aes']

    results = []

    for func_ea in idautils.Functions():
        func_name = idc.get_func_name(func_ea)

        # Check if function name contains keywords
        if any(kw in func_name.lower() for kw in keywords):
            func = idaapi.get_func(func_ea)

            results.append({
                'name': func_name,
                'address': hex(func_ea),
                'size': func.size() if func else 0,
            })

    # Save to file
    output_path = idaapi.get_input_file_path() + '.cisco_functions.json'
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)

    print(f"[*] Exported {len(results)} relevant functions to {output_path}")

# Register as plugin
class ExportCiscoFunctions(idaapi.plugin_t):
    flags = idaapi.PLUGIN_UNL
    comment = "Export VPN/crypto-related functions"
    help = "Export functions relevant to WolfGuard analysis"
    wanted_name = "Export Cisco Functions"
    wanted_hotkey = "Ctrl-Alt-E"

    def init(self):
        return idaapi.PLUGIN_OK

    def run(self, arg):
        export_relevant_functions()

    def term(self):
        pass

def PLUGIN_ENTRY():
    return ExportCiscoFunctions()
```

**Install**:
```bash
cp export_cisco_functions.py ~/.idapro/plugins/
```

**Use**: Press `Ctrl+Alt+E` or `Edit` → `Plugins` → `Export Cisco Functions`

---

## 5. Scripting Setup

### 5.1 IDAPython Environment

**Python Version**: IDA Pro 9.2 uses Python 3.11

**Check Python Version**:
```python
# In IDA Python console (File → Scripting command):
import sys
print(sys.version)
# Output: 3.11.x
```

**Install Additional Packages**:
```bash
# IDA Pro uses bundled Python, so install to IDA's site-packages
/opt/ida-9.2/python/3/python -m pip install \
    angr \
    capstone \
    keystone-engine \
    unicorn
```

---

### 5.2 Useful IDAPython Snippets

**List All Functions**:
```python
import idautils

for func_ea in idautils.Functions():
    func_name = idc.get_func_name(func_ea)
    print(f"{hex(func_ea)}: {func_name}")
```

**Find String References**:
```python
import idautils
import idc

search_string = "Invalid OTP"

# Find string
string_ea = None
for s in idautils.Strings():
    if search_string in str(s):
        string_ea = s.ea
        break

if string_ea:
    print(f"[*] Found string at {hex(string_ea)}")

    # Find cross-references
    for xref in idautils.XrefsTo(string_ea):
        func_ea = idc.get_func_attr(xref.frm, idc.FUNCATTR_START)
        func_name = idc.get_func_name(func_ea)
        print(f"    Referenced by: {func_name} @ {hex(func_ea)}")
```

**Rename Function and Variables**:
```python
import idc

# Rename function
idc.set_name(0x00425f80, "vpn_totp_generate", idc.SN_CHECK)

# Rename local variable (in decompiler view)
# Must be done through decompiler API
import ida_hexrays

func = ida_hexrays.decompile(0x00425f80)
if func:
    func.lvars[0].name = "secret"
    func.lvars[1].name = "secret_len"
    func.save_user_labels()
```

**Export Decompiled Code**:
```python
import ida_hexrays

func_ea = 0x00425f80
func = ida_hexrays.decompile(func_ea)

if func:
    c_code = str(func)
    print(c_code)

    # Save to file
    with open(f'/tmp/func_{hex(func_ea)}.c', 'w') as f:
        f.write(c_code)
```

---

## 6. Batch Processing

### 6.1 Headless Analysis with idat64

**Command Syntax**:
```bash
idat64 [options] <binary>

Options:
  -A              Auto-analysis (analyze then exit)
  -S<script>      Run script after analysis
  -L<logfile>     Write log to file
  -c              Disassemble new binary (create new IDB)
  -o<idb>         Output IDB path
  -p<processor>   Force processor type
```

---

### 6.2 Batch Script Example

**Script**: `/opt/analysis/scripts/ida_batch_export.py` (see [RE Manifest Section 5.2](../reverse-engineering-manifest.md#52-ida-pro-batch-script))

**Run Batch Analysis**:
```bash
#!/bin/bash
# batch_analyze.sh

BINARY_DIR="/opt/analysis/cisco-binaries"
OUTPUT_DIR="/opt/analysis/ida-output"
IDA_SCRIPT="/opt/analysis/scripts/ida_batch_export.py"

mkdir -p "$OUTPUT_DIR"

find "$BINARY_DIR" -type f -executable | while read -r binary; do
    echo "[*] Analyzing: $binary"

    timeout 1800 /opt/ida-9.2/idat64 \
        -A \
        -S"$IDA_SCRIPT" \
        -L"$OUTPUT_DIR/$(basename $binary).log" \
        "$binary"

    if [ -f "$binary.json" ]; then
        mv "$binary.json" "$OUTPUT_DIR/$(basename $binary).json"
        echo "[✓] Exported"
    else
        echo "[✗] Failed"
    fi
done
```

---

### 6.3 Parallel Processing

**Using GNU Parallel**:
```bash
# Install GNU parallel
sudo dnf install -y parallel

# Run 8 jobs in parallel
find /opt/analysis/cisco-binaries -type f -executable | \
  parallel -j 8 --timeout 1800 \
  '/opt/ida-9.2/idat64 -A -S/opt/analysis/scripts/ida_batch_export.py {}'
```

**Performance**:
- 197 binaries @ 15 min each = 49 hours sequential
- 8 parallel jobs = 6 hours total

---

## 7. Best Practices

### 7.1 Project Organization

**Structure**:
```
/opt/analysis/ida_projects/
├── cisco_secure_client/
│   ├── v5.1.2.42/
│   │   ├── vpnagentd.i64        # IDA database (64-bit)
│   │   ├── vpnagentd.id0        # Database components
│   │   ├── vpnagentd.id1
│   │   ├── vpnagentd.nam
│   │   └── vpnagentd.til
│   └── v5.1.12.146/
│       └── ...
└── openconnect/
    └── ...
```

**Best Practices**:
- One IDB per binary (don't reuse)
- Organize by version
- Use descriptive IDB names
- Backup IDBs regularly (they contain all annotations)

---

### 7.2 Analysis Workflow

1. **Initial Analysis**:
   - Let IDA auto-analyze (30-60 minutes)
   - Don't interrupt analysis (causes corruption)
   - Save IDB frequently (`Ctrl+W`)

2. **Function Annotation**:
   - Rename functions immediately when identified
   - Add comments liberally (`;` key)
   - Document assumptions

3. **Collaboration**:
   - Export IDB to team shared storage
   - Use consistent naming conventions
   - Create analysis journals (see [RE Manifest](../reverse-engineering-manifest.md#61-analysis-journal))

---

### 7.3 Performance Optimization

**Speed Up Analysis**:
- Disable unnecessary analyzers:
  - `Options` → `General` → `Analysis` tab
  - Uncheck: "Find function chunks", "Non-returning functions"

- Increase memory limit:
```bash
export TVHEADSIZE=2048  # IDA memory buffer (MB)
/opt/ida-9.2/ida64 &
```

- Use SSD for IDB files (faster I/O)

**Large Binary Optimization**:
- For binaries >100 MB:
  - Use idat64 (headless) instead of GUI
  - Disable graph generation initially
  - Focus on specific functions (don't analyze everything)

---

## 8. Troubleshooting

### 8.1 Common Issues

#### Issue: "idat64: error while loading shared libraries"

**Error**:
```
idat64: error while loading shared libraries: libQt5Core.so.5: cannot open shared object file
```

**Solution**:
```bash
# Install Qt5 dependencies
sudo dnf install -y \
    qt5-qtbase \
    qt5-qtbase-gui \
    qt5-qtsvg \
    qt5-qtx11extras

# Or set LD_LIBRARY_PATH
export LD_LIBRARY_PATH="/opt/ida-9.2/lib:$LD_LIBRARY_PATH"
```

---

#### Issue: "Decompiler timeout"

**Error**: "Decompiler process timed out"

**Solution**:
```
Edit → Plugins → Hex-Rays Decompiler → Options
Set "Decompiler timeout" to 600 seconds
```

Or skip problematic function:
```python
# In IDAPython
import ida_hexrays
ida_hexrays.mark_cfunc_dirty(func_ea)  # Force re-analysis
```

---

#### Issue: "License not found"

**Error**: "Cannot find valid license file"

**Solution**:
```bash
# Check license file exists
ls -l /opt/ida-9.2/idapro.hexlic

# If missing, copy from keygens directory
sudo cp /opt/software/IDA_Pro_9.2.250908/keygens_patchers/idapro.hexlic \
       /opt/ida-9.2/

# Verify
/opt/ida-9.2/idat64 --license
```

---

#### Issue: "IDB corruption"

**Error**: "Database file is corrupted"

**Solution**:
```bash
# IDA creates backups automatically
ls -l ~/.idapro/backups/

# Restore from backup
cp ~/.idapro/backups/vpnagentd.i64.backup /opt/analysis/ida_projects/vpnagentd.i64

# If no backup, re-analyze binary
rm vpnagentd.i64 vpnagentd.id*
/opt/ida-9.2/ida64 vpnagentd  # Re-analyze
```

**Prevention**:
- Save frequently (`Ctrl+W`)
- Don't force-quit IDA during analysis
- Use version control for IDBs (Git LFS)

---

#### Issue: "Python script not loading"

**Error**: Plugin script doesn't appear in menu

**Solution**:
```bash
# Check plugin directory
ls -l ~/.idapro/plugins/

# Verify Python syntax
/opt/ida-9.2/python/3/python -m py_compile ~/.idapro/plugins/your_script.py

# Check IDA Python console for errors
# File → Scripting command
# Type: import your_script
```

---

### 8.2 Debug Mode

**Enable Debug Logging**:
```bash
# Set environment variable
export IDALOG=/tmp/ida_debug.log

# Run IDA
/opt/ida-9.2/ida64 &

# Check log
tail -f /tmp/ida_debug.log
```

**Verbose Output**:
```bash
/opt/ida-9.2/idat64 -v -A binary.elf
# -v: Verbose mode
```

---

## 9. Integration with WolfGuard Workflow

### 9.1 Analysis Pipeline

**IDA Pro in WolfGuard Workflow**:
```
Reconnaissance → IDA Pro Deep Analysis → angr Validation → C23 Implementation
   (30 min)           (2-4 hours)            (1 hour)          (2-4 hours)
```

**When to Use IDA Pro**:
- Complex C++ binaries (vtable reconstruction)
- Critical authentication functions (requires best decompiler)
- Protocol parsers (need accurate struct recovery)
- Cryptographic algorithms (use FindCrypt plugin)

**When to Use Alternatives**:
- Quick string extraction → `strings` command
- Struct recovery → Reko (faster)
- Batch analysis → Ghidra headless (free, scriptable)

---

### 9.2 Output Format

**Standardized JSON Output** (for automation):
```json
{
  "binary": "vpnagentd",
  "version": "5.1.12.146",
  "architecture": "x86_64",
  "analysis_date": "2025-10-30",
  "functions": [
    {
      "name": "vpn_totp_generate",
      "address": "0x00425f80",
      "size": 128,
      "decompiled": "uint32_t vpn_totp_generate(...) { ... }",
      "confidence": "high",
      "xrefs": ["0x00426120", "0x00427a00"]
    }
  ],
  "structs": [
    {
      "name": "vpn_session_t",
      "size": 304,
      "fields": [
        {"offset": 0, "type": "uint32_t", "name": "session_id"},
        {"offset": 8, "type": "uint8_t*", "name": "session_token"}
      ]
    }
  ]
}
```

---

## 10. Advanced Topics

### 10.1 Debugging with IDA Pro

**Local Debugging**:
1. `Debugger` → `Select debugger` → `Linux debugger`
2. `Debugger` → `Process options`
   - Application: `/opt/binaries/vpnagentd`
   - Parameters: `--config /etc/vpn.conf`
3. `Debugger` → `Start process` (F9)

**Remote Debugging**:
```bash
# On target machine (Oracle Linux VM)
/opt/ida-9.2/dbgsrv/linux_server64 -Ppassword

# In IDA Pro:
# Debugger → Select debugger → Remote Linux debugger
# Debugger → Process options
#   - Hostname: 192.168.1.100
#   - Port: 23946
#   - Password: password
```

---

### 10.2 Type Libraries

**Import Type Libraries** (for better decompilation):
```
View → Open subviews → Type libraries
Right-click → Load type library
Select: linux_x64.til, glibc.til, openssl.til
```

**Create Custom Type Library**:
```c
// vpn_types.h - Custom types for Cisco VPN
typedef struct {
    uint32_t session_id;
    uint8_t *token;
    // ...
} vpn_session_t;
```

**Parse into IDA**:
```
File → Load file → Parse C header file
Select: vpn_types.h
```

---

## 11. Resources

**Official Documentation**:
- IDA Pro Help: Press `F1` in IDA Pro
- Hex-Rays Documentation: https://hex-rays.com/documentation/
- IDAPython Docs: https://www.hex-rays.com/products/ida/support/idapython_docs/

**Books**:
- "The IDA Pro Book" by Chris Eagle
- "Practical Malware Analysis" by Michael Sikorski (includes IDA Pro)

**Community**:
- Hex-Rays Forum: https://hex-rays.com/forum/
- IDAPython GitHub: https://github.com/idapython

**WolfGuard Documentation**:
- [Reverse Engineering Manifest](../reverse-engineering-manifest.md)
- [Batch Analysis Workflow](../workflows/batch-analysis.md)
- [DECOMPILATION_WORKFLOW.md](../../../cisco-secure-client/analysis/DECOMPILATION_WORKFLOW.md)

---

## 12. Quick Reference

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F5` | Decompile function (Hex-Rays) |
| `N` | Rename item |
| `Y` | Change function signature |
| `X` | Cross-references to item |
| `;` | Add comment |
| `G` | Jump to address |
| `Ctrl+S` | Search |
| `Ctrl+W` | Save database |
| `Space` | Switch between graph/text view |
| `Esc` | Go back |
| `Ctrl+Enter` | Go forward |

---

**Document Status**: Ready for Use
**Maintained By**: WolfGuard Reverse Engineering Team
**Last Updated**: 2025-10-30
**Next Review**: 2026-01-30

---

**END OF DOCUMENT**

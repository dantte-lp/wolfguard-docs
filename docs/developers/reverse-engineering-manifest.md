# WolfGuard Reverse Engineering Manifest

**Version**: 2.0
**Date**: 2025-10-30
**Status**: Production Ready
**Project**: WolfGuard - OpenConnect VPN Server Implementation
**Target Analysis**: Cisco Secure Client versions 5.1.2.42 and 5.1.12.146

---

## Executive Summary

This manifest establishes the comprehensive reverse engineering methodology for the WolfGuard project. It integrates lessons learned from analyzing 197 binaries and 3,369+ functions across multiple Cisco Secure Client versions, combining industry best practices with practical automation strategies.

**Key Objectives**:
- Achieve protocol compatibility with Cisco Secure Client
- Implement secure, RFC-compliant authentication mechanisms
- Enable interoperability through clean-room reverse engineering
- Maintain legal compliance under DMCA Section 1201(f)

**Tool Stack Summary**:
- **Primary**: IDA Pro 9.2, Ghidra 11.3
- **Supporting**: radare2, angr 9.2, Reko 0.12.0
- **Dynamic**: gdb, strace, ltrace, Frida, Wireshark
- **Automation**: Python 3.11, Bash scripts, Meson build system
- **Future Evaluation**: Binary Ninja (pending budget approval)

---

## Table of Contents

1. [Methodology Overview](#1-methodology-overview)
2. [Tool Stack](#2-tool-stack)
3. [Multi-Stage Analysis Workflow](#3-multi-stage-analysis-workflow)
4. [Platform-Specific Guidelines](#4-platform-specific-guidelines)
5. [Automation Strategy](#5-automation-strategy)
6. [Documentation Standards](#6-documentation-standards)
7. [Quality Assurance](#7-quality-assurance)
8. [Security Considerations](#8-security-considerations)
9. [Legal and Ethical Guidelines](#9-legal-and-ethical-guidelines)
10. [Tool-Specific Workflows](#10-tool-specific-workflows)
11. [Integration with WolfGuard Development](#11-integration-with-wolfguard-development)
12. [Training and Onboarding](#12-training-and-onboarding)

---

## 1. Methodology Overview

### 1.1 Goals and Objectives

**Primary Goals**:
- **Interoperability**: Create compatible implementation of OpenConnect protocol
- **Security**: Implement cryptographically secure authentication flows
- **Standards Compliance**: Follow RFC specifications (RFC 6238, RFC 5246, etc.)
- **Clean Room Design**: Implement from understanding, not copied code

**Secondary Goals**:
- **Performance**: Optimize for high-throughput VPN scenarios
- **Maintainability**: Create well-documented, testable C23 code
- **Extensibility**: Design for future protocol enhancements

### 1.2 Legal and Ethical Framework

All reverse engineering activities comply with:
- **DMCA Section 1201(f)**: Reverse engineering for interoperability
- **Clean Room Methodology**: Separation of analysis and implementation teams
- **Fair Use Doctrine**: Educational and research purposes
- **No Tool Distribution**: Analysis tools remain internal

**Documentation Requirement**: Every analysis session must document:
- Purpose of analysis (e.g., "Understand TOTP authentication flow")
- Methodology used (e.g., "Static analysis with Ghidra + dynamic tracing")
- Findings and conclusions (e.g., "TOTP uses RFC 6238 with 30s window")

### 1.3 Quality Standards

**Confidence Levels**:
- **High Confidence (95%+)**: Cross-validated by 3+ tools, RFC-compliant, tested against Cisco client
- **Medium Confidence (70-95%)**: Validated by 2 tools, logical consistency, partial testing
- **Low Confidence (&lt;70%)**: Single tool analysis, requires further validation

**Quality Gates**:
- [ ] Static analysis completed with primary tool
- [ ] Cross-validation with secondary tool
- [ ] Security review (no authentication bypasses, proper bounds checking)
- [ ] RFC compliance verification
- [ ] Integration test with actual Cisco Secure Client

---

## 2. Tool Stack

### 2.1 Primary Analysis Tools

#### IDA Pro 9.2 (Hex-Rays)

**Strengths**:
- Industry-leading decompiler quality
- Excellent C++ class recovery (critical for Cisco binaries)
- Mature plugin ecosystem
- Headless batch processing via idat64

**Use Cases**:
- Deep function-level analysis
- Complex control flow reconstruction
- C++ vtable analysis
- Cryptographic algorithm identification

**Installation**: `/opt/software/IDA_Pro_9.2.250908/`
**Platform**: Linux (x64), Windows (via container), macOS
**Licensing**: Commercial (team license)
**Documentation**: [IDA Pro Setup Guide](./tools/ida-pro-setup.md)

**Batch Analysis Capability**: YES
```bash
/opt/ida/idat64 -A -Sanalysis_script.py binary.elf
```

---

### 2.2 Future Tool Enhancements

#### Binary Ninja (Vector35) - Under Evaluation

> ⚠️ **Status**: Not currently in active use - evaluation completed, pending budget approval for commercial license.

**Evaluation Summary**:
- Modern, fast analysis engine
- Excellent Python API for automation
- Multiple IL representations (LLIL, MLIL, HLIL)
- Built-in collaboration features

**Potential Use Cases** (if acquired):
- Rapid initial analysis
- Custom workflow automation
- Protocol state machine visualization
- Comparative binary diffing (WARP function matching)

**Platform**: Cross-platform (requires commercial license)
**Documentation**: [Binary Ninja Assessment](./tools/binary-ninja-assessment.md) (kept for future reference)

**Current Workaround**: Using IDA Pro + Ghidra combination covers all essential functionality

---

### 2.3 Secondary Analysis Tools

#### Ghidra 11.3 (NSA)

**Strengths**:
- Free and open-source
- Excellent for large-scale analysis (197 binaries)
- Scripting in Python and Java
- Active community support

**Use Cases**:
- Struct recovery and type propagation
- Batch processing of multiple binaries
- Educational analysis and documentation
- Version comparison (headless diff scripts)

**Installation**: `/opt/tools/ghidra_11.3_PUBLIC_20250115/`
**Platform**: Cross-platform (requires JDK 17+)
**Licensing**: Apache 2.0
**Documentation**: [DECOMPILATION_WORKFLOW.md](../../cisco-secure-client/analysis/DECOMPILATION_WORKFLOW.md)

**Batch Processing**:
```bash
$GHIDRA_HOME/support/analyzeHeadless \
  /opt/analysis/ghidra_projects \
  CiscoAnalysis \
  -import /opt/binaries/vpnagentd \
  -postScript ExportFunctions.java
```

---

### 2.4 Supporting Tools

#### Reko 0.12.0 (Fast Struct Recovery)

**Purpose**: Quick initial struct extraction
**Strength**: Type inference from memory access patterns
**Use Case**: Phase 1 reconnaissance (30 minutes per binary)

```bash
mono /opt/tools/reko/Reko.exe --arch=x86-64 --loader=elf binary.elf
```

---

#### radare2 (Quick Analysis)

**Purpose**: Command-line binary analysis
**Strength**: Fast, scriptable, low resource usage
**Use Case**: String extraction, symbol enumeration, quick disassembly

```bash
# Quick function listing
r2 -qc 'aaa; afl' binary.elf

# Disassemble specific address
r2 -qc 'pd 50 @ 0x00425f80' vpnagentd
```

---

#### angr 9.2 (Symbolic Execution)

**Purpose**: Security validation and test case generation
**Strength**: Automated path exploration, constraint solving
**Use Case**: Verify no authentication bypasses, validate time windows

**Installation**: `/opt/tools/angr-env/` (Python venv)
**Documentation**: [DECOMPILATION_WORKFLOW.md](../../cisco-secure-client/analysis/DECOMPILATION_WORKFLOW.md)

```python
import angr
project = angr.Project('vpnagentd', auto_load_libs=False)
simgr = project.factory.simulation_manager()
simgr.explore(find=0x00426400, avoid=[0x00426450])
```

---

### 2.5 Dynamic Analysis Tools

#### GDB (GNU Debugger)

**Purpose**: Runtime behavior inspection
**Use Case**: Trace function calls, inspect registers/memory, breakpoint analysis

```bash
gdb -ex 'break vpn_totp_verify' -ex 'run' ./vpnagentd
```

---

#### strace / ltrace

**Purpose**: System call and library call tracing
**Use Case**: Identify file access, network operations, crypto library usage

```bash
strace -f -e open,connect,sendto ./vpnagentd 2>&1 | tee strace.log
ltrace -e '*crypt*' ./vpnagentd 2>&1 | tee ltrace.log
```

---

#### Frida (Dynamic Instrumentation)

**Purpose**: Runtime hooking and modification
**Use Case**: Intercept function calls, modify behavior, extract session keys

```javascript
// Frida script: hook HMAC function
Interceptor.attach(Module.findExportByName(null, "HMAC"), {
  onEnter: function(args) {
    console.log("[HMAC] Key:", hexdump(ptr(args[2]), { length: 32 }));
  },
  onLeave: function(retval) {
    console.log("[HMAC] Result:", hexdump(retval, { length: 20 }));
  }
});
```

---

#### Wireshark + TLS Decryption

**Purpose**: Network protocol analysis
**Use Case**: Capture CSTP/DTLS traffic, analyze packet structure

**TLS Key Extraction**:
```bash
export SSLKEYLOGFILE=/tmp/sslkeys.log
./vpnagentd
# Then load sslkeys.log in Wireshark: Edit → Preferences → Protocols → TLS
```

---

### 2.6 Tool Selection Matrix

| Task | Primary Tool | Secondary Tool | Time Estimate |
|------|-------------|----------------|---------------|
| Initial reconnaissance | `strings`, `nm`, `readelf` | radare2 | 15-30 min |
| Struct recovery | Reko | Ghidra | 30-60 min |
| Function decompilation | IDA Pro | Ghidra | 1-3 hours |
| C++ class reconstruction | IDA Pro | Ghidra | 2-4 hours |
| Protocol analysis | Wireshark | Frida | 1-2 hours |
| Security validation | angr | Manual code review | 1-2 hours |
| Batch processing | Ghidra headless | IDA idat64 | Variable |
| Version comparison | radare2 (radiff2) | IDA BinDiff plugin | 1-2 hours |

---

## 3. Multi-Stage Analysis Workflow

### Stage 1: Reconnaissance (Fast)

**Goal**: Identify targets without deep analysis
**Time**: 15-30 minutes per binary
**Tools**: `strings`, `nm`, `readelf`, `ldd`, `file`

**Procedure**:
```bash
#!/bin/bash
# reconnaissance.sh - Quick binary profiling

BINARY="$1"
OUTPUT_DIR="/opt/analysis/recon"

mkdir -p "$OUTPUT_DIR"

echo "[*] Analyzing: $BINARY"

# File type
file "$BINARY" > "$OUTPUT_DIR/$(basename $BINARY)_file.txt"

# Strings (min 8 chars)
strings -a -n 8 "$BINARY" > "$OUTPUT_DIR/$(basename $BINARY)_strings.txt"

# Symbols (dynamic and static)
nm -D "$BINARY" 2>/dev/null > "$OUTPUT_DIR/$(basename $BINARY)_nm_dynamic.txt"
nm -C "$BINARY" 2>/dev/null > "$OUTPUT_DIR/$(basename $BINARY)_nm_all.txt"

# Dependencies
ldd "$BINARY" 2>/dev/null > "$OUTPUT_DIR/$(basename $BINARY)_ldd.txt"

# Sections
readelf -S "$BINARY" > "$OUTPUT_DIR/$(basename $BINARY)_sections.txt"

# Search for keywords
grep -iE "otp|totp|auth|token|secret|verify|cstp|dtls|x-cstp|x-dtls" \
  "$OUTPUT_DIR/$(basename $BINARY)_strings.txt" \
  > "$OUTPUT_DIR/$(basename $BINARY)_keywords.txt"

echo "[✓] Reconnaissance complete: $OUTPUT_DIR"
```

**Output**:
- File type and architecture
- String table with crypto/protocol keywords
- Exported symbols (functions, global variables)
- Shared library dependencies
- ELF section layout

**Decision Point**: Prioritize binaries with:
- Authentication-related strings (`otp`, `totp`, `auth`)
- Network protocol keywords (`X-CSTP`, `X-DTLS`)
- Crypto library dependencies (`libssl.so`, `libcrypto.so`)

---

### Stage 2: Static Analysis (Medium)

**Goal**: Understand function-level logic and data structures
**Time**: 1-3 hours per binary
**Tools**: IDA Pro or Ghidra

**Procedure**:

1. **Import Binary**:
   - IDA Pro: `File → Open` → Select binary → Auto-analysis
   - Ghidra: `File → Import File` → Analyze

2. **Function Identification**:
   - Use symbol table (if not stripped)
   - Search for string references (e.g., "Invalid OTP" → find referencing function)
   - Identify entry points (`main`, `_init`, `__libc_start_main`)

3. **Decompilation**:
   - Navigate to target function
   - Review decompiled C code
   - Annotate variables and function calls
   - Rename generic names (`FUN_00425f80` → `vpn_totp_generate`)

4. **Struct Recovery**:
   - Identify memory access patterns (`ctx->field`)
   - Use type propagation (Ghidra: `Data Type Manager`)
   - Document struct layouts with offsets

5. **Cross-Reference Analysis**:
   - Find all callers of critical functions
   - Trace data flow (e.g., where does `secret` come from?)
   - Map function call graphs

**Output**:
- Annotated decompiled C code
- Struct definitions with field purposes
- Function call graph (text or visual)
- Security notes (e.g., "Uses constant-time comparison")

---

### Stage 3: Deep Analysis (Slow)

**Goal**: Complete understanding of algorithms and protocols
**Time**: 2-6 hours per critical binary
**Tools**: IDA Pro + Hex-Rays Decompiler, angr

**Procedure**:

1. **Algorithm Identification**:
   - Look for crypto constants (S-boxes, initialization vectors)
   - Use FindCrypt plugin (IDA) or CryptoIDENTIFY (Ghidra)
   - Compare with RFC specifications

2. **Protocol Reconstruction**:
   - Identify packet parsers (e.g., `parse_cstp_headers`)
   - Extract field formats (offset, length, type)
   - Document state machines (connection establishment flow)

3. **Security Analysis**:
   - Check for buffer overflows (`strcpy`, unchecked array access)
   - Verify input validation (bounds checks, null checks)
   - Test for authentication bypasses (using angr)

4. **Version Comparison**:
   - Use radare2's radiff2 for binary diffing
   - Or use IDA Pro's BinDiff plugin (if available)
   - Document new features or security fixes

**Output**:
- Complete pseudocode with confidence annotations
- Protocol specification (packet format, state diagram)
- Security assessment report
- Version diff highlighting changes

---

### Stage 4: Dynamic Analysis (As Needed)

**Goal**: Validate static analysis findings at runtime
**Time**: 1-4 hours per feature
**Tools**: gdb, strace, ltrace, Frida, Wireshark

**Procedure**:

1. **Controlled Environment**:
   ```bash
   # Run in isolated VM or container
   podman run --rm -it \
     --cap-add=SYS_PTRACE \
     -v /opt/binaries:/binaries:ro \
     oraclelinux:9 bash
   ```

2. **System Call Tracing**:
   ```bash
   # Trace file operations
   strace -f -e openat,read,write ./vpnagentd 2>&1 | tee strace.log

   # Trace network operations
   strace -f -e socket,connect,sendto,recvfrom ./vpnagentd
   ```

3. **Library Call Tracing**:
   ```bash
   # Trace crypto operations
   ltrace -e 'HMAC*' -e 'AES*' -e 'SHA*' ./vpnagentd
   ```

4. **Function Hooking with Frida**:
   ```bash
   frida -l hook_totp.js -f ./vpnagentd
   ```

5. **Network Traffic Capture**:
   ```bash
   # Capture on VPN interface
   tcpdump -i tun0 -w capture.pcap -s 65535

   # Analyze with Wireshark
   wireshark capture.pcap
   ```

6. **Debugging Session**:
   ```bash
   gdb ./vpnagentd
   (gdb) break vpn_totp_verify
   (gdb) run
   (gdb) info registers
   (gdb) x/32bx $rsi   # Examine memory at RSI register
   ```

**Output**:
- System call logs showing file/network access
- Library call traces revealing crypto operations
- Frida logs with intercepted function arguments
- PCAP files for protocol analysis
- Debugging session notes

---

### Stage 5: C23 Implementation

**Goal**: Convert findings into production-ready WolfGuard code
**Time**: 2-6 hours per feature
**Tools**: Text editor, C23 compiler, wolfSSL/wolfCrypt

**Conversion Checklist**:
- [ ] Replace proprietary types with standards (`uint32_t`, `size_t`)
- [ ] Add C23 attributes (`[[nodiscard]]`, `[[maybe_unused]]`)
- [ ] Use `constexpr` for compile-time constants
- [ ] Replace Cisco crypto with wolfCrypt equivalents
- [ ] Add comprehensive input validation
- [ ] Implement proper error handling
- [ ] Follow WolfGuard coding style (clang-format)
- [ ] Add Doxygen documentation
- [ ] Create unit tests (CUnit framework)

**Example Conversion**:

**Before** (Ghidra decompiled):
```c
uint32_t cisco_totp_gen(void *ctx, int timestamp) {
    uint8_t hmac[20];
    uint64_t counter = timestamp / 30;
    cisco_hmac_sha1(hmac, *(void**)(ctx+0x10), *(int*)(ctx+0x18), counter);
    uint8_t offset = hmac[19] & 0xF;
    return (((hmac[offset] & 0x7F) << 24) |
            (hmac[offset+1] << 16) |
            (hmac[offset+2] << 8) |
            hmac[offset+3]) % 1000000;
}
```

**After** (WolfGuard C23):
```c
/**
 * @brief Generate TOTP code per RFC 6238
 * @param secret Secret key (binary)
 * @param secret_len Secret length (16-32 bytes)
 * @param timestamp Unix timestamp
 * @return 6-digit TOTP code (000000-999999), or 0 on error
 */
[[nodiscard]] uint32_t
wolfguard_totp_generate(const uint8_t *secret, size_t secret_len, time_t timestamp)
{
    if (!secret || secret_len == 0 || secret_len > 64) {
        return 0;
    }

    constexpr uint32_t TIME_STEP_SEC = 30;
    uint64_t counter = (uint64_t)(timestamp / TIME_STEP_SEC);

    // Convert counter to big-endian
    uint8_t counter_be[8];
    for (int i = 7; i >= 0; i--) {
        counter_be[i] = (uint8_t)(counter & 0xFF);
        counter >>= 8;
    }

    // HMAC-SHA1 using wolfCrypt
    uint8_t hmac_result[WC_SHA_DIGEST_SIZE];
    Hmac hmac;

    if (wc_HmacSetKey(&hmac, WC_SHA, secret, (word32)secret_len) != 0) {
        return 0;
    }

    wc_HmacUpdate(&hmac, counter_be, sizeof(counter_be));
    wc_HmacFinal(&hmac, hmac_result);

    // Dynamic truncation (RFC 6238 Section 5.3)
    uint8_t offset = hmac_result[WC_SHA_DIGEST_SIZE - 1] & 0x0F;
    uint8_t *offset_ptr = &hmac_result[offset];

    uint32_t code = ((offset_ptr[0] & 0x7F) << 24) |
                    ((offset_ptr[1] & 0xFF) << 16) |
                    ((offset_ptr[2] & 0xFF) << 8) |
                    (offset_ptr[3] & 0xFF);

    constexpr uint32_t TOTP_MODULO = 1000000;
    return code % TOTP_MODULO;
}
```

**Integration**:
```bash
# Add to meson build
# src/auth/meson.build
auth_sources = [
  'totp.c',
  'base32.c',
]

auth_lib = static_library(
  'auth',
  auth_sources,
  dependencies: [wolfssl_dep],
  include_directories: inc
)
```

---

### Stage 6: Testing and Validation

**Goal**: Ensure compatibility with Cisco Secure Client
**Time**: 2-4 hours per feature
**Tools**: CUnit, Valgrind, Wireshark, actual Cisco client

**Test Hierarchy**:

1. **Unit Tests (RFC Test Vectors)**:
```c
// tests/unit/test_totp.c
void test_rfc6238_vectors(void) {
    const uint8_t secret[] = "12345678901234567890";

    struct {
        time_t time;
        uint32_t expected;
    } vectors[] = {
        {59, 94287082},
        {1111111109, 7081804},
        {1234567890, 89005924},
    };

    for (size_t i = 0; i < sizeof(vectors)/sizeof(vectors[0]); i++) {
        uint32_t code = wolfguard_totp_generate(secret, 20, vectors[i].time);
        CU_ASSERT_EQUAL(code, vectors[i].expected);
    }
}
```

2. **Integration Tests**:
```bash
#!/bin/bash
# Test with OpenConnect client
SECRET="JBSWY3DPEHPK3PXP"
CODE=$(./build/bin/totp_cli generate "$SECRET")

echo "$CODE" | openconnect --user=testuser \
  --servercert=sha256:deadbeef... \
  --passwd-on-stdin \
  vpn-test.example.com
```

3. **Compatibility Tests**:
```bash
#!/bin/bash
# Test with actual Cisco Secure Client
CODE=$(./build/bin/totp_cli generate "$SECRET")

# Attempt connection
/opt/cisco/secureclient/bin/vpn -s connect \
  vpn-test.example.com \
  -u testuser \
  -p "$CODE"

if [ $? -eq 0 ]; then
    echo "[✓] Cisco client accepted our TOTP code"
else
    echo "[✗] Incompatibility detected"
fi
```

4. **Security Tests**:
```bash
# Memory safety
valgrind --leak-check=full \
         --show-leak-kinds=all \
         ./build/tests/unit/test_totp

# Fuzzing
afl-fuzz -i testcases/ -o findings/ ./test_totp @@
```

**Output**:
- Unit test results (pass/fail per test vector)
- Integration test report (compatibility with OpenConnect)
- Cisco client compatibility report (accept/reject)
- Valgrind memory safety report (no leaks/errors)

---

## 4. Platform-Specific Guidelines

### 4.1 Linux Binaries (ELF)

**File Types**: `vpnagentd`, `libvpnapi.so`, `libacciscossl.so`

**Preferred Tools**:
- Primary: IDA Pro 9.2 (x64 Linux) or Ghidra 11.3
- Quick analysis: `readelf`, `objdump`, radare2
- Dynamic: gdb, strace, ltrace

**Common Patterns**:
- Position-Independent Executables (PIE)
- RELRO (Relocation Read-Only) for security
- Symbol stripping in release builds
- `dlopen()` for plugin loading

**Analysis Checklist**:
- [ ] Check if stripped: `readelf -s binary | grep FUNC`
- [ ] Identify constructor functions: `.init`, `.ctors`
- [ ] Find signal handlers: `sigaction`, `signal`
- [ ] Locate IPC mechanisms: UNIX sockets, shared memory
- [ ] Examine thread usage: `pthread_create` calls

**Special Considerations**:
- SELinux context (may affect file access in dynamic analysis)
- Namespace usage (network, PID, mount)
- Capabilities: `getcap binary` (e.g., `CAP_NET_ADMIN`)

---

### 4.2 Windows Binaries (PE)

**File Types**: `vpnagent.exe`, `vpnapi.dll`, `vpnagent.sys` (kernel driver)

**Preferred Tools**:
- Primary: IDA Pro 9.2 (Windows) via container
- Alternative: Ghidra (cross-platform)
- Dynamic: x64dbg, WinDbg, Process Monitor (Sysinternals)

**Common Patterns**:
- ASLR (Address Space Layout Randomization)
- DEP (Data Execution Prevention)
- Code signing (Authenticode)
- COM/DCOM interfaces

**Analysis Checklist**:
- [ ] Check code signing: `signtool verify /pa binary.exe`
- [ ] Identify imported DLLs: `dumpbin /imports binary.exe`
- [ ] Find registry access: Look for `RegOpenKeyEx` calls
- [ ] Locate Windows services: `CreateService`, `StartService`
- [ ] Examine driver interactions: `DeviceIoControl` calls

**Windows Container Setup**:

See [Section 4.3: Windows Container Strategy](#43-windows-container-strategy) below.

---

### 4.3 Windows Container Strategy

**Base Image**: `mcr.microsoft.com/windows/servercore:ltsc2022`

**Dockerfile**:
```dockerfile
# Containerfile.windows-re
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Install IDA Pro
COPY installers/ida-pro_92_x64win.exe C:\Temp\
RUN C:\Temp\ida-pro_92_x64win.exe /S /D=C:\IDA

# Install Python for scripting
RUN curl -o C:\Temp\python.exe https://www.python.org/ftp/python/3.11.0/python-3.11.0-amd64.exe && \
    C:\Temp\python.exe /quiet InstallAllUsers=1 PrependPath=1

# Install dependencies
RUN pip install idapy

WORKDIR C:\analysis

CMD ["cmd.exe"]
```

**Build and Run**:
```bash
# Build container
podman build -f Containerfile.windows-re -t wolfguard-re-windows .

# Run analysis
podman run --rm -it \
  -v /opt/binaries:/analysis/binaries:ro \
  -v /opt/analysis/output:/analysis/output:rw \
  wolfguard-re-windows \
  "C:\IDA\idat64.exe -A -Sanalysis.py C:\analysis\binaries\vpnagent.exe"
```

**Batch Processing Script**:
```powershell
# batch_analyze.ps1
$binaries = Get-ChildItem C:\analysis\binaries -Filter *.exe

foreach ($binary in $binaries) {
    Write-Host "Analyzing: $($binary.Name)"

    & "C:\IDA\idat64.exe" `
        -A `
        -S"C:\analysis\scripts\export_functions.py" `
        $binary.FullName

    # Export results
    Move-Item "C:\analysis\output\*" "C:\analysis\results\$($binary.BaseName)\"
}
```

**Security Notes**:
- Run container with minimal privileges
- Mount binaries read-only
- Scan output directory for malware before copying back to host
- Use host network isolation

---

### 4.4 macOS Binaries (Mach-O)

**File Types**: `CiscoSecureClient.app`, `libvpnapi.dylib`

**Preferred Tools**:
- Primary: IDA Pro 9.2 (macOS)
- Alternative: Ghidra
- Dynamic: lldb, dtruss (DTrace), Hopper Disassembler

**Common Patterns**:
- Universal binaries (x86_64 + ARM64)
- Code signing with entitlements
- Keychain access for secrets
- XPC services for IPC

**Analysis Checklist**:
- [ ] Check code signing: `codesign -dv --verbose=4 binary`
- [ ] Extract entitlements: `codesign -d --entitlements :- binary`
- [ ] Identify linked frameworks: `otool -L binary`
- [ ] Find Objective-C classes: `class-dump binary`
- [ ] Examine XPC services: Look for `xpc_connection_create`

**Special Considerations**:
- System Integrity Protection (SIP) may block debugging
- Notarization requirements for distribution
- Privacy permissions (TCC database)

---

## 5. Automation Strategy

### 5.1 Batch Processing Architecture

**Goal**: Analyze 197+ binaries efficiently

**Pipeline**:
```
┌─────────────┐
│  Stage 1:   │  strings, nm, readelf (5 min × 197 = 16 hours)
│ Recon       │  → Parallel: 8 workers → 2 hours
└──────┬──────┘
       │
       v
┌─────────────┐
│  Stage 2:   │  Reko struct recovery (30 min × 197 = 98 hours)
│ Struct      │  → Parallel: 8 workers → 12 hours
└──────┬──────┘
       │
       v
┌─────────────┐
│  Stage 3:   │  IDA/Ghidra decompilation (Critical binaries only)
│ Deep        │  → 20 critical binaries × 3 hours = 60 hours
└──────┬──────┘
       │
       v
┌─────────────┐
│  Stage 4:   │  Aggregation and reporting
│ Report      │  → 4 hours
└─────────────┘

Total Time: ~78 hours (1 week with 8-core workstation)
```

---

### 5.2 IDA Pro Batch Script

**Script**: `/opt/analysis/scripts/ida_batch_export.py`

```python
#!/usr/bin/env python3
# ida_batch_export.py
# Run with: /opt/ida/idat64 -A -S/opt/analysis/scripts/ida_batch_export.py binary.elf

import idaapi
import idautils
import idc
import json
import os

def analyze_binary():
    """Export all functions to JSON"""

    # Wait for auto-analysis
    idaapi.auto_wait()

    results = {
        'binary': idaapi.get_input_file_path(),
        'functions': [],
        'strings': [],
        'imports': [],
    }

    # Export functions
    for func_ea in idautils.Functions():
        func = idaapi.get_func(func_ea)
        if not func:
            continue

        func_name = idc.get_func_name(func_ea)

        results['functions'].append({
            'address': hex(func_ea),
            'name': func_name,
            'size': func.size(),
            'flags': func.flags,
        })

    # Export strings
    strings = idautils.Strings()
    for s in strings:
        results['strings'].append({
            'address': hex(s.ea),
            'value': str(s),
            'length': s.length,
        })

    # Export imports
    nimps = idaapi.get_import_module_qty()
    for i in range(nimps):
        name = idaapi.get_import_module_name(i)
        if not name:
            continue

        def imp_cb(ea, name, ordinal):
            results['imports'].append({
                'module': idaapi.get_import_module_name(i),
                'name': name,
                'address': hex(ea),
            })
            return True

        idaapi.enum_import_names(i, imp_cb)

    # Save results
    output_file = idaapi.get_input_file_path() + '.json'
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)

    print(f"[IDA] Exported {len(results['functions'])} functions to {output_file}")

    # Exit IDA
    idc.qexit(0)

if __name__ == '__main__':
    analyze_binary()
```

**Runner Script**: `/opt/analysis/scripts/batch_analyze_ida.sh`

```bash
#!/bin/bash
# batch_analyze_ida.sh - Analyze all binaries with IDA Pro

BINARY_DIR="/opt/analysis/cisco-binaries"
OUTPUT_DIR="/opt/analysis/ida-output"
IDA_SCRIPT="/opt/analysis/scripts/ida_batch_export.py"
IDA_BIN="/opt/software/IDA_Pro_9.2/ida64"

mkdir -p "$OUTPUT_DIR"

# Find all ELF binaries
find "$BINARY_DIR" -type f -executable | while read -r binary; do
    echo "[*] Analyzing: $binary"

    # Skip if already analyzed
    if [ -f "$OUTPUT_DIR/$(basename $binary).json" ]; then
        echo "[SKIP] Already analyzed"
        continue
    fi

    # Run IDA headless
    timeout 1800 "$IDA_BIN" -A -S"$IDA_SCRIPT" "$binary" > /dev/null 2>&1

    # Move output
    if [ -f "$binary.json" ]; then
        mv "$binary.json" "$OUTPUT_DIR/$(basename $binary).json"
        echo "[✓] Exported to $OUTPUT_DIR/$(basename $binary).json"
    else
        echo "[✗] Analysis failed"
    fi
done

echo "[*] Batch analysis complete"
```

**Parallel Execution**:
```bash
# Use GNU parallel for 8 concurrent jobs
find /opt/analysis/cisco-binaries -type f -executable | \
  parallel -j 8 --timeout 1800 \
  '/opt/software/IDA_Pro_9.2/ida64 -A -S/opt/analysis/scripts/ida_batch_export.py {}'
```

---

### 5.3 Ghidra Headless Analysis

**Script**: `/opt/analysis/scripts/ghidra_batch.sh`

```bash
#!/bin/bash
# ghidra_batch.sh - Batch analyze with Ghidra

GHIDRA_HOME="/opt/tools/ghidra_11.3_PUBLIC_20250115"
PROJECT_DIR="/opt/analysis/ghidra_projects"
BINARY_DIR="/opt/analysis/cisco-binaries"
PROJECT_NAME="CiscoBatchAnalysis"

# Create project if not exists
if [ ! -d "$PROJECT_DIR/$PROJECT_NAME" ]; then
    "$GHIDRA_HOME/support/analyzeHeadless" \
      "$PROJECT_DIR" \
      "$PROJECT_NAME" \
      -create
fi

# Import and analyze all binaries
find "$BINARY_DIR" -type f -executable | while read -r binary; do
    echo "[*] Importing: $binary"

    "$GHIDRA_HOME/support/analyzeHeadless" \
      "$PROJECT_DIR" \
      "$PROJECT_NAME" \
      -import "$binary" \
      -postScript ExportFunctions.java \
      -scriptPath /opt/analysis/ghidra_scripts \
      -overwrite
done

echo "[✓] Batch import complete"
```

**Export Script**: `/opt/analysis/ghidra_scripts/ExportFunctions.java`

```java
// ExportFunctions.java
// Export all functions to JSON

import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.*;
import ghidra.program.model.address.*;
import java.io.*;
import org.json.*;

public class ExportFunctions extends GhidraScript {
    public void run() throws Exception {
        JSONObject results = new JSONObject();
        JSONArray functions = new JSONArray();

        FunctionManager funcMgr = currentProgram.getFunctionManager();
        FunctionIterator iter = funcMgr.getFunctions(true);

        while (iter.hasNext() && !monitor.isCancelled()) {
            Function func = iter.next();

            JSONObject funcObj = new JSONObject();
            funcObj.put("name", func.getName());
            funcObj.put("address", func.getEntryPoint().toString());
            funcObj.put("size", func.getBody().getNumAddresses());
            funcObj.put("callers", func.getCallingFunctions(monitor).size());
            funcObj.put("callees", func.getCalledFunctions(monitor).size());

            functions.put(funcObj);
        }

        results.put("binary", currentProgram.getName());
        results.put("functions", functions);

        // Save to file
        String outputPath = currentProgram.getExecutablePath() + ".json";
        FileWriter writer = new FileWriter(outputPath);
        writer.write(results.toString(2));
        writer.close();

        println("Exported " + functions.length() + " functions to " + outputPath);
    }
}
```

---

### 5.4 Result Aggregation

**Script**: `/opt/analysis/scripts/aggregate_results.py`

```python
#!/usr/bin/env python3
# aggregate_results.py - Aggregate all analysis results

import json
import glob
import sys
from pathlib import Path

def aggregate_results(output_dir):
    """Aggregate all JSON results into database"""

    results_files = glob.glob(f"{output_dir}/**/*.json", recursive=True)

    all_binaries = []
    all_functions = []
    all_strings = []

    for result_file in results_files:
        try:
            with open(result_file, 'r') as f:
                data = json.load(f)

            binary_name = Path(data.get('binary', result_file)).name

            all_binaries.append({
                'name': binary_name,
                'function_count': len(data.get('functions', [])),
                'string_count': len(data.get('strings', [])),
                'import_count': len(data.get('imports', [])),
            })

            # Aggregate functions
            for func in data.get('functions', []):
                all_functions.append({
                    'binary': binary_name,
                    'name': func['name'],
                    'address': func['address'],
                    'size': func.get('size', 0),
                })

            # Aggregate interesting strings
            for s in data.get('strings', []):
                value = s['value'].lower()
                if any(keyword in value for keyword in
                       ['otp', 'totp', 'auth', 'token', 'secret', 'cstp', 'dtls']):
                    all_strings.append({
                        'binary': binary_name,
                        'address': s['address'],
                        'value': s['value'],
                    })

        except Exception as e:
            print(f"[!] Error processing {result_file}: {e}", file=sys.stderr)

    # Generate summary report
    summary = {
        'total_binaries': len(all_binaries),
        'total_functions': len(all_functions),
        'total_interesting_strings': len(all_strings),
        'binaries': all_binaries,
        'interesting_functions': [
            f for f in all_functions
            if any(kw in f['name'].lower() for kw in
                   ['otp', 'totp', 'auth', 'token', 'verify', 'cstp', 'dtls'])
        ][:100],  # Top 100
        'interesting_strings': all_strings[:200],  # Top 200
    }

    # Save aggregated results
    output_file = f"{output_dir}/aggregated_results.json"
    with open(output_file, 'w') as f:
        json.dump(summary, f, indent=2)

    print(f"[✓] Aggregated results: {output_file}")
    print(f"    Total binaries: {summary['total_binaries']}")
    print(f"    Total functions: {summary['total_functions']}")
    print(f"    Interesting strings: {summary['total_interesting_strings']}")

if __name__ == '__main__':
    aggregate_results('/opt/analysis/output')
```

---

### 5.5 CI/CD Integration

**GitHub Actions Workflow**: `.github/workflows/re-analysis.yml`

```yaml
name: Reverse Engineering Analysis

on:
  push:
    paths:
      - 'binaries/**'
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday

jobs:
  analyze:
    runs-on: self-hosted  # Use self-hosted runner with IDA Pro license

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Run batch analysis
        run: |
          /opt/analysis/scripts/batch_analyze_ida.sh
          /opt/analysis/scripts/aggregate_results.py

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: analysis-results
          path: /opt/analysis/output/aggregated_results.json

      - name: Check for new functions
        run: |
          python3 /opt/analysis/scripts/check_new_functions.py \
            --baseline analysis-results/previous.json \
            --current analysis-results/aggregated_results.json

      - name: Generate report
        run: |
          python3 /opt/analysis/scripts/generate_markdown_report.py \
            analysis-results/aggregated_results.json \
            > docs/analysis-report.md

      - name: Commit report
        run: |
          git config user.name "RE Bot"
          git config user.email "re-bot@wolfguard.dev"
          git add docs/analysis-report.md
          git commit -m "docs: Update RE analysis report [skip ci]"
          git push
```

---

## 6. Documentation Standards

### 6.1 Analysis Journal

**Location**: `/opt/analysis/journal/YYYY-MM-DD_feature_name.md`

**Template**:
```markdown
# Reverse Engineering Session: [Feature Name]

**Date**: YYYY-MM-DD
**Engineer**: [Your Name]
**Binary**: vpnagentd v5.1.12.146
**Goal**: Understand TOTP authentication flow

---

## Session Overview

**Duration**: 4 hours
**Tools Used**: IDA Pro 9.2, angr
**Confidence Level**: High (95%)

**Summary**: Analyzed TOTP generation and verification functions.
Confirmed RFC 6238 compliance with 30-second time step.
Implementation uses HMAC-SHA1 with constant-time comparison.

---

## Analysis Steps

### 1. Function Identification (30 min)

Located target function via string reference:
- String: "Invalid OTP code" @ 0x00508a10
- Cross-reference from: FUN_00426120

Renamed function: `vpn_totp_verify`

### 2. Decompilation (2 hours)

**Initial pseudocode** (IDA Pro):
```c
// [Paste decompiled code]
```

**Annotations**:
- Parameter 1 (RDI): Base32-encoded secret string
- Parameter 2 (RSI): User-provided 6-digit code string
- Return: 0 on success, -1 on failure

**Called functions**:
- `base32_decode @ 0x00426c10`: Convert Base32 to binary
- `vpn_totp_generate @ 0x00425f80`: Generate expected code
- `cisco_constant_time_compare @ 0x00426f50`: Secure comparison

### 3. Security Analysis (1 hour)

**Findings**:
- ✅ Uses constant-time comparison (timing attack resistant)
- ✅ Validates ±1 time step (60-second window total)
- ✅ Proper input validation (null checks, length checks)
- ⚠️ Uses SHA-1 (legacy, but RFC 6238 standard)

**angr validation**:
```
[*] Explored 1244 paths
[*] Found 0 authentication bypass paths
[✓] SECURE: No bypasses detected
```

### 4. Algorithm Reconstruction (30 min)

**TOTP Algorithm** (RFC 6238):
1. Counter = floor(timestamp / 30)
2. HMAC = HMAC-SHA1(secret, counter_bigendian)
3. Offset = HMAC[19] & 0x0F
4. Code = (HMAC[offset:offset+4] & 0x7FFFFFFF) % 1000000

**Verified against RFC test vectors**: PASS

---

## Key Findings

1. **TOTP Time Step**: 30 seconds (standard)
2. **Hash Algorithm**: HMAC-SHA1 (not SHA-256)
3. **Time Window**: ±30 seconds (3 valid codes at any time)
4. **Security**: Constant-time comparison implemented correctly

---

## Implementation Notes

**For WolfGuard**:
- Use wolfCrypt's `wc_Hmac*` functions
- Implement same 30-second time step
- Use `wolfssl_constant_time_compare()` or implement own
- Add unit tests with RFC 6238 vectors

**Code location**: `src/auth/totp.c`

---

## Questions / Follow-up

- [ ] Why SHA-1 instead of SHA-256? (Answer: RFC 6238 default, backward compatibility)
- [ ] Is rate limiting implemented? (Answer: Yes, at session layer, not in TOTP function)
- [ ] Are there vendor-specific extensions? (Answer: No, standard RFC 6238)

---

## References

- RFC 6238: TOTP: Time-Based One-Time Password Algorithm
- Cisco Secure Client v5.1.12.146 vpnagentd binary
- IDA Pro project: /opt/analysis/ghidra_projects/CiscoSecureClient
```

---

### 6.2 Function Documentation Format

**Header Comment Style**:
```c
/**
 * @brief Generate TOTP code per RFC 6238
 *
 * @details
 * Implements Time-Based One-Time Password (TOTP) algorithm using HMAC-SHA1.
 * Generates 6-digit code valid for 30-second time window.
 *
 * @param[in]  secret      Secret key in binary format (not Base32)
 * @param[in]  secret_len  Length of secret (typically 16-32 bytes)
 * @param[in]  timestamp   Unix timestamp (seconds since epoch)
 * @param[out] code        Pointer to store 6-digit code (as uint32_t)
 *
 * @return 0 on success, negative error code on failure
 * @retval 0                Success
 * @retval -EINVAL          Invalid parameters (NULL pointers, bad length)
 * @retval -ECRYPTOFAILURE  wolfCrypt HMAC operation failed
 *
 * @note Thread-safe: Yes (no shared state)
 * @note Reverse engineered from: Cisco Secure Client 5.1.12.146 @ 0x00425f80
 * @note RFC compliance: RFC 6238 (TOTP), RFC 4226 (HOTP base)
 *
 * @see totp_verify() for validation with time window
 * @see base32_decode() for converting Base32 secrets
 *
 * @example
 * @code
 * uint8_t secret[] = {0x31,0x32,...};  // Binary secret
 * uint32_t code;
 * int ret = totp_generate(secret, sizeof(secret), time(NULL), &code);
 * if (ret == 0) {
 *     printf("TOTP: %06u\n", code);
 * }
 * @endcode
 */
[[nodiscard]] int
totp_generate(const uint8_t *secret, size_t secret_len,
              time_t timestamp, uint32_t *code);
```

---

### 6.3 Struct Documentation

**Struct Definition with Annotations**:
```c
/**
 * @struct vpn_session
 * @brief VPN session context structure
 *
 * @details
 * Reverse engineered from Cisco Secure Client libvpnapi.so @ offset 0x1000.
 * This structure tracks state for an active VPN session including
 * authentication tokens, TLS context, and configuration.
 *
 * @note Size: 0x130 bytes (304 bytes)
 * @note Alignment: 8 bytes
 * @note Reverse engineered: 2025-10-29 using IDA Pro 9.2
 */
typedef struct vpn_session {
    /**
     * @brief Unique session identifier
     *
     * @offset +0x00
     * @size 4 bytes
     * @note Generated by server, sent in X-CSTP-Session-ID header
     */
    uint32_t session_id;

    /**
     * @brief Padding for 8-byte alignment
     *
     * @offset +0x04
     * @size 4 bytes
     * @note Compiler-inserted padding (not used by code)
     */
    uint8_t _pad1[4];

    /**
     * @brief Pointer to authentication token
     *
     * @offset +0x08
     * @size 8 bytes (pointer)
     * @note Token format: Base64-encoded random bytes (32-48 bytes)
     * @note Freed by vpn_session_destroy()
     */
    uint8_t *session_token;

    /**
     * @brief Session creation time
     *
     * @offset +0x10
     * @size 8 bytes
     * @note Unix timestamp (seconds since epoch)
     * @note Set by vpn_session_create() using time()
     */
    uint64_t created_time;

    /**
     * @brief Session expiration time
     *
     * @offset +0x18
     * @size 8 bytes
     * @note Unix timestamp, calculated as created_time + session_timeout
     * @note Default timeout: 86400 seconds (24 hours)
     */
    uint64_t expire_time;

    /**
     * @brief Authenticated username
     *
     * @offset +0x20
     * @size 256 bytes (fixed-size buffer)
     * @note Null-terminated string
     * @note Maximum username length: 255 characters
     * @note Populated by vpn_authenticate_user()
     */
    char username[256];

    /**
     * @brief Pointer to TLS/DTLS context
     *
     * @offset +0x120
     * @size 8 bytes (pointer)
     * @note Points to tls_context_t structure
     * @note Initialized by vpn_tls_init()
     */
    struct tls_context *tls_ctx;

    /**
     * @brief Path MTU for tunnel
     *
     * @offset +0x128
     * @size 2 bytes
     * @note Default: 1400 bytes
     * @note Adjustable via X-CSTP-MTU header
     */
    uint16_t mtu;

    /**
     * @brief Padding for 4-byte alignment
     *
     * @offset +0x12A
     * @size 2 bytes
     */
    uint8_t _pad2[2];

    /**
     * @brief Session flags bitfield
     *
     * @offset +0x12C
     * @size 4 bytes
     * @note See VPN_SESSION_FLAG_* defines
     */
    uint32_t flags;

    /* Total size: 0x130 bytes (304 bytes) */
} vpn_session_t;

/**
 * @defgroup session_flags Session Flags
 * @{
 */

/** @brief DTLS enabled for data channel */
#define VPN_SESSION_FLAG_DTLS_ENABLED    (1U << 0)

/** @brief IPv6 tunnel enabled */
#define VPN_SESSION_FLAG_IPV6_ENABLED    (1U << 1)

/** @brief Split tunneling active */
#define VPN_SESSION_FLAG_SPLIT_TUNNEL    (1U << 2)

/** @brief OTP verification completed */
#define VPN_SESSION_FLAG_OTP_VERIFIED    (1U << 3)

/** @brief Compression enabled (LZS) */
#define VPN_SESSION_FLAG_COMPRESSION     (1U << 4)

/** @} */
```

---

### 6.4 Protocol Documentation

**Packet Format Specification**:
```markdown
## X-CSTP-Session-Config Packet Format

**Protocol**: CSTP (Cisco SSL Tunnel Protocol)
**Direction**: Server → Client
**Phase**: Post-authentication, pre-tunnel
**Reverse Engineered From**: Cisco Secure Client 5.1.12.146

---

### Packet Structure

```
+-------------------+
|  HTTP/1.1 200 OK |
+-------------------+
|    Headers        |
| (Key: Value)      |
+-------------------+
|  [Empty Body]     |
+-------------------+
```

### Required Headers

| Header | Type | Example | Description |
|--------|------|---------|-------------|
| `X-CSTP-Version` | Integer | `1` | Protocol version (always 1) |
| `X-CSTP-Session-ID` | Hex String | `7f3a2b1c` | Unique 32-bit session ID |
| `X-CSTP-Address` | IPv4 | `192.168.1.100` | Assigned tunnel IP |
| `X-CSTP-Netmask` | IPv4 | `255.255.255.0` | Tunnel subnet mask |
| `X-CSTP-MTU` | Integer | `1400` | Maximum packet size |
| `X-CSTP-Keepalive` | Integer | `20` | Keepalive interval (seconds) |
| `X-CSTP-DPD` | Integer | `30` | Dead Peer Detection interval |

### Optional Headers

| Header | Type | Example | Description |
|--------|------|---------|-------------|
| `X-CSTP-Address-IP6` | IPv6 | `2001:db8::1` | IPv6 tunnel address |
| `X-CSTP-Split-Include` | CIDR | `10.0.0.0/8` | Split tunnel networks |
| `X-CSTP-Split-Exclude` | CIDR | `192.168.0.0/16` | Exclude from tunnel |
| `X-CSTP-DNS` | IPv4 | `8.8.8.8` | DNS server |
| `X-CSTP-Default-Domain` | String | `example.com` | DNS search domain |
| `X-CSTP-Banner` | String | `Welcome to VPN` | Login banner text |
| `X-DTLS-Session-ID` | Hex String | `a1b2c3d4` | DTLS session identifier |
| `X-DTLS-Port` | Integer | `443` | UDP port for DTLS |
| `X-DTLS-Keepalive` | Integer | `30` | DTLS keepalive interval |

### Example Packet

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
X-CSTP-Version: 1
X-CSTP-Session-ID: 7f3a2b1c
X-CSTP-Address: 192.168.1.100
X-CSTP-Netmask: 255.255.255.0
X-CSTP-Address-IP6: 2001:db8:0:1::100
X-CSTP-MTU: 1400
X-CSTP-Base-MTU: 1500
X-CSTP-Keepalive: 20
X-CSTP-DPD: 30
X-CSTP-Split-Include: 10.0.0.0/8
X-CSTP-Split-Include: 172.16.0.0/12
X-CSTP-DNS: 8.8.8.8
X-CSTP-DNS: 8.8.4.4
X-CSTP-Default-Domain: corp.example.com
X-CSTP-Banner: Welcome to Corporate VPN\n\nAuthorized users only.
X-DTLS-Session-ID: a1b2c3d4e5f6
X-DTLS-Port: 443
X-DTLS-Keepalive: 30
X-DTLS-MTU: 1380
Content-Length: 0

```

### State Machine

```
┌──────────────┐
│ HTTP CONNECT │
│   Request    │
└──────┬───────┘
       │
       v
┌──────────────┐
│ Authenticate │
│   (SAML/OTP) │
└──────┬───────┘
       │
       v
┌──────────────┐
│ Receive      │
│ Session-Cfg  │  ← This packet
└──────┬───────┘
       │
       v
┌──────────────┐
│ Establish    │
│ DTLS (opt)   │
└──────┬───────┘
       │
       v
┌──────────────┐
│ Data Transfer│
│   (Tunnel)   │
└──────────────┘
```

### Implementation Notes

**Parsing Logic** (WolfGuard):
```c
int parse_cstp_session_config(http_response_t *resp, vpn_session_t *session)
{
    // Parse required headers
    session->session_id = parse_hex_header(resp, "X-CSTP-Session-ID");
    inet_pton(AF_INET, get_header(resp, "X-CSTP-Address"), &session->tunnel_ipv4);

    // Parse optional headers
    if (has_header(resp, "X-CSTP-Address-IP6")) {
        inet_pton(AF_INET6, get_header(resp, "X-CSTP-Address-IP6"),
                  &session->tunnel_ipv6);
        session->flags |= VPN_SESSION_FLAG_IPV6_ENABLED;
    }

    // Parse split tunnel networks
    parse_split_includes(resp, session);

    return 0;
}
```

**Security Considerations**:
- Session ID must be unpredictable (secure random source)
- Banner text should be sanitized (no HTML/JS injection)
- MTU must be validated (min 576, max 1500)
- Split-include networks must not conflict with local routes

---

### References

- [OpenConnect Protocol Specification](https://www.infradead.org/openconnect/protocol.html)
- Cisco Secure Client 5.1.12.146: `libvpnapi.so` @ function `parse_cstp_headers` (0x00423f80)
- RFC 2616 (HTTP/1.1)
```

---

## 7. Quality Assurance

### 7.1 Verification Checklist

Before marking analysis as "complete", verify:

**Static Analysis**:
- [ ] Decompiled code reviewed in 2+ tools (e.g., IDA + Ghidra)
- [ ] All function parameters identified and documented
- [ ] All struct offsets cross-validated with memory accesses
- [ ] Called functions traced to external libraries or internal implementation
- [ ] Constants identified (magic numbers, crypto constants)

**Dynamic Analysis**:
- [ ] Function executed in controlled environment
- [ ] Inputs and outputs observed and logged
- [ ] Side effects documented (file writes, network calls)
- [ ] Edge cases tested (NULL inputs, boundary values)

**Security Review**:
- [ ] No authentication bypasses found (validated with angr or manual review)
- [ ] Bounds checking present for all buffer operations
- [ ] Constant-time comparisons used for secrets
- [ ] Integer overflow checks present
- [ ] No obvious side-channel vulnerabilities

**RFC Compliance**:
- [ ] Algorithm matches published RFC (if applicable)
- [ ] Test vectors from RFC validated against implementation
- [ ] Deviations from RFC documented with reasoning

**Implementation**:
- [ ] C23 code compiles without warnings (`-Wall -Wextra -Werror`)
- [ ] Unit tests created with >90% code coverage
- [ ] Integration test passes with OpenConnect client
- [ ] Compatibility test passes with Cisco Secure Client
- [ ] Memory safety validated with Valgrind (no leaks, no errors)

---

### 7.2 Cross-Validation Strategy

**Three-Tool Rule**: Critical findings must be validated by 3 different tools/methods:

**Example: TOTP Time Window**

1. **IDA Pro Static Analysis**:
   ```c
   // Decompiled code shows:
   counter_past = timestamp / 30 - 1;
   counter_current = timestamp / 30;
   counter_future = timestamp / 30 + 1;
   // → ±30 second window (±1 step)
   ```

2. **angr Symbolic Execution**:
   ```python
   # Explore all successful authentication paths
   simgr.explore(find=SUCCESS_ADDR)
   timestamps = [state.solver.eval(timestamp_sym) for state in simgr.found]
   steps = set(t // 30 for t in timestamps)
   assert max(steps) - min(steps) == 2  # ±1 step
   # → Confirmed: ±1 time step
   ```

3. **Dynamic Testing**:
   ```bash
   # Test with real Cisco client
   SECRET="JBSWY3DPEHPK3PXP"

   # Current time code
   CODE_NOW=$(oathtool --totp --base32 "$SECRET")
   # → Accepted ✓

   # Code from 60 seconds ago (-2 steps)
   CODE_OLD=$(oathtool --totp --base32 --now="$(date -d '-60 seconds' +%s)" "$SECRET")
   # → Rejected ✗

   # → Confirmed: exactly ±1 step (30 sec) window
   ```

**Result**: High confidence (95%+) - Cross-validated by 3 independent methods

---

### 7.3 Confidence Level Assessment

**High Confidence (95%+)**:
- Decompiled code matches RFC specification exactly
- Validated by 3+ tools/methods
- Dynamic testing confirms behavior
- No ambiguities or unknowns

**Medium Confidence (70-95%)**:
- Decompiled code makes logical sense
- Validated by 2 tools
- Some minor unknowns (e.g., specific magic number meaning)
- Partial dynamic testing

**Low Confidence (&lt;70%)**:
- Single tool analysis only
- Heavily obfuscated code
- Many unknowns or assumptions
- No dynamic validation possible

**Documentation Requirement**:
```c
/**
 * @brief Parse X-CSTP-MTU header
 *
 * @confidence HIGH (98%)
 * @validation
 * - IDA Pro decompilation: Parses header string, converts to integer
 * - Dynamic testing: Observed MTU values 1280-1500 accepted
 * - RFC compliance: No specific RFC, follows HTTP header convention
 *
 * @note Confidence reduced from 100% to 98% due to unclear handling
 *       of malformed input (negative values, non-numeric strings)
 */
int parse_cstp_mtu_header(const char *value);
```

---

### 7.4 Regression Testing

**Purpose**: Ensure new Cisco versions don't break our implementation

**Strategy**:
1. **Baseline Analysis**: Complete analysis of version 5.1.12.146
2. **Delta Analysis**: When new version (e.g., 5.1.13.x) released:
   - Run batch analysis on new binaries
   - Use radare2 radiff2 or IDA BinDiff to identify changed functions
   - Focus on changed functions only (not full re-analysis)
   - Update WolfGuard code if protocol changed

**Automation**:
```bash
#!/bin/bash
# compare_versions.sh - Identify differences between versions

OLD_VERSION="5.1.12.146"
NEW_VERSION="5.1.13.100"

OLD_BINARY="/opt/binaries/cisco-$OLD_VERSION/vpnagentd"
NEW_BINARY="/opt/binaries/cisco-$NEW_VERSION/vpnagentd"

# Binary diff with radare2
radiff2 -AC "$OLD_BINARY" "$NEW_BINARY" > version_diff.txt

# Extract changed functions
grep "MATCH" version_diff.txt | awk '{print $2}' > changed_functions.txt

echo "[*] Changed functions:"
cat changed_functions.txt

echo "[*] Next steps:"
echo "    1. Analyze changed functions in IDA Pro"
echo "    2. Check if protocol changes affect WolfGuard"
echo "    3. Update C23 implementation if needed"
echo "    4. Re-run integration tests"
```

**Radare2 Diff Workflow**:
```bash
#!/bin/bash
# compare_versions_r2.sh - radare2 binary diff

OLD_BINARY="/opt/binaries/cisco-5.1.12.146/vpnagentd"
NEW_BINARY="/opt/binaries/cisco-5.1.13.100/vpnagentd"

echo "[*] Running radare2 binary diff analysis"

# Function-level diff
radiff2 -AC "$OLD_BINARY" "$NEW_BINARY" > version_diff_detailed.txt

# Graph diff (visual similarity)
radiff2 -g main "$OLD_BINARY" "$NEW_BINARY" > main_func_diff.dot

# Code distance analysis
radiff2 -C "$OLD_BINARY" "$NEW_BINARY" | head -50

# Extract changed functions
echo "[*] Changed functions:"
grep -E "^0x[0-9a-f]+ " version_diff_detailed.txt | \
  awk '{print $1, $2}' | \
  head -20

echo "[✓] Diff complete. Review version_diff_detailed.txt for full analysis"
```

---

## 8. Security Considerations

### 8.1 Safe Analysis Environment

**Principle**: Assume all binaries are potentially malicious

**Sandbox Setup**:
```bash
# Option 1: Podman container (recommended)
podman run --rm -it \
  --network=none \
  --cap-drop=ALL \
  --security-opt=no-new-privileges \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=1G \
  -v /opt/binaries:/binaries:ro \
  -v /opt/analysis:/analysis:rw \
  oraclelinux:9 bash

# Option 2: VM with snapshot
# Create snapshot before analysis, revert after
virsh snapshot-create-as analysis-vm pre-analysis
# ... perform analysis ...
virsh snapshot-revert analysis-vm pre-analysis
```

**Resource Limits**:
```bash
# Limit CPU and memory
podman run --cpus=4 --memory=8g ...

# Set timeout for long-running tools
timeout 3600 /opt/ida/idat64 -A binary.elf
```

---

### 8.2 Malware Detection

**Pre-Analysis Scanning**:
```bash
#!/bin/bash
# scan_binary.sh - Scan binary before analysis

BINARY="$1"

echo "[*] Scanning: $BINARY"

# ClamAV scan
clamscan --infected --remove=no "$BINARY"
if [ $? -eq 1 ]; then
    echo "[!] MALWARE DETECTED - Abort analysis"
    exit 1
fi

# Check for suspicious characteristics
# - Packed/obfuscated
# - High entropy (compressed/encrypted)
# - Unusual sections

ENTROPY=$(ent "$BINARY" | grep "Entropy" | awk '{print $3}')
if (( $(echo "$ENTROPY > 7.5" | bc -l) )); then
    echo "[⚠️] High entropy detected ($ENTROPY) - possible packing/encryption"
fi

# Check for known packers
strings "$BINARY" | grep -iE "upx|vmprotect|themida"
if [ $? -eq 0 ]; then
    echo "[⚠️] Packer detected - requires unpacking first"
fi

echo "[✓] Pre-analysis scan complete"
```

---

### 8.3 Data Handling

**Sensitive Data**:
- Session tokens
- Private keys
- User credentials
- API keys

**Protection**:
```bash
# Encrypt analysis results containing secrets
tar czf analysis_results.tar.gz /opt/analysis/output/
gpg --encrypt --recipient re-team@wolfguard.dev analysis_results.tar.gz
shred -n 3 -z analysis_results.tar.gz

# Never commit secrets to Git
echo "*.key" >> .gitignore
echo "*.pem" >> .gitignore
echo "*_secret*" >> .gitignore
```

---

### 8.4 Network Isolation

**Dynamic Analysis Network Setup**:
```bash
# Create isolated network for analysis
podman network create --internal analysis-net

# Run binary in isolated container
podman run --network=analysis-net \
  -v /opt/binaries:/binaries:ro \
  analysis-container ./vpnagentd

# Run Wireshark capture on host
tcpdump -i br-analysis-net -w capture.pcap
```

**FakeNet Simulation** (for Windows analysis):
```powershell
# Simulate network services to observe binary behavior
FakeNet.exe --config fakenet.xml
```

---

## 9. Legal and Ethical Guidelines

### 9.1 DMCA Section 1201(f) Compliance

**Legal Basis**: Reverse engineering for interoperability is permitted under DMCA §1201(f)

**Requirements**:
1. **Legitimate Access**: Must have legal license to analyzed software
2. **Interoperability Purpose**: Goal is creating compatible implementation
3. **Independent Creation**: Implementation written from understanding, not copied code
4. **No Tool Distribution**: RE tools and findings remain internal to team

**Documentation**:
```markdown
# Legal Compliance Record

**Project**: WolfGuard OpenConnect Server
**Analysis Date**: 2025-10-30
**Analyzed Software**: Cisco Secure Client 5.1.12.146
**License**: Enterprise license #CSC-2025-12345

**Purpose Statement**:
The reverse engineering of Cisco Secure Client is conducted solely for
the purpose of creating an interoperable VPN server implementation.
The goal is to enable compatibility with Cisco Secure Client while
implementing our own independent codebase.

**Methodology**:
1. Analysis team identifies functionality and protocols
2. Findings documented in technical specifications
3. Implementation team codes from specifications (clean room)
4. No source code or proprietary binaries distributed

**Legal Review**: Approved by Legal Counsel on 2025-10-15
**Counsel**: Jane Doe, Esq. (jane.doe@wolfguard-legal.com)
```

---

### 9.2 Clean Room Methodology

**Separation of Concerns**:
- **Analysis Team**: Reverse engineers who study Cisco binaries
- **Implementation Team**: Developers who write WolfGuard code
- **Specification Team**: Technical writers who create protocol docs

**Workflow**:
```
┌─────────────────┐
│ Analysis Team   │  ← Studies Cisco binaries
│                 │  ← Uses IDA Pro, Ghidra
│  (3 engineers)  │  ← Documents findings
└────────┬────────┘
         │
         │ Technical Specifications
         │ (Protocol docs, RFC references)
         v
┌─────────────────┐
│ Specification   │  ← Reviews analysis findings
│ Team            │  ← Creates neutral protocol docs
│  (2 writers)    │  ← No references to Cisco code
└────────┬────────┘
         │
         │ Implementation Specs
         │ (API designs, state machines)
         v
┌─────────────────┐
│ Implementation  │  ← Reads specs only (not analysis)
│ Team            │  ← Writes C23 code from scratch
│  (5 developers) │  ← Never sees Cisco binaries
└─────────────────┘
```

**Physical Separation**:
- Analysis team: Office A, workstations with IDA Pro
- Implementation team: Office B, workstations with compilers only
- No shared Git repositories containing both analysis and code

---

### 9.3 Acceptable Use Policy

**Permitted Activities**:
- Analyzing Cisco Secure Client binaries for interoperability
- Documenting protocol behavior and data structures
- Implementing compatible server from understanding
- Sharing findings within WolfGuard team

**Prohibited Activities**:
- Distributing Cisco binaries or modified versions
- Sharing analysis tools (IDA Pro databases, Ghidra projects) publicly
- Copying Cisco code verbatim into WolfGuard
- Circumventing license checks or DRM
- Creating Cisco-compatible clients (only server-side)

**Incident Response**:
If unauthorized distribution occurs:
1. Immediately remove distributed materials
2. Notify legal counsel
3. Review access logs to identify source
4. Implement additional access controls

---

## 10. Tool-Specific Workflows

### 10.1 IDA Pro Workflow

**Step-by-Step Guide**:

1. **Installation** (see [IDA Pro Setup Guide](./tools/ida-pro-setup.md)):
```bash
# Extract installer
cd /opt/software/IDA_Pro_9.2.250908/installers
chmod +x ida-pro_92_x64linux.run

# Run installer
sudo ./ida-pro_92_x64linux.run --prefix=/opt/ida-9.2 --mode unattended

# Verify installation
/opt/ida-9.2/idat64 --help
```

2. **Project Setup**:
```bash
# Create project directory
mkdir -p /opt/analysis/ida_projects/cisco_secure_client

# Launch IDA
/opt/ida-9.2/ida64 &

# In IDA GUI:
# File → Open → Select vpnagentd
# Analysis Options → Select all → OK
# Wait for auto-analysis (30-60 minutes)
```

3. **Navigation**:
```
Function list: View → Open subviews → Functions (Shift+F3)
Strings: View → Open subviews → Strings (Shift+F12)
Cross-references: Right-click function → Jump to xref to operand (X)
```

4. **Decompilation**:
```
Press F5 in disassembly view → Hex-Rays decompiler opens
Right-click variable → Rename (N)
Right-click function → Edit function signature
Add comment: ; (semicolon) or Insert key
```

5. **Export Results**:
```python
# IDA Python script: export_functions.py
import idaapi
import json

functions = []
for func_ea in idautils.Functions():
    func_name = idc.get_func_name(func_ea)
    functions.append({
        'name': func_name,
        'address': hex(func_ea),
    })

with open('/opt/analysis/ida_output/functions.json', 'w') as f:
    json.dump(functions, f, indent=2)
```

6. **Batch Processing**:
```bash
# Headless analysis
/opt/ida-9.2/idat64 \
  -A \
  -S/opt/analysis/scripts/export_functions.py \
  -L/opt/analysis/logs/ida_vpnagentd.log \
  /opt/binaries/vpnagentd
```

---

### 10.2 Ghidra Workflow

**Detailed Guide** (see [DECOMPILATION_WORKFLOW.md](../../cisco-secure-client/analysis/DECOMPILATION_WORKFLOW.md)):

1. **Project Creation**:
```bash
cd /opt/tools/ghidra
./ghidraRun

# In GUI:
# File → New Project
# Project Type: Non-Shared
# Project Directory: /opt/analysis/ghidra_projects
# Project Name: CiscoSecureClient
```

2. **Import Binary**:
```
File → Import File → Select vpnagentd
Format: ELF (auto-detected)
Language: x86:LE:64:default
Click OK

# Analysis dialog appears
Enable: All recommended analyzers
Disable: Non-Returning Functions (slow)
Click Analyze
```

3. **Navigation**:
```
Symbol Tree: Window → Symbol Tree (Ctrl+T)
Function Graph: Window → Function Graph
Data Type Manager: Window → Data Type Manager
Script Manager: Window → Script Manager
```

4. **Struct Recovery**:
```
Right-click in Decompiler → Auto Create Structure
Or manually:
Window → Data Type Manager → Right-click → New → Structure
Add fields: Right-click struct → Add → [type]
```

5. **Batch Export Script** (Java):
```java
// ExportAllFunctions.java
// Run via Window → Script Manager

import ghidra.app.script.GhidraScript;
import ghidra.program.model.listing.*;
import java.io.*;
import org.json.*;

public class ExportAllFunctions extends GhidraScript {
    public void run() throws Exception {
        JSONObject results = new JSONObject();
        JSONArray functions = new JSONArray();

        FunctionManager funcMgr = currentProgram.getFunctionManager();
        for (Function func : funcMgr.getFunctions(true)) {
            JSONObject funcObj = new JSONObject();
            funcObj.put("name", func.getName());
            funcObj.put("address", func.getEntryPoint().toString());
            funcObj.put("size", func.getBody().getNumAddresses());
            functions.put(funcObj);
        }

        results.put("functions", functions);

        // Save to file
        String outputPath = currentProgram.getExecutablePath() + ".ghidra.json";
        try (FileWriter writer = new FileWriter(outputPath)) {
            writer.write(results.toString(2));
        }

        println("Exported " + functions.length() + " functions");
    }
}
```

6. **Headless Analysis**:
```bash
$GHIDRA_HOME/support/analyzeHeadless \
  /opt/analysis/ghidra_projects \
  CiscoSecureClient \
  -import /opt/binaries/vpnagentd \
  -postScript ExportAllFunctions.java \
  -scriptPath /opt/analysis/ghidra_scripts
```

---

## 11. Integration with WolfGuard Development

### 11.1 From Analysis to Implementation

**Workflow Bridge**:
```
RE Analysis → Protocol Spec → C23 Implementation → Testing
```

**Example: TOTP Implementation**

1. **Analysis Findings** (from journal):
   - Function: `vpn_totp_generate @ 0x00425f80`
   - Algorithm: HMAC-SHA1, 30-second time step
   - Security: Constant-time comparison
   - RFC: RFC 6238 compliant

2. **Protocol Specification** (`docs/protocols/totp.md`):
```markdown
# TOTP Authentication Protocol

## Algorithm
- Hash: HMAC-SHA1
- Time Step: 30 seconds
- Code Length: 6 digits
- Window: ±30 seconds (±1 step)

## Implementation Requirements
- Use wolfCrypt HMAC functions
- Implement constant-time comparison
- Validate input lengths
- Support Base32 secret decoding
```

3. **C23 Implementation** (`src/auth/totp.c`):
```c
#include <wolfssl/wolfcrypt/hmac.h>
#include "auth/totp.h"

uint32_t wolfguard_totp_generate(const uint8_t *secret,
                                  size_t secret_len,
                                  time_t timestamp) {
    // [Implementation as shown in Stage 5]
}
```

4. **Unit Tests** (`tests/unit/test_totp.c`):
```c
void test_rfc6238_vectors(void) {
    // [Test cases as shown in Stage 6]
}
```

5. **Integration** (`src/auth/auth_handler.c`):
```c
int authenticate_user_with_totp(const char *username,
                                 const char *otp_code) {
    // 1. Lookup user's TOTP secret from database
    uint8_t secret[64];
    size_t secret_len = get_user_totp_secret(username, secret);

    // 2. Generate expected code
    time_t now = time(NULL);
    uint32_t expected = wolfguard_totp_generate(secret, secret_len, now);

    // 3. Parse user input
    uint32_t provided = parse_otp_code(otp_code);

    // 4. Constant-time compare
    if (constant_time_equal(&expected, &provided, sizeof(uint32_t))) {
        return AUTH_SUCCESS;
    }

    return AUTH_FAILURE;
}
```

---

### 11.2 wolfSSL/wolfCrypt Integration

**Mapping Cisco Crypto to wolfCrypt**:

| Cisco Function | wolfCrypt Equivalent | Notes |
|----------------|---------------------|-------|
| `cisco_hmac_sha1()` | `wc_HmacSetKey()` + `wc_HmacUpdate()` + `wc_HmacFinal()` | HMAC-SHA1 |
| `cisco_aes_encrypt()` | `wc_AesSetKey()` + `wc_AesCbcEncrypt()` | AES-CBC |
| `cisco_sha256()` | `wc_Sha256Update()` + `wc_Sha256Final()` | SHA-256 |
| `cisco_rsa_verify()` | `wc_RsaSSL_Verify()` | RSA signature verification |
| `cisco_ecdh_compute()` | `wc_ecc_shared_secret()` | ECDH key agreement |

**Example Conversion**:

**Cisco Code** (decompiled):
```c
void cisco_hmac_sha1(uint8_t *out, const uint8_t *secret,
                     size_t secret_len, uint64_t counter) {
    // ... proprietary HMAC implementation ...
}
```

**WolfGuard Code**:
```c
int wolfguard_hmac_sha1(uint8_t *out, const uint8_t *secret,
                        size_t secret_len, uint64_t counter) {
    Hmac hmac;
    uint8_t counter_be[8];

    // Convert counter to big-endian
    for (int i = 7; i >= 0; i--) {
        counter_be[i] = (uint8_t)(counter & 0xFF);
        counter >>= 8;
    }

    // wolfCrypt HMAC-SHA1
    int ret = wc_HmacSetKey(&hmac, WC_SHA, secret, (word32)secret_len);
    if (ret != 0) {
        return -1;
    }

    wc_HmacUpdate(&hmac, counter_be, sizeof(counter_be));
    wc_HmacFinal(&hmac, out);

    return 0;
}
```

**wolfCrypt API Documentation**: https://www.wolfssl.com/documentation/manuals/wolfssl/index.html

---

### 11.3 Continuous Analysis

**Goal**: Stay synchronized with new Cisco Secure Client releases

**Monitoring**:
```bash
#!/bin/bash
# monitor_cisco_releases.sh - Check for new versions

CISCO_DOWNLOAD_URL="https://software.cisco.com/download/..."
CURRENT_VERSION="5.1.12.146"

# Check latest version (requires Cisco CCO account)
LATEST_VERSION=$(curl -s "$CISCO_DOWNLOAD_URL" | \
                 grep -oP 'secure-client-linux64-\K[0-9.]+' | \
                 sort -V | tail -1)

if [ "$LATEST_VERSION" != "$CURRENT_VERSION" ]; then
    echo "[!] New version detected: $LATEST_VERSION"
    echo "[*] Triggering analysis pipeline..."

    # Download new version
    wget "$CISCO_DOWNLOAD_URL/secure-client-linux64-$LATEST_VERSION.tar.gz"

    # Extract
    tar xzf "secure-client-linux64-$LATEST_VERSION.tar.gz" -C /opt/binaries/

    # Run delta analysis
    /opt/analysis/scripts/compare_versions.sh \
      /opt/binaries/cisco-$CURRENT_VERSION \
      /opt/binaries/cisco-$LATEST_VERSION

    # Notify team
    send_slack_notification "New Cisco version $LATEST_VERSION released"
else
    echo "[✓] Up to date: $CURRENT_VERSION"
fi
```

**Automated CI/CD** (GitHub Actions):
```yaml
name: Cisco Version Monitor

on:
  schedule:
    - cron: '0 0 * * 1'  # Weekly on Monday

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Check for new version
        run: /opt/analysis/scripts/monitor_cisco_releases.sh

      - name: Run delta analysis if new version found
        if: env.NEW_VERSION_DETECTED == 'true'
        run: |
          /opt/analysis/scripts/batch_analyze_ida.sh
          /opt/analysis/scripts/aggregate_results.py

      - name: Create GitHub issue if protocol changes detected
        if: env.PROTOCOL_CHANGED == 'true'
        run: |
          gh issue create \
            --title "Protocol change in Cisco $NEW_VERSION" \
            --body "Delta analysis detected protocol changes. Review required."
```

---

### 11.4 Documentation Updates

**Bidirectional Flow**:
```
RE Analysis → docs/cisco-secure-client/
            → docs/reference/protocols/
            ← docs/developers/api/

C23 Code   → docs/developers/api/
           → docs/reference/implementation/
```

**Auto-Generated Docs**:
```bash
# Generate API docs from C23 code
doxygen Doxyfile

# Update protocol docs from analysis
python3 /opt/analysis/scripts/generate_protocol_docs.py \
  /opt/analysis/output/aggregated_results.json \
  > docs/reference/protocols/cstp-protocol.md

# Generate comparison table
python3 /opt/analysis/scripts/generate_comparison.py \
  --cisco=/opt/binaries/cisco-5.1.12.146/ \
  --wolfguard=/opt/projects/repositories/wolfguard/build/ \
  > docs/reference/cisco-vs-wolfguard.md
```

---

## 12. Training and Onboarding

### 12.1 New Team Member Checklist

**Week 1: Tool Setup**
- [ ] Install Ghidra 11.3 ([setup guide](./tools/ghidra-setup.md))
- [ ] Install IDA Pro 9.2 ([setup guide](./tools/ida-pro-setup.md))
- [ ] Configure analysis environment (directories, scripts)
- [ ] Complete tutorial: [Beginner RE Tutorial](./tutorials/beginner-re.md)

**Week 2: Guided Analysis**
- [ ] Pair with senior RE engineer
- [ ] Analyze sample binary (pre-selected, well-documented)
- [ ] Document findings in journal format
- [ ] Present findings to team (15-minute presentation)

**Week 3: Independent Analysis**
- [ ] Select function from target list (low-priority)
- [ ] Perform complete analysis (static + dynamic)
- [ ] Implement C23 equivalent
- [ ] Write unit tests
- [ ] Submit for code review

**Week 4: Integration**
- [ ] Participate in protocol design discussion
- [ ] Contribute to batch analysis automation
- [ ] Review peer analysis findings
- [ ] Begin working on medium-priority targets

---

### 12.2 Best Practices

**Time Management**:
- Set time limits per analysis stage (use timers)
- Don't get stuck on single function for &gt;4 hours
- Ask for help early if blocked

**Note-Taking**:
- Use analysis journal template (see Section 6.1)
- Take screenshots of interesting code patterns
- Document questions and assumptions

**Collaboration**:
- Share findings in daily standup (5-minute summary)
- Use team Slack channel for quick questions
- Schedule pair-programming sessions for complex analysis

**Tool Proficiency**:
- Master one tool deeply (IDA Pro or Ghidra) before learning others
- Learn keyboard shortcuts (faster than mouse)
- Customize tool settings for your workflow

---

### 12.3 Common Pitfalls and Solutions

**Pitfall #1: Analysis Paralysis**

**Problem**: Spending days on single function without making progress

**Solution**:
- Set 4-hour time limit per function
- If stuck, mark as "Medium Confidence" and move on
- Return later with fresh perspective or different tool

---

**Pitfall #2: Ignoring Dynamic Analysis**

**Problem**: Relying solely on static analysis, missing runtime behavior

**Solution**:
- Always validate static findings with dynamic testing
- Use strace/ltrace for quick validation
- Run binary in controlled environment (VM or container)

---

**Pitfall #3: Copy-Paste Implementation**

**Problem**: Copying decompiled code directly into WolfGuard

**Solution**:
- Understand algorithm first, then implement from scratch
- Use RFC specifications as primary reference
- Treat decompiled code as "hints", not source code

---

**Pitfall #4: Inadequate Documentation**

**Problem**: No one can understand analysis 6 months later

**Solution**:
- Fill out analysis journal completely (don't skip sections)
- Explain reasoning, not just findings
- Include confidence levels and unknowns

---

**Pitfall #5: Scope Creep**

**Problem**: Analyzing everything instead of focusing on targets

**Solution**:
- Use reconnaissance phase to identify priorities
- Stick to target list (don't explore tangential functions)
- Timebox exploratory analysis (max 30 minutes)

---

## Appendices

### Appendix A: Tool Installation Guide

See dedicated documents:
- [IDA Pro Setup Guide](./tools/ida-pro-setup.md)
- [Ghidra Setup Guide](./tools/ghidra-setup.md)
- [angr Setup Guide](./tools/angr-setup.md)
- [Binary Ninja Assessment](./tools/binary-ninja-assessment.md) (future reference only)

---

### Appendix B: Windows Container Setup

See [Section 4.3: Windows Container Strategy](#43-windows-container-strategy)

---

### Appendix C: Glossary

| Term | Definition |
|------|------------|
| CSTP | Cisco SSL Tunnel Protocol - HTTP-based VPN protocol |
| DTLS | Datagram TLS - UDP-based encrypted transport |
| HLIL | High-Level Intermediate Language (Hex-Rays / Ghidra P-Code) |
| TOTP | Time-Based One-Time Password (RFC 6238) |
| vtable | Virtual Method Table (C++ polymorphism) |
| Clean Room | Analysis/implementation separation methodology |
| Dynamic Analysis | Runtime behavior observation |
| Static Analysis | Source/binary code analysis without execution |

---

### Appendix D: Reference Materials

**RFCs**:
- RFC 6238: TOTP Algorithm
- RFC 4226: HOTP Algorithm
- RFC 5246: TLS 1.2
- RFC 6347: DTLS 1.2

**Cisco Documentation**:
- Cisco Secure Client Administrator Guide
- AnyConnect Protocol Specification (community draft)
- OpenConnect Protocol Documentation

**Books**:
- "Practical Reverse Engineering" by Bruce Dang et al.
- "The IDA Pro Book" by Chris Eagle
- "Reverse Engineering for Beginners" by Dennis Yurichev

**Online Resources**:
- OpenConnect Project: https://www.infradead.org/openconnect/
- Hex-Rays Decompiler Documentation: https://hex-rays.com/decompiler/
- Ghidra Documentation: https://ghidra-sre.org/
- radare2 Book: https://book.rada.re/

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-29 | Initial Team | Created from DECOMPILATION_WORKFLOW.md |
| 2.0 | 2025-10-30 | RE Team Lead | Added IDA Pro 9.2, Binary Ninja integration, Windows container strategy, enhanced automation |
| 2.1 | 2025-10-30 | RE Team Lead | Removed Binary Ninja from active toolchain, moved to future enhancements pending budget approval |

---

**Document Status**: APPROVED for use by WolfGuard Development Team
**Review Cycle**: Quarterly (next review: 2026-01-30)
**Maintained By**: Reverse Engineering Team Lead
**Contact**: re-team@wolfguard.dev

---

**END OF MANIFEST**

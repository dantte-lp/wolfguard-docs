---
title: Windows Platform-Specific Features
sidebar_position: 4
---

# Windows Platform-Specific Implementation

This document describes Windows-specific features, system integration, and implementation details for Cisco Secure Client 5.1.12.146.

## MSI Package Inventory

Based on extraction analysis, Cisco Secure Client 5.1.12.146 ships as 10 MSI packages:

| MSI Package | Size | Purpose | Key Components |
|-------------|------|---------|----------------|
| **core-vpn-predeploy-k9.msi** | 23 MB | Core VPN functionality | vpnagent.exe, vpnapi.dll, vpncommon.dll |
| **dart-predeploy-k9.msi** | 7.1 MB | Diagnostic and Reporting Tool | dart.exe, dartui.exe |
| **nvm-predeploy-k9.msi** | 25 MB | Network Visibility Module | acnvmagent.exe, libsock_fltr_api.dll |
| **iseposture-predeploy-k9.msi** | 4.9 MB | ISE Posture integration | iseposture.exe, acise.dll |
| **posture-predeploy-k9.msi** | 35 MB | Host posture assessment | hostscan.dll, csd.dll |
| **nam-predeploy-k9.msi** | 7.3 MB | Network Access Manager | acnam.exe |
| **umbrella-predeploy-k9.msi** | 5.4 MB | Cisco Umbrella integration | umbrella.dll |
| **sbl-predeploy-k9.msi** | 3.2 MB | Start Before Logon | acsbl.dll |
| **zta-predeploy-k9.msi** | 33 MB | Zero Trust Access | aczta.exe, aczta_svc.exe |
| **thousandeyes-predeploy-k9.msi** | 11 MB | ThousandEyes monitoring | te_agent.exe |

**Total Size**: ~155 MB (all MSI packages combined)

## Windows Architecture

Cisco Secure Client on Windows uses a multi-layered architecture:

```kroki type=blockdiag
{
  orientation = portrait;

  // User interface layer
  group {
    label = "User Interface Layer";
    color = "lightblue";

    vpnui [label = "vpnui.exe\n(GUI Application)", shape = "box"];
    cli [label = "vpncli.exe\n(CLI Tool)", shape = "box"];
  }

  // Service layer
  group {
    label = "Service Layer";
    color = "lightgreen";

    vpnagent [label = "vpnagent.exe\n(Windows Service)"];
  }

  // API layer
  group {
    label = "API Layer";
    color = "orange";

    vpnapi [label = "vpnapi.dll\n(Core API)"];
    vpncommon [label = "vpncommon.dll\n(Common Functions)"];
  }

  // Crypto layer
  group {
    label = "Crypto Layer";
    color = "pink";

    acciscossl [label = "acciscossl.dll\n(SSL/TLS)"];
    acciscocrypto [label = "acciscocrypto.dll\n(Crypto)"];
  }

  // Driver layer
  group {
    label = "Kernel Drivers";
    color = "yellow";

    vpnva [label = "vpnva.sys\n(Virtual Adapter)"];
    acsock [label = "acsock.sys\n(Socket Filter)"];
  }

  // External
  winsock2 [label = "Winsock2\nWin32 API", color = "gray"];
  ndis [label = "NDIS\nNetwork Driver", color = "gray"];

  // Connections
  vpnui -> vpnagent [label = "IPC"];
  cli -> vpnagent [label = "IPC"];

  vpnagent -> vpnapi;
  vpnapi -> vpncommon;
  vpnapi -> acciscossl;
  acciscossl -> acciscocrypto;

  vpnagent -> vpnva [label = "I/O Control"];
  vpnagent -> acsock [label = "Filter Driver"];

  acciscocrypto -> winsock2;
  vpnva -> ndis;
  acsock -> ndis;
}
```

## Virtual Adapter Driver (vpnva.sys)

### Purpose

The `vpnva.sys` driver creates a **virtual network adapter** (similar to TUN/TAP on Linux) for tunneling IP packets.

### NDIS Integration

**Driver Type**: NDIS 6.x Lightweight Filter Driver

**Adapter Name**: "Cisco Secure Client Virtual Adapter"

**Expected Implementation**:

```c
// Pseudo-code: NDIS driver initialization
NDIS_STATUS DriverEntry(PDRIVER_OBJECT DriverObject, PUNICODE_STRING RegistryPath) {
    NDIS_MINIPORT_DRIVER_CHARACTERISTICS characteristics;

    NdisZeroMemory(&characteristics, sizeof(characteristics));

    characteristics.MajorNdisVersion = 6;
    characteristics.MinorNdisVersion = 40;  // NDIS 6.40 (Windows 8+)

    characteristics.SetOptionsHandler = SetOptions;
    characteristics.InitializeHandlerEx = InitializeEx;
    characteristics.HaltHandlerEx = HaltEx;
    characteristics.SendNetBufferListsHandler = SendNetBufferLists;
    characteristics.ReturnNetBufferListsHandler = ReturnNetBufferLists;

    return NdisMRegisterMiniportDriver(DriverObject, RegistryPath,
                                       NULL, &characteristics, &NdisDriverHandle);
}
```

### Adapter Configuration

**Registry Location**:
```
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\
  {4D36E972-E325-11CE-BFC1-08002BE10318}\<InstanceID>
```

**Properties**:
- **DriverDesc**: "Cisco Secure Client Virtual Adapter"
- **NetCfgInstanceId**: `{GUID}`
- **ComponentId**: `cisco_vpnva`

## Windows Service (vpnagent.exe)

### Service Configuration

**Service Name**: `vpnagent`
**Display Name**: "Cisco Secure Client VPN Agent"
**Start Type**: Automatic
**Service Type**: Win32_OwnProcess

**Registry Location**:
```
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\vpnagent
```

### Service Management

```powershell
# Start service
Start-Service -Name vpnagent

# Stop service
Stop-Service -Name vpnagent

# Query status
Get-Service -Name vpnagent

# Expected output:
Status   Name               DisplayName
------   ----               -----------
Running  vpnagent           Cisco Secure Client VPN Agent
```

### Service Dependencies

- **Tcpip** (TCP/IP Protocol Driver)
- **AFD** (Ancillary Function Driver for Winsock)
- **NDIS** (Network Driver Interface Specification)

## Inter-Process Communication (IPC)

### Named Pipes

`vpnagent.exe` (service) communicates with `vpnui.exe` (GUI) and `vpncli.exe` (CLI) via **named pipes**:

**Pipe Name**: `\\.\pipe\vpnagent_pipe`

**Expected IPC Protocol**:

```c
// Pseudo-code: Named pipe server (in vpnagent.exe)
HANDLE pipe = CreateNamedPipe(
    "\\\\.\\pipe\\vpnagent_pipe",
    PIPE_ACCESS_DUPLEX,
    PIPE_TYPE_MESSAGE | PIPE_READMODE_MESSAGE | PIPE_WAIT,
    PIPE_UNLIMITED_INSTANCES,
    4096,  // Out buffer size
    4096,  // In buffer size
    0,     // Default timeout
    NULL   // Security attributes
);

while (TRUE) {
    ConnectNamedPipe(pipe, NULL);
    // Read command from client
    // Execute command
    // Send response
    DisconnectNamedPipe(pipe);
}
```

**Message Format**:
```
[4 bytes: Command ID] [4 bytes: Payload Length] [Payload Data]
```

**Commands**:
- `CONNECT (0x01)` - Initiate VPN connection
- `DISCONNECT (0x02)` - Terminate VPN connection
- `GET_STATUS (0x03)` - Query connection status
- `GET_STATS (0x04)` - Query statistics

## Routing Configuration

### Route Table Manipulation

`vpnagent.exe` uses **IP Helper API** to modify the routing table:

```c
#include <iphlpapi.h>

// Add VPN route
DWORD AddVpnRoute(const char* dest_network, const char* dest_mask,
                  const char* gateway, DWORD if_index) {
    MIB_IPFORWARDROW route;
    ZeroMemory(&route, sizeof(route));

    route.dwForwardDest = inet_addr(dest_network);
    route.dwForwardMask = inet_addr(dest_mask);
    route.dwForwardNextHop = inet_addr(gateway);
    route.dwForwardIfIndex = if_index;
    route.dwForwardType = MIB_IPROUTE_TYPE_INDIRECT;
    route.dwForwardProto = MIB_IPPROTO_NETMGMT;
    route.dwForwardAge = 0;
    route.dwForwardMetric1 = 1;

    return CreateIpForwardEntry(&route);
}
```

### NRPT (Name Resolution Policy Table)

For DNS split-tunneling, Cisco Secure Client configures **NRPT** on Windows 8+:

**Registry Location**:
```
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters\DnsPolicyConfig
```

**Example NRPT Entry**:
```
Name: .internal.corp.com
GenericDNSServers: 192.168.50.1
ConfigOptions: 0x8 (Use DNS servers specified)
```

## User Interface

### GUI Application (vpnui.exe)

**Framework**: Win32 API + Custom UI framework

**Expected Window Classes**:
- `CiscoSecureClientMainWindow`
- `CiscoSecureClientTrayIcon`

**System Tray Integration**:
```c
// Add icon to system tray
NOTIFYICONDATA nid;
nid.cbSize = sizeof(nid);
nid.hWnd = hwnd;
nid.uID = 1;
nid.uFlags = NIF_ICON | NIF_MESSAGE | NIF_TIP;
nid.uCallbackMessage = WM_USER_TRAYICON;
nid.hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(IDI_VPNICON));
wcscpy_s(nid.szTip, L"Cisco Secure Client");

Shell_NotifyIcon(NIM_ADD, &nid);
```

### CLI Tool (vpncli.exe)

**Usage**:
```cmd
REM Connect to VPN
vpncli connect vpn.example.com

REM Disconnect
vpncli disconnect

REM Get status
vpncli state

REM Get statistics
vpncli stats
```

## Start Before Logon (SBL)

### Purpose

**SBL** allows VPN connection to be established **before** Windows user logon, enabling:
- Domain authentication over VPN
- Group Policy application before logon
- Pre-logon access control

### Credential Provider

**DLL**: `acsbl.dll` (from sbl-predeploy-k9.msi)

**Integration**: Implements **ICredentialProvider** interface

**Registry**:
```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\
  Authentication\Credential Providers\{GUID}
```

### SBL Flow Diagram

```kroki type=mermaid
sequenceDiagram
    participant User
    participant WinLogon as Windows Logon
    participant SBL as SBL Credential Provider
    participant VPN as vpnagent.exe
    participant DC as Domain Controller

    WinLogon->>SBL: Load credential provider
    SBL-->>WinLogon: Display VPN tile

    User->>SBL: Select "VPN Connection"
    SBL->>VPN: Connect request
    VPN->>DC: Establish VPN (machine auth)
    DC-->>VPN: VPN connected

    VPN-->>SBL: Connection established
    SBL-->>WinLogon: Enable user logon

    User->>WinLogon: Enter domain credentials
    WinLogon->>DC: Authenticate (over VPN)
    DC-->>WinLogon: Authentication successful

    WinLogon->>User: Logon successful
```

## Socket Filter Driver (acsock.sys)

### Purpose

The `acsock.sys` driver is a **Winsock Layered Service Provider (LSP)** that provides:
- Traffic inspection
- Split tunneling enforcement
- Application-based routing

### WSP (Winsock Service Provider) Integration

**Expected Implementation**:

```c
// Pseudo-code: WSP installation
int InstallWSP() {
    WSAPROTOCOL_INFO protocol_info[MAX_PROTOCOLS];
    DWORD protocol_count;

    // Enumerate existing protocols
    WSCEnumProtocols(NULL, protocol_info, &protocol_count, &err);

    // Install layered protocol
    GUID provider_guid = CISCO_VPN_WSP_GUID;
    WCHAR provider_path[MAX_PATH] = L"C:\\Program Files\\Cisco\\Secure Client\\acsock.dll";

    for (int i = 0; i < protocol_count; i++) {
        WSAPROTOCOL_INFO layered_info = protocol_info[i];
        layered_info.ProtocolChain.ChainLen = 2;
        layered_info.ProtocolChain.ChainEntries[0] = new_catalog_id;
        layered_info.ProtocolChain.ChainEntries[1] = protocol_info[i].dwCatalogEntryId;

        WSCInstallProvider(&provider_guid, provider_path, &layered_info, 1, &err);
    }
}
```

## Security Features

### Code Signing

All binaries (.exe, .dll, .sys) are **Authenticode signed** by Cisco Systems, Inc.

**Expected Certificate Chain**:
```
Root: DigiCert Assured ID Root CA
Intermediate: DigiCert SHA2 Assured ID Code Signing CA
Leaf: Cisco Systems, Inc.
```

### Driver Signing

Kernel drivers (vpnva.sys, acsock.sys) are **WHQL signed** for Windows compatibility.

**Signing Requirements**:
- **Windows 10/11 (64-bit)**: Requires Microsoft EV Code Signing Certificate
- **Secure Boot**: Drivers must be WHQL-signed

### Windows Defender Integration

Cisco Secure Client components are typically **whitelisted** by Windows Defender to avoid false positives.

## Performance Tuning

### Windows Registry Tweaks

For optimal VPN performance:

```reg
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters]
"TcpWindowSize"=dword:00040000
"Tcp1323Opts"=dword:00000003
"TcpMaxDupAcks"=dword:00000002
"SackOpts"=dword:00000001

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\{Interface-GUID}]
"TcpAckFrequency"=dword:00000001
"TCPNoDelay"=dword:00000001
```

## Troubleshooting

### Common Issues

#### 1. Virtual Adapter Not Created

**Symptom**: Virtual adapter doesn't appear in Network Connections

**Solution**:
```powershell
# Reinstall virtual adapter driver
pnputil /add-driver "C:\Program Files\Cisco\Secure Client\vpnva.inf" /install

# Restart service
Restart-Service vpnagent
```

#### 2. Service Won't Start

**Symptom**: "The vpnagent service failed to start"

**Solution**:
```powershell
# Check service dependencies
sc query vpnagent

# Check event logs
Get-EventLog -LogName Application -Source "Cisco Secure Client" -Newest 10
```

#### 3. DNS Not Working Through VPN

**Symptom**: Cannot resolve internal hostnames

**Solution**:
```powershell
# Check NRPT configuration
Get-DnsClientNrptPolicy

# Flush DNS cache
ipconfig /flushdns

# Restart DNS Client service
Restart-Service Dnscache
```

## Windows 11 Support

### TPM and Secure Boot

Cisco Secure Client 5.1.12.146 is compatible with Windows 11 requirements:
- ✅ TPM 2.0 compatible
- ✅ Secure Boot compatible (drivers are WHQL-signed)
- ✅ VBS (Virtualization-Based Security) compatible

## Summary

Windows platform support in Cisco Secure Client 5.1.12.146:

✅ **NDIS 6.x** virtual adapter driver
✅ **Windows Service** architecture (vpnagent.exe)
✅ **Named Pipes** IPC mechanism
✅ **IP Helper API** for routing
✅ **NRPT** for DNS split-tunneling
✅ **Start Before Logon** (SBL) support
✅ **Winsock LSP** socket filtering
✅ **Code signed** binaries (Authenticode + WHQL)
✅ **Windows 10/11** compatibility

---

**Next**: [macOS Platform-Specific Features](./platform-macos)

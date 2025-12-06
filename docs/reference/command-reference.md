---
title: Command Reference
sidebar_position: 2
---

# Command Reference

Complete reference for WolfGuard CLI commands and utilities.

## wolfguard

Main VPN server daemon.

### Synopsis

```bash
wolfguard [OPTIONS]
```

### Options

| Option | Description |
|--------|-------------|
| `-c, --config FILE` | Specify configuration file (default: `/etc/wolfguard/wolfguard.conf`) |
| `-f, --foreground` | Run in foreground (don't daemonize) |
| `-d, --debug` | Enable debug logging |
| `-v, --version` | Show version information |
| `-h, --help` | Show help message |
| `--test-config` | Test configuration and exit |

### Examples

```bash
# Start with custom config
wolfguard -c /etc/wolfguard/custom.conf

# Run in foreground with debug
wolfguard -f -d

# Test configuration
wolfguard --test-config
```

## wolfguard-ctl

Control and query running WolfGuard server.

### Synopsis

```bash
wolfguard-ctl COMMAND [OPTIONS]
```

### Commands

#### status

Show server status.

```bash
wolfguard-ctl status
```

#### users

List connected users.

```bash
wolfguard-ctl users
```

#### show-connections

Show detailed connection information.

```bash
wolfguard-ctl show-connections [--json]
```

#### disconnect

Disconnect a user.

```bash
wolfguard-ctl disconnect USERNAME
```

#### reload

Reload configuration without restart.

```bash
wolfguard-ctl reload
```

#### stop

Stop the server gracefully.

```bash
wolfguard-ctl stop
```

## wolfguard-passwd

Manage user password database.

### Synopsis

```bash
wolfguard-passwd [OPTIONS] USERNAME
```

### Options

| Option | Description |
|--------|-------------|
| `-c, --create FILE` | Create new password file |
| `-g, --group GROUP` | Set user group |
| `-l, --lock` | Lock user account |
| `-u, --unlock` | Unlock user account |
| `-d, --delete` | Delete user |

### Examples

```bash
# Add/update user
wolfguard-passwd -c /etc/wolfguard/passwd alice

# Delete user
wolfguard-passwd -d -c /etc/wolfguard/passwd bob

# Lock user account
wolfguard-passwd -l -c /etc/wolfguard/passwd charlie
```

## wolfguard-cert

Certificate management utility.

### Synopsis

```bash
wolfguard-cert COMMAND [OPTIONS]
```

### Commands

#### generate-ca

Generate CA certificate.

```bash
wolfguard-cert generate-ca --days 3650 --out /etc/wolfguard/certs/
```

#### generate-server

Generate server certificate.

```bash
wolfguard-cert generate-server --cn vpn.example.com --ca /etc/wolfguard/certs/ca-cert.pem
```

#### generate-client

Generate client certificate.

```bash
wolfguard-cert generate-client --name alice --ca /etc/wolfguard/certs/ca-cert.pem
```

#### verify

Verify certificate chain.

```bash
wolfguard-cert verify --cert server-cert.pem --ca ca-cert.pem
```

## wolfguard-radius-test

Test RADIUS authentication.

### Synopsis

```bash
wolfguard-radius-test [OPTIONS] USERNAME PASSWORD
```

### Options

| Option | Description |
|--------|-------------|
| `--server HOST` | RADIUS server hostname |
| `--port PORT` | RADIUS server port (default: 1812) |
| `--secret SECRET` | RADIUS shared secret |
| `--timeout SECS` | Timeout in seconds |

### Example

```bash
wolfguard-radius-test --server radius.example.com --secret sharedkey alice password123
```

## systemctl (Service Management)

Manage WolfGuard as systemd service.

### Commands

```bash
# Start service
sudo systemctl start wolfguard

# Stop service
sudo systemctl stop wolfguard

# Restart service
sudo systemctl restart wolfguard

# Reload configuration
sudo systemctl reload wolfguard

# Enable auto-start
sudo systemctl enable wolfguard

# Disable auto-start
sudo systemctl disable wolfguard

# View status
sudo systemctl status wolfguard

# View logs
sudo journalctl -u wolfguard -f
```

## See Also

- [Configuration Reference](./configuration-reference) - Configuration file options
- [Administration Guide](/docs/administration/) - Server administration
- [Troubleshooting](/docs/networking/troubleshooting/common-problems) - Common issues

---

**Missing a command?** [Report documentation gap](https://github.com/dantte-lp/wolfguard-docs/issues)

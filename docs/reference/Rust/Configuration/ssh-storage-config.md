---
title: SSHStorageConfig
description: Configuration to use ssh storage support with rac-delta client within the Rust SDK.
sidebar_position: 4
---

# SSHStorageConfig

`SSHStorageConfig` represents the configuration that will be used if storage is SSH within the client usage.  
It composes of host, port, and credentials.

Each instance is produced automatically when creating a new rac-delta client with ssh storage type.

---

## Structure

```rust
pub struct SSHStorageConfig {
  pub base: BaseStorageConfig,
  pub host: String,
  pub port: Option<u16>,
  pub credentials: SSHCredentials,
}

pub struct SSHCredentials {
  pub username: String,
  pub password: Option<String>,
  pub private_key: Option<String>,
}
```

## Properties

| Property    | Type                | Description                                                                     |
| ----------- | ------------------- | ------------------------------------------------------------------------------- |
| base        | `BaseStorageConfig` | Extended base config.                                                           |
| host        | `String`            | Host to connect to ssh.                                                         |
| port        | `Option<u16>`       | Optional port to connect to ssh, default is `22`                                |
| credentials | `SSHCredentials`    | Credentials to connect to ssh host, username, password and optional private key |

## Related

- [RacDeltaConfig](/docs/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/Rust/configuration/base-storage-config)

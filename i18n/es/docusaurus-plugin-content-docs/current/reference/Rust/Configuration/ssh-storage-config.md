---
title: SSHStorageConfig
description: Configuración para usar el almacenamiento ssh en el cliente rac-delta en el SDK de Rust.
sidebar_position: 4
---

# SSHStorageConfig

`SSHStorageConfig` representa la cofiguración que se usará si el tipo de almacenamiento es `ssh` en el cliente.
Se compone de host, puerto y credenciales.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta con el tipo de almacenamiento ssh.

---

## Estructura

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

## Propiedades

| Propiedad   | Tipo                | Descripción                                                                                           |
| ----------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| base        | `BaseStorageConfig` | Configuración base extendida.                                                                         |
| host        | `String`            | Host para conectar al ssh.                                                                            |
| port        | `Option<u16>`       | Puerto opcional para conectarse al ssh, por defecto es `22`.                                          |
| credentials | `SSHCredentials`    | Credenciales para conectarse al host ssh, nombre de usuario, contraseña y una key privada opcionales. |

## Relacionado

- [RacDeltaConfig](/docs/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/Rust/configuration/base-storage-config)

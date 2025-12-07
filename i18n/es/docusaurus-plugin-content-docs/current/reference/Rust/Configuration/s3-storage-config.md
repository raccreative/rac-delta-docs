---
title: S3StorageConfig
description: Configuración para usar almacenamiento S3 en el cliente rac-delta en el SDK de Rust.
sidebar_position: 9
---

# S3StorageConfig

`S3StorageConfig` representa la configuración que se usará si el tipo de almacenamiento es S3 en el cliente.
Se compone de endpoint, región, bucket y credenciales.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta con el tipo s3.

---

## Estructura

```rust
pub struct S3StorageConfig {
  pub base: BaseStorageConfig,
  pub bucket: String,
  pub endpoint: Option<String>,
  pub region: Option<String>,
  pub credentials: S3Credentials,
}

pub struct S3Credentials {
  pub access_key_id: String,
  pub secret_access_key: String,
  pub session_token: Option<String>,
  pub expiration: Option<u64>,
}
```

## Propiedades

| Propiedad   | Tipo                | Descripción                                                                                       |
| ----------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| base        | `BaseStorageConfig` | Configuración base extendida.                                                                     |
| bucket      | `String`            | El nombre del bucket del S3.                                                                      |
| endpoint    | `Option<String>`    | Endpoint opcional al almacenamiento S3.                                                           |
| region      | `Option<String>`    | Región opcional donde está el S3.                                                                 |
| credentials | `S3Credentials`     | Objeto de credenciales compuesto por acces key id, secret access key, session token y expiración. |

## Relacionado

- [RacDeltaConfig](/docs/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/Rust/configuration/base-storage-config)

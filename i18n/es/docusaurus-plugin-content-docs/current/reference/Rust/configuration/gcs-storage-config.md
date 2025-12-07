---
title: GCSStorageConfig
description: Configuración para usar Google Cloud Storage en el cliente de rac-delta en el SDK de Rust.
sidebar_position: 7
---

# GCSStorageConfig

`GCSStorageConfig` representa la configuración que se usará si el tipo de almacenamiento es GCS en el cliente.
Se compone de bucket, endpoint api y credenciales.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta con el tipo gcs.

---

## Estructura

```rust
pub struct GCSStorageConfig {
  pub base: BaseStorageConfig,
  pub bucket: String,
  pub api_endpoint: Option<String>,
  pub credentials: GCSCredentials,
}

pub struct GCSCredentials {
  pub project_id: String,
  pub client_email: String,
  pub private_key: String,
}
```

## Propiedades

| Propiedad    | Tipo                | Descripción                                                                  |
| ------------ | ------------------- | ---------------------------------------------------------------------------- |
| base         | `BaseStorageConfig` | Configuración base extendida.                                                |
| bucket       | `String`            | Nombre del bucket del almacenamiento.                                        |
| api_endpoint | `Option<String>`    | Endpoint opcional a la api.                                                  |
| credentials  | `GCSCredentials`    | Objeto de credenciales compuesta por project ID, client email y private key. |

## Relacionado

- [RacDeltaConfig](/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/Rust/configuration/base-storage-config)

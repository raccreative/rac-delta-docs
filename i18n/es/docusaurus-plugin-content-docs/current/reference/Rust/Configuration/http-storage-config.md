---
title: HTTPStorageConfig
description: Configuración para usar el almacenamiento http en el cliente rac-delta en el SDK de Rust.
sidebar_position: 6
---

# HTTPStorageConfig

`HTTPStorageConfig` representa la configuración que se usará si el tipo de almacenamiento es `http` en el cliente.
Se compone de un endpoint, ruta opcional del índice y credenciales.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta con el tipo http.

---

## Estructura

```rust
pub struct HTTPStorageConfig {
  pub base: BaseStorageConfig,
  pub endpoint: String,
  pub index_file_path: Option<String>,
  pub credentials: Option<HTTPCredentials>,
}

pub struct HTTPCredentials {
  pub bearer_token: Option<String>,
  pub api_key: Option<String>,
}
```

## Propiedades

| Propiedad       | Tipo                      | Descripción                                                                                             |
| --------------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| base            | `BaseStorageConfig`       | Configuración base extendida.                                                                           |
| endpoint        | `String`                  | URL base que será usada para todas las operaciones http.                                                |
| index_file_path | `Option<String>`          | Ruta opcional (relativa a `endpoint` y `pathPrefix`) donde se puede encontrar el archivo rd-index.json. |
| credentials     | `Option<HTTPCredentials>` | Objeto de credenciales opcionales compuesto por bearer token y api key.                                 |

## Relacionado

- [RacDeltaConfig](/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/Rust/configuration/base-storage-config)

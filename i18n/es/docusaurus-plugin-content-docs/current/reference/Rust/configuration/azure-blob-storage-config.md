---
title: AzureBlobStorageConfig
description: Configuración para usar Azure Blob Storage en el cliente de rac-delta en el SDK de Rust.
sidebar_position: 8
---

# AzureBlobStorageConfig

`AzureBlobStorageConfig` representa la configuración que se usará si el tipo de almacenamiento es Azure en el cliente.
Se compone de container, endpoint y credenciales.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta con el tipo azure.

El usuario necesitará proporcionar un Azure auth a la configuarción para funcionar.

---

## Estructura

```rust
pub struct AzureBlobStorageGenericConfig {
  pub base: BaseStorageConfig,
  pub container: String,
  pub endpoint: String,
  pub account_url: String,
  pub credential: Arc<dyn AzureStorageCredential>,
}

pub trait AzureStorageCredential: Any + Debug + Send + Sync {
  fn as_any(&self) -> &dyn Any;
}
```

## Propiedades

| Propiedad   | Tipo                              | Descripción                                                        |
| ----------- | --------------------------------- | ------------------------------------------------------------------ |
| base        | `BaseStorageConfig`               | Configuración base extendida.                                      |
| container   | `String`                          | Nombre del container de almacenamiento.                            |
| endpoint    | `String`                          | Endpoint al almacenamiento Azure.                                  |
| account_url | `String`                          | Url de cuenta para auth.                                           |
| credential  | `Arc<dyn AzureStorageCredential>` | Credencial a usar, debe implementar TokenCredential de azure auth. |

## Relacionado

- [RacDeltaConfig](/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/Rust/configuration/base-storage-config)

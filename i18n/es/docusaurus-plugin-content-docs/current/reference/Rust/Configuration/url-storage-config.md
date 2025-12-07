---
title: URLStorageConfig
description: Configuración para usar el almacenamiento url en el cliente de rac-delta en el SDK de Rust.
sidebar_position: 5
---

# URLStorageConfig

`URLStorageConfig` representa la configuración que se usará si el tipo de almacenamiento es `url` en el cliente.
No tiene ninguna configuración, ya que solo necesita urls planas proporcionadas por el usuario para funcionar.

Cada instancia es generada automáticamente al crear un nuevo cliente de rac-delta con el tipo de almacenamiento url.

---

## Estructura

```rust
pub struct URLStorageConfig {
  pub base: BaseStorageConfig,
}
```

## Propiedades

| Propiedad | Tipo                | Descripción                   |
| --------- | ------------------- | ----------------------------- |
| base      | `BaseStorageConfig` | Configuración base extendida. |

## Relacionado

- [RacDeltaConfig](/docs/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/Rust/configuration/base-storage-config)

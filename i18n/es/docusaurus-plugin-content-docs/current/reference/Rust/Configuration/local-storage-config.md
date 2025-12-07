---
title: LocalStorageConfig
description: Configuración para usar el soporte de almacenamiento local con el cliente rac-delta en el SDK de Rust.
sidebar_position: 3
---

# LocalStorageConfig

`LocalStorageConfig` representa la configuración que será usada si el tipo de almacenamiento es `local` dentro del cliente.
Se compone de una ruta base.

Cada instancia es generada automáticamente al crear un nuevo cliente rac-delta con el tipo de almacenamiento local.

---

## Estructura

```rust
pub struct LocalStorageConfig {
  pub base: BaseStorageConfig,
  pub base_path: PathBuf;
}
```

## Propiedades

| Propiedad | Tipo                | Descripción                                                        |
| --------- | ------------------- | ------------------------------------------------------------------ |
| base      | `BaseStorageConfig` | Configuración base extendida.                                      |
| base_path | `PathBuf`           | Ruta base donde todas las operaciones del almacenamiento se harán. |

## Relacionado

- [RacDeltaConfig](/docs/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/Rust/configuration/base-storage-config)

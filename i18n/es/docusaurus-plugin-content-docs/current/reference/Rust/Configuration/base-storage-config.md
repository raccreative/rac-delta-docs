---
title: BaseStorageConfig
description: Configuración base de la configuración de almacenamiento dentro del SDK de Rust.
sidebar_position: 2
---

# BaseStorageConfig

`BaseStorageConfig` representa la configuración que será usada por almacenamiento en el cliente, esta clase será extendida por el almacenamiento concreto.
Se compone de un prefijo opcional para el espacio de trabajo.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta.

---

## Estructura

```rust
pub struct BaseStorageConfig {
  pub path_prefix: Option<String>,
}
```

## Propiedades

| Propiedad   | Tipo             | Descripción                                                             |
| ----------- | ---------------- | ----------------------------------------------------------------------- |
| path_prefix | `Option<String>` | El prefijo opcional que será usado para el workspace del almacenamiento |

## Relacionado

- [RacDeltaConfig](/docs/reference/Rust/configuration/rac-delta-config)

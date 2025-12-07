---
title: LocalStorageConfig
description: Configuración para usar el soporte de almacenamiento local con el cliente rac-delta en el SDK de Node.js.
sidebar_position: 3
---

# LocalStorageConfig

`LocalStorageConfig` representa la configuración que será usada si el tipo de almacenamiento es `local` dentro del cliente.
Se compone de una ruta base.

Cada instancia es generada automáticamente al crear un nuevo cliente rac-delta con el tipo de almacenamiento local.

---

## Estructura

```ts
export interface LocalStorageConfig extends BaseStorageConfig {
  type: 'local';
  basePath: string;
}
```

## Propiedades

| Propiedad | Tipo     | Descripción                                                        |
| --------- | -------- | ------------------------------------------------------------------ |
| type      | `local`  | String constante que identifica a esta configuración como local.   |
| basePath  | `string` | Ruta base donde todas las operaciones del almacenamiento se harán. |

## Relacionado

- [RacDeltaConfig](/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/NodeJS/configuration/base-storage-config)

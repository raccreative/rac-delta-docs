---
title: BaseStorageConfig
description: Configuración base de la configuración de almacenamiento dentro del SDK de Node.js.
sidebar_position: 2
---

# BaseStorageConfig

`BaseStorageConfig` representa la configuración que será usada por almacenamiento en el cliente, esta clase será extendida por el almacenamiento concreto.
Se compone de un prefijo opcional para el espacio de trabajo.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta.

---

## Estructura

```ts
export interface BaseStorageConfig {
  pathPrefix?: string;
}
```

## Propiedades

| Propiedad  | Tipo     | Descripción                                                             |
| ---------- | -------- | ----------------------------------------------------------------------- |
| pathPrefix | `string` | El prefijo opcional que será usado para el workspace del almacenamiento |

## Relacionado

- [RacDeltaConfig](/docs/reference/NodeJS/configuration/rac-delta-config)

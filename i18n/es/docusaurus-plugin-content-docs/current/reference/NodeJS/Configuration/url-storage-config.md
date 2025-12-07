---
title: URLStorageConfig
description: Configuración para usar el almacenamiento url en el cliente de rac-delta en el SDK de Node.js.
sidebar_position: 5
---

# URLStorageConfig

`URLStorageConfig` representa la configuración que se usará si el tipo de almacenamiento es `url` en el cliente.
No tiene ninguna configuración, ya que solo necesita urls planas proporcionadas por el usuario para funcionar.

Cada instancia es generada automáticamente al crear un nuevo cliente de rac-delta con el tipo de almacenamiento url.

---

## Estructura

```ts
export interface URLStorageConfig extends BaseStorageConfig {
  type: 'url';
}
```

## Propiedades

| Propiedad | Tipo  | Descripción                                                  |
| --------- | ----- | ------------------------------------------------------------ |
| type      | `url` | String constante que identifica esta configuración como url. |

## Relacionado

- [RacDeltaConfig](/docs/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/NodeJS/configuration/base-storage-config)

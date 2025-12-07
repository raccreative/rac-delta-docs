---
title: HTTPStorageConfig
description: Configuración para usar el almacenamiento http en el cliente rac-delta en el SDK de Node.js.
sidebar_position: 6
---

# HTTPStorageConfig

`HTTPStorageConfig` representa la configuración que se usará si el tipo de almacenamiento es `http` en el cliente.
Se compone de un endpoint, ruta opcional del índice y credenciales.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta con el tipo http.

---

## Estructura

```ts
export interface HTTPStorageConfig extends BaseStorageConfig {
  type: 'http';
  endpoint: string;
  indexFilePath?: string;
  credentials?: {
    bearerToken?: string;
    apiKey?: string;
  };
}
```

## Propiedades

| Propiedad     | Tipo     | Descripción                                                                                             |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| type          | `http`   | String constante que identifica esta configuración como http.                                           |
| endpoint      | `string` | URL base que será usada para todas las operaciones http.                                                |
| indexFilePath | `string` | Ruta opcional (relativa a `endpoint` y `pathPrefix`) donde se puede encontrar el archivo rd-index.json. |
| credentials   | `Object` | Objeto de credenciales opcionales compuesto por bearer token y api key.                                 |

## Relacionado

- [RacDeltaConfig](/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/NodeJS/configuration/base-storage-config)

---
title: GCSStorageConfig
description: Configuración para usar Google Cloud Storage en el cliente de rac-delta en el SDK de Node.js.
sidebar_position: 7
---

# GCSStorageConfig

`GCSStorageConfig` representa la configuración que se usará si el tipo de almacenamiento es `gcs` en el cliente.
Se compone de bucket, endpoint api y credenciales.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta con el tipo gcs.

---

## Estructura

```ts
export interface GCSStorageConfig extends BaseStorageConfig {
  type: 'gcs';
  bucket: string;
  apiEndpoint?: string;
  credentials: {
    projectId: string;
    clientEmail?: string;
    privateKey?: string;
  };
}
```

## Propiedades

| Propiedad   | Tipo     | Descripción                                                                  |
| ----------- | -------- | ---------------------------------------------------------------------------- |
| type        | `gcs`    | String constante que indentifica esta configuración como gcs.                |
| bucket      | `string` | Nombre del bucket del almacenamiento.                                        |
| apiEndpoint | `string` | Endpoint opcional a la api.                                                  |
| credentials | `Object` | Objeto de credenciales compuesta por project ID, client email y private key. |

## Relacionado

- [RacDeltaConfig](/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/NodeJS/configuration/base-storage-config)

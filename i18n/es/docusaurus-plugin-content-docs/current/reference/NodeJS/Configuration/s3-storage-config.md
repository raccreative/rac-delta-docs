---
title: S3StorageConfig
description: Configuración para usar almacenamiento S3 en el cliente rac-delta en el SDK de Node.js.
sidebar_position: 9
---

# S3StorageConfig

`S3StorageConfig` representa la configuración que se usará si el tipo de almacenamiento es `s3` en el cliente.
Se compone de endpoint, región, bucket y credenciales.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta con el tipo s3.

---

## Estructura

```ts
export interface S3StorageConfig extends BaseStorageConfig {
  type: 's3';
  endpoint?: string;
  region?: string;
  bucket: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
    expiration?: Date;
  };
}
```

## Propiedades

| Propiedad   | Tipo     | Descripción                                                                                       |
| ----------- | -------- | ------------------------------------------------------------------------------------------------- |
| type        | `s3`     | String constante que identifica esta configuración como S3.                                       |
| endpoint    | `string` | Endpoint opcional al almacenamiento S3.                                                           |
| region      | `string` | Región opcional donde está el S3.                                                                 |
| bucket      | `string` | El nombre del bucket del S3.                                                                      |
| credentials | `Object` | Objeto de credenciales compuesto por acces key id, secret access key, session token y expiración. |

## Relacionado

- [RacDeltaConfig](/docs/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/NodeJS/configuration/base-storage-config)

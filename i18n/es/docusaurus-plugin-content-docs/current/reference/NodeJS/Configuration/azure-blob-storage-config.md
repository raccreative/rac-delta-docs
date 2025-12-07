---
title: AzureBlobStorageConfig
description: Configuración para usar Azure Blob Storage en el cliente de rac-delta en el SDK de Node.js.
sidebar_position: 8
---

# AzureBlobStorageConfig

`AzureBlobStorageConfig` representa la configuración que se usará si el tipo de almacenamiento es `azure` en el cliente.
Se compone de container, endpoint y credenciales.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta con el tipo azure.

---

## Estructura

```ts
export interface AzureBlobStorageConfig extends BaseStorageConfig {
  type: 'azure';
  container: string;
  endpoint: string;
  credentials: {
    accountName?: string;
    accountKey?: string;
    sasToken?: string;
  };
}
```

## Propiedades

| Propiedad   | Tipo     | Descripción                                                                         |
| ----------- | -------- | ----------------------------------------------------------------------------------- |
| type        | `azure`  | String constante que identifica esta configuración como azure.                      |
| container   | `string` | Nombre del container de almacenamiento.                                             |
| endpoint    | `string` | Endpoint al almacenamiento Azure.                                                   |
| credentials | `Object` | Objeto de credenciales compuesto por nombre de cuenta, clave de cuenta y token sas. |

## Relacionado

- [RacDeltaConfig](/docs/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/NodeJS/configuration/base-storage-config)

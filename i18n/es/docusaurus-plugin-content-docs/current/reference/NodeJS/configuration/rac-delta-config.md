---
title: RacDeltaConfig
description: Configuración base para usar en el cliente de rac-delta en el SDK de Node.js.
sidebar_position: 1
---

# RacDeltaConfig

`RacDeltaConfig` representa la configuración que será globalmente usada por el cliente.
Se compone del tamaño de chunk a usar, concurrencia máxima y una configuración concreta del almacenamiento.

Cada instancia se genera automáticamente al crear un nuevo cliente de rac-delta.

---

## Estructura

```ts
export type StorageConfig =
  | S3StorageConfig
  | AzureBlobStorageConfig
  | GCSStorageConfig
  | HTTPStorageConfig
  | SSHStorageConfig
  | LocalStorageConfig
  | URLStorageConfig;

export interface RacDeltaConfig {
  chunkSize: number;
  maxConcurrency?: number;
  storage: StorageConfig;
}
```

## Propiedades

| Propiedad      | Tipo            | Descripción                                                                                          |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| chunkSize      | `number`        | El tamaño en bytes que se usará para dividir los archivos en la creación de chunks (recomendado 1MB) |
| maxConcurrency | `number`        | Número máximo de tareas concurrentes del cliente para mayor rendimiento.                             |
| storage        | `StorageConfig` | Configuración concreta del tipo de almacenamiento seleccionado.                                      |

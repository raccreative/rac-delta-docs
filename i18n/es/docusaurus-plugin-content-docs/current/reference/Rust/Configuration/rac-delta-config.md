---
title: RacDeltaConfig
description: Configuración base para usar en el cliente de rac-delta en el SDK de Rust.
sidebar_position: 1
---

# RacDeltaConfig

`RacDeltaConfig` representa la configuración que será globalmente usada por el cliente.
Se compone del tamaño de chunk a usar, concurrencia máxima y una configuración concreta del almacenamiento.

Cada instancia se genera automáticamente al crear un nuevo cliente de rac-delta.

---

## Estructura

```rust
pub enum StorageConfig {
  S3(S3StorageConfig),
  Azure(AzureBlobStorageGenericConfig),
  GCS(GCSStorageConfig),
  HTTP(HTTPStorageConfig),
  SSH(SSHStorageConfig),
  Local(LocalStorageConfig),
  URL(URLStorageConfig)
}

pub struct RacDeltaConfig {
  pub chunk_size: usize,
  pub max_concurrency: Option<usize>,
  pub storage: StorageConfig,
}
```

## Propiedades

| Propiedad       | Tipo            | Descripción                                                                                          |
| --------------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| chunk_size      | `usize`         | El tamaño en bytes que se usará para dividir los archivos en la creación de chunks (recomendado 1MB) |
| max_concurrency | `Option<usize>` | Número máximo de tareas concurrentes del cliente para mayor rendimiento.                             |
| storage         | `StorageConfig` | Configuración concreta del tipo de almacenamiento seleccionado.                                      |

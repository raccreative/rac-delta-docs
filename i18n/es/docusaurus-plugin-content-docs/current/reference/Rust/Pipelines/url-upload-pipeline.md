---
title: UrlUploadPipeline
description: Adaptador de la pipeline de subida abstracto para los accesos a chunks basados en url.
sidebar_position: 2
---

# UrlUploadPipeline

`UrlUploadPipeline` es una clase abstracta diseñada para manejar subidas usando adaptadores de almacenamiento basados en URL (`UrlStorageAdapter`).
A diferencia de `HashUploadPipeline`, esta pipeline da por hecho que el plan delta (el cual indica qué subir o borrar) es calculado externamente y proporcionado a la pipeline.

Esta pipeline se usa comúnmente para sistemas de almacenamiento remoto donde cada chunk tiene una URL dedicada para subir, eliminar o descargar.

---

## Constructor

| Parámetro | Tipo                         | Descripción                                                                                       |
| --------- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| `storage` | `Arc<dyn UrlStorageAdapter>` | Adaptador de almacenamiento basado en urls que se usará (se crea automáticamente con el cliente). |
| `config`  | `Arc<RacDeltaConfig>`        | Configuración base del cliente.                                                                   |

---

## Métodos

| Método                                          | Devuelve                         | Descripción                                                                |
| ----------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------- |
| `execute(local_index, urls, options)`           | `Result<RDIndex, PipelineError>` | Realiza un proceso de subida completo para las urls dadas.                 |
| `upload_missing_chunks(upload_urls, options)`   | `Result<(), PipelineError>`      | Sube los chunks definidos en upload_urls.                                  |
| `upload_index(index, upload_url)`               | `Result<(), PipelineError>`      | Sube el rd-index.json a la url dada.                                       |
| `delete_obsolete_chunks(delete_urls, options)`  | `Result<(), PipelineError>`      | Elimina chunks obsoletos del almacenamiento usando las urls especificadas. |
| `update_progress(value, phase, speed, options)` | `()`                             | Método opcional que llama a la callback de progreso en opciones.           |
| `change_state(state, options)`                  | `()`                             | Método opcional que llama a la callback change_state en opciones.          |

---

## UploadOptions

El objeto `UploadOptions` permite personalizar el comportamiento de una subida:

```rust
pub struct UploadOptions {
    pub force: Option<bool>,
    pub require_remote_index: Option<bool>,
    pub ignore_patterns: Option<Vec<String>>,
    pub on_progress: Option<Arc<dyn Fn(UploadPhase, f64, Option<f64>) + Send + Sync>>,
    pub on_state_change: Option<Arc<dyn Fn(UploadState) + Send + Sync>>,
}
```

| Propiedad              | Tipo                                                               | Descripción                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `force`                | `Option<bool>`                                                     | Si es true, fuerza una subida completa incluso si existe un índice remoto. Si es false, solo los chunks nuevos y modificados se subirán. |
| `require_remote_index` | `Option<bool>`                                                     | Si es true y no hay índice remoto, se aborta la subida. Si es false (por defecto), sube todo si no encuentra índice remoto.              |
| `ignore_patterns`      | `Option<Vec<String>>`                                              | Archivos y directorios que deben ser ignorados al crear el rd-index.json.                                                                |
| `on_progress`          | `Option<Arc<dyn Fn(UploadPhase, f64, Option<f64>) + Send + Sync>>` | Callback opcional para informar progreso.                                                                                                |
| `on_state_change`      | `Option<Arc<dyn Fn(UploadState) + Send + Sync>>`                   | Callback opcional para informar cambios de estado.                                                                                       |

```rust
pub enum UploadState {
    Uploading,
    Comparing,
    Cleaning,
    Finalizing,
    Scanning,
}

pub enum UploadPhase {
    Upload,
    Deleting,
}
```

---

## PipelineError

Enum de errores personalizado para los resultados de UrlUploadPipeline. (Usa `thiserror`)

```rust
pub enum PipelineError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Delta error: {0}")]
    Delta(String),

    #[error("Storage error: {0}")]
    Storage(String),

    #[error("Index error: {0}")]
    Index(String),

    #[error("Invalid argument: {0}")]
    InvalidArgument(String),

    #[error("Operation aborted")]
    Aborted,

    #[error("Other error: {0}")]
    Other(String),
}
```

---

## Detalles de métodos

### `execute(local_index, urls, options)`

Realiza el proceso de subida completo usando las URLs proporcionadas para los chunks y el índice.

**Parámetros**

| Nombre             | Tipo                            | Descripción                                                                                           |
| ------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `local_index`      | `RDIndex`                       | El rd-index necesario para sincronizar, necesario ya que el usuario debería haber comparado ya ambos. |
| `urls.upload_urls` | `HashMap<String, ChunkUrlInfo>` | Las urls identificadas por hash para subir chunks. Mira ChunkUrlInfo abajo.                           |
| `urls.delete_urls` | `Option<Vec<String>>`           | Las urls para eliminar los chunks remotos obsoletos.                                                  |
| `urls.index_url`   | `String`                        | La url para subir el nuevo rd-index.json.                                                             |
| `options`          | `Option<UploadOptions>`         | Opciones para el proceso de subida. Mira UploadOptions arriba.                                        |

```rust
pub struct ChunkUrlInfo {
    pub url: String,
    pub offset: u64,
    pub size: u64,
    pub file_path: String,
}
```

Mira [ChunkUrlInfo](/docs/reference/Rust/models/chunk-url-info)

**Devuelve**

`Result<RDIndex, PipelineError>`

---

### `upload_missing_chunks(upload_urls, options)`

Sube todos los chunks faltantes con sus URLs respectivas. Los Chunks se leen desde disco en base a las rutas especificadas en `ChunkUrlInfo`.

**Parámetros**

| Nombre        | Tipo                            | Descripción                                                                                                             |
| ------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `upload_urls` | `HashMap<String, ChunkUrlInfo>` | Las urls identificadas por hash para subir los chunks. Mira [ChunkUrlInfo](/docs/reference/Rust/models/chunk-url-info). |
| `options`     | `Option<UploadOptions>`         | Opciones para el proceso de subida. Mira UploadOptions arriba.                                                          |

**Devuelve**

`Result<(), PipelineError>`

---

### `upload_index(index, upload_url)`

Sube el archivo RDIndex a la URL especificada.

**Parámetros**

| Nombre       | Tipo       | Descripción               |
| ------------ | ---------- | ------------------------- |
| `index`      | `&RDIndex` | El objeto índice a subir. |
| `upload_url` | `&str`     | Url para subir el índice. |

**Devuelve**

`Result<(), PipelineError>`

---

### `delete_obsolete_chunks(delete_urls, options)`

Elimina chunks obsoletos del almacenamiento remoto usando las URLs. Incluye lógica de reintentos y seguimiento de progreso.

**Parámetros**

| Nombre        | Tipo                    | Descripción                                                    |
| ------------- | ----------------------- | -------------------------------------------------------------- |
| `delete_urls` | `Vec<String>`           | La lista de urls para eliminar chunks.                         |
| `options`     | `Option<UploadOptions>` | Opciones para el proceso de subida. Mira UploadOptions arriba. |

**Devuelve**

`Promise<void>`

### `update_progress(value, phase, speed, options)`

Método que se usará internamente para llamar a la callback dada `on_progress` en opciones.

**Parámetros**

| Nombre    | Tipo                     | Descripción                                          |
| --------- | ------------------------ | ---------------------------------------------------- |
| `value`   | `f64`                    | Valor del progreso.                                  |
| `phase`   | `UploadPhase`            | Fase de subida actual (uploading o deleting).        |
| `speed`   | `Option<f64>`            | Velocidad en bytes/s para el proceso de subida.      |
| `options` | `Option<&UploadOptions>` | Opciones que debe incluir la callback `on_progress`. |

**Devuelve** `()`

---

### `change_state(state, options)`

Método que se usará internamente para llamar a la callback dada `on_state_change` en opciones.

**Parámetros**

| Nombre    | Tipo                     | Descripción                                              |
| --------- | ------------------------ | -------------------------------------------------------- |
| `state`   | `UploadState`            | Estado actual del progreso.                              |
| `options` | `Option<&UploadOptions>` | Opciones que debe incluir la callback `on_state_change`. |

**Devuelve** `()`

---

## Relacionado

- [HashUploadPipeline](/docs/reference/Rust/pipelines/hash-upload-pipeline)
- [RDIndex](/docs/reference/Rust/models/rdindex)

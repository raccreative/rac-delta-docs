---
title: HashDownloadPipeline
description: Adaptador abstracto de la pipeline de descarga para acceso a chunks basado en hash.
sidebar_position: 3
---

# HashDownloadPipeline

`HashDownloadPipeline` es una clase abstracta diseñada para manejar descargas usando adaptadores de almacenamiento basados en hash (`HashStorageAdapter`).
Orquesta el proceso de escanear directorios, computar deltas con `DeltaService`, descargar chunks faltantes, y reconstruir archivos.

Esta pipeline es comúnmente usada para descargas desde sistemas de almacenamiento donde los chunks se identifican por hash.

---

## Constructor

| Parámetro        | Tipo                             | Descripción                                                                                       |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `storage`        | `Arc<dyn HashStorageAdapter>`    | Adaptador de almacenamiento basado en hash que se usará (se crea automáticamente con el cliente). |
| `delta`          | `Arc<dyn DeltaService>`          | DeltaService usado para generar índices y compararlos.                                            |
| `reconstruction` | `Arc<dyn ReconstructionService>` | ReconstructionService usado para reconstrucción de archivos locales.                              |
| `validation`     | `Arc<dyn ValidationService>`     | ValidationService usado para validar archivos tras reconstruirlos.                                |
| `config`         | `Arc<RacDeltaConfig>`            | Configuración base del cliente.                                                                   |

---

## Métodos

| Método                                                                                    | Devuelve                                        | Descripción                                                                                                  |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `execute(local_dir, strategy, remote_index, options)`                                     | `Result<(), DownloadError>`                     | Realiza un proceso completo de descarga para un directorio.                                                  |
| `load_local_index(dir)`                                                                   | `Result<RDIndex, DownloadError>`                | Crea un rd-index.json de un directorio dado.                                                                 |
| `save_local_index(local_dir, index)`                                                      | `Result<(), DownloadError>`                     | Este método guardará el rd-index.json en el directorio dado.                                                 |
| `find_local_index(local_dir)`                                                             | `Result<Option<RDIndex>, DownloadError>`        | Buscará un rd-index.json si existe en el directorio dado.                                                    |
| `download_all_missing_chunks(plan, target, options)`                                      | `Result<Arc<dyn ChunkSource>, DownloadError>`   | Este método descargará primero todos los chunks necesarios, y los guardará temporalmente en disco o memoria. |
| `verify_and_delete_obsolete_chunks(plan, local_dir, remote_index, chunk_source, options)` | `Result<FileVerificationResult, DownloadError>` | Este método comprobará los archivos reconstruidos, verificando sus hashes y los chunks obsoletos.            |
| `update_progress(value, phase, disk_usage, speed, options)`                               | `()`                                            | Este método llamará a la callback de progreso dada en opciones.                                              |
| `change_state(state, options)`                                                            | `()`                                            | Este método llamará a la callback de estado dada en opciones.                                                |

---

## DownloadOptions

El objeto `DownloadOptions` permite personalizar el comportamiento de una descarga:

```rust
pub struct DownloadOptions {
    pub force: Option<bool>,
    pub chunks_save_path: Option<PathBuf>,
    pub use_existing_index: Option<bool>,
    pub file_reconstruction_concurrency: Option<usize>,
    pub in_place_reconstruction_threshold: Option<u64>,
    pub on_progress:
        Option<Arc<dyn Fn(DownloadPhase, f64, Option<f64>, Option<f64>) + Send + Sync>>,
    pub on_state_change: Option<Arc<dyn Fn(DownloadState) + Send + Sync>>,
}
```

| Propiedad                           | Tipo                                                                              | Descripción                                                                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `force`                             | `Option<bool>`                                                                    | Si es true, descarga todo. Si es false, solo los chunks nuevos y modificados se descargarán.                                       |
| `chunks_save_path`                  | `Option<PathBuf>`                                                                 | Ruta donde se guardarán los chunks si la estrategia `DownloadAllFirstToDisk` es la seleccionada.                                   |
| `use_existing_index`                | `Option<bool>`                                                                    | Si es true, buscará primero un rd-index existente en el directorio local.                                                          |
| `file_reconstruction_concurrency`   | `Option<usize>`                                                                   | Cuántos archivos se reconstruirán concurrentemente.                                                                                |
| `in_place_reconstruction_threshold` | `Option<u64>`                                                                     | Tamaño mínimo de archivo (en bytes) necesarios para realizar una **reconstrucción in-place** en lugar de usar un archivo temporal. |
| `on_progress`                       | `Option<Arc<dyn Fn(DownloadPhase, f64, Option<f64>, Option<f64>) + Send + Sync>>` | Callback opcional para informar progreso.                                                                                          |
| `on_state_change`                   | `Option<Arc<dyn Fn(DownloadState) + Send + Sync>>`                                | Callback opcional para cambios de estado.                                                                                          |

```rust
pub enum DownloadState {
    Downloading,
    Reconstructing,
    Cleaning,
    Scanning,
}

pub enum DownloadPhase {
    Download,
    Reconstructing,
    Deleting,
}
```

---

## DownloadError

Enum de errores personalizado para los resultados de DownloadPipeline. (Usa `thiserror`)

```rust
pub enum DownloadError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Delta error: {0}")]
    Delta(String),

    #[error("Storage error: {0}")]
    Storage(String),

    #[error("Index error: {0}")]
    Index(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Reconstruction error: {0}")]
    Reconstruction(String),

    #[error("Invalid argument: {0}")]
    InvalidArgument(String),

    #[error("Operation aborted")]
    Aborted,

    #[error("Other error: {0}")]
    Other(String),
}
```

---

## UpdateStrategy

Enum con diferentes estrategias para reconstruir y descargar archivos.

```rust
pub enum UpdateStrategy {
    DownloadAllFirstToMemory,
    StreamFromNetwork,
    DownloadAllFirstToDisk,
}
```

Para más info, mira: [Uso de la pipeline de descarga](/docs/usage/downloading#update-strategies)

---

## Detalles de métodos

### `execute(local_dir, strategy, remote_index, options)`

Realiza un proceso completo de descarga para un directorio.

**Parámetros**

| Nombre         | Tipo                      | Descripción                                                                                       |
| -------------- | ------------------------- | ------------------------------------------------------------------------------------------------- |
| `local_dir`    | `&Path`                   | Directorio donde se descargará la nueva actualización.                                            |
| `strategy`     | `UpdateStrategy`          | Estrategia a usar para la descarga y reconstrucción. Mira UpdateStrategy arriba.                  |
| `remote_index` | `Option<RDIndex>`         | rd-index remoto opcional. Si no se proporciona ninguno, intentará descargarlo del almacenamiento. |
| `options`      | `Option<DownloadOptions>` | Opciones para el progreso de descarga. Mira DownloadOptions arriba.                               |

**Devuelve**

`Result<(), DownloadError>`

---

### `load_local_index(dir)`

Este método creará un rd-index.json de un directorio dado, escaneando archivos y generando hashes.

**Parámetros**

| Nombre | Tipo    | Descripción                                 |
| ------ | ------- | ------------------------------------------- |
| `dir`  | `&Path` | Ruta del directorio para generar el índice. |

**Devuelve**

`Result<RDIndex, DownloadError>`

---

### `save_local_index(local_dir, index)`

Este método guardará el nuevo índice local en la carpeta dada.

**Parámetros**

| Nombre      | Tipo       | Descripción                                   |
| ----------- | ---------- | --------------------------------------------- |
| `local_dir` | `&Path`    | Directorio donde se guardará el nuevo índice. |
| `index`     | `&RDIndex` | El objeto RDIndex a guardar.                  |

**Devuelve**

`Result<(), DownloadError>`

---

### `find_local_index(local_dir)`

Este método buscará un rd-index.json si existe en el directorio dado.

**Parámetros**

| Nombre      | Tipo    | Descripción                                |
| ----------- | ------- | ------------------------------------------ |
| `local_dir` | `&Path` | Ruta del directorio para buscar el índice. |

**Devuelve**

`Result<Option<RDIndex>, DownloadError>`

---

### `download_all_missing_chunks(plan, target, options)`

Este método descargará primero todos los chunks necesarios, y los guardará temporalmente en disco o memoria.

Devolverá un `ChunkSource`, los ChunkSource serán necesarios para reconstruir archivos, este método SOLO devolverá chunks sources de memoria o disco para reconstrucción offline, si quieres usar almacenamiento como S3, puedes omitir esto y usar directamente un `StorageChunkSource` con `reconstruction.reconstructAll()` si lo prefieres.

(Usar StorageChunkSource descargará los chunks y reconstruirá los archivos al mismo tiempo, concurrentemente)

**Parámetros**

| Nombre    | Tipo                      | Descripción                                                                          |
| --------- | ------------------------- | ------------------------------------------------------------------------------------ |
| `plan`    | `&DeltaPlan`              | El `DeltaPlan` generado por delta.compare de los dos rd-index.json para la descarga. |
| `target`  | `DownloadTarget`          | Objetivo del ChunkSource resultante.                                                 |
| `options` | `Option<DownloadOptions>` | Opciones para el progreso de descarga. Mira DownloadOptions arriba.                  |

```rust
pub enum DownloadTarget {
    Memory,
    Disk,
}
```

**Devuelve**

`Result<Arc<dyn ChunkSource>, DownloadError>`

---

### `verify_and_delete_obsolete_chunks(plan, local_dir, remote_index, chunk_source, options)`

Este método comprobará los archivos reconstruidos, verificando sus hashes y los chunks obsoletos. Si aún quedan chunks obsoletos, se eliminarán y se reconstruirá el archivo de nuevo si es necesario.

**Parámetros**

| Nombre         | Tipo                      | Descripción                                                                                                                            |
| -------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `plan`         | `&DeltaPlan`              | El `DeltaPlan` generado por delta.compare de los dos rd-index.json para la descarga.                                                   |
| `local_dir`    | `&Path`                   | Ruta del directorio para comprobar archivos.                                                                                           |
| `remote_index` | `&RDIndex`                | El índice remoto para referencia.                                                                                                      |
| `chunk_source` | `Arc<dyn ChunkSource>`    | `ChunkSource` para descargar chunks en caso de archivos inválidos. Mira [ChunkSource](/docs/reference/Rust/chunk-sources/chunk-source) |
| `options`      | `Option<DownloadOptions>` | Objeto de opciones, echa un ojo a DownloadOptions arriba para más info (este método solo usa la callback)                              |

**Devuelve**

`Result<FileVerificationResult, DownloadError>`

```rust
pub struct FileVerificationResult {
    pub deleted_files: Vec<String>,
    pub verified_files: Vec<String>,
    pub rebuilt_files: Vec<String>,
}
```

---

### `update_progress(value, phase, disk_usage, speed, options)`

Método que se usará internamente para llamar a la callback `on_progress` dada en opciones.

**Parámetros**

| Nombre       | Tipo                       | Descripción                                              |
| ------------ | -------------------------- | -------------------------------------------------------- |
| `value`      | `f64`                      | Valor del progreso.                                      |
| `phase`      | `DownloadPhase`            | Fase de descarga actual (downloading o deleting).        |
| `disk_usage` | `Option<f64>`              | Velocidad en bytes/s para la velocidad de reconstrucción |
| `speed`      | `Option<f64>`              | Velocidad en bytes/s para la fase de descarga.           |
| `options`    | `Option<&DownloadOptions>` | Opciones que debe incluir la callback `on_progress`.     |

**Devuelve** `()`

---

### `change_state(state, options)`

Método que se usará internamente para llamar a la callback `on_state_change` dada en opciones.

**Parámetros**

| Nombre    | Tipo                       | Descripción                                              |
| --------- | -------------------------- | -------------------------------------------------------- |
| `state`   | `DownloadState`            | Estado actual del proceso.                               |
| `options` | `Option<&DownloadOptions>` | Opciones que debe incluir la callback `on_state_change`. |

**Devuelve** `()`

---

## Relacionado

- [UrlDownloadPipeline](/docs/reference/Rust/pipelines/url-download-pipeline)
- [ChunkSource](/docs/reference/Rust/chunk-sources/chunk-source)
- [RDIndex](/docs/reference/Rust/models/rdindex)
- [DeltaPlan](/docs/reference/Rust/models/delta-plan)

---
title: ReconstructionService
description: Servicio encargado de reconstruir archivos desde chunks usando cualquier ChunkSource.
sidebar_position: 4
---

# ReconstructionService

`ReconstructionService` define la interfaz principal responsable de **reconstruir archivos desde sus chunks**, ya sea a disco o stream.
Este servicio se comunica directamente con un [`ChunkSource`](../chunk-sources/chunk-source) para obtener los datos necesarios y reconstruir el archivo.

Sirve como el componente principal del proceso de restauración en rac-delta.

---

## Métodos

| Método                                                            | Devuelve                                                             | Descripción                                                  |
| ----------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------ |
| `reconstruct_file(entry, output_path, chunk_source, options, cb)` | `Result<(), ReconstructionError>`                                    | Reconstruye un único archivo en disco.                       |
| `reconstruct_all(plan, output_dir, chunk_source, options)`        | `Result<(), ReconstructionError>`                                    | Reconstruye todos los archivos de un DeltaPlan en disco.     |
| `reconstruct_to_stream(entry, chunk_source)`                      | `Result<Pin<Box<dyn AsyncRead + Send + Sync>>, ReconstructionError>` | Reconstruye un archivo en memoria y lo devuelve como stream. |

---

## ReconstructionError

Enum de errores personalizado para los resultados de ReconstructionService. (Usa `thiserror`)

```rust
pub enum ReconstructionError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Chunk '{0}' not found")]
    ChunkNotFound(String),

    #[error("Hash mismatch for file '{0}'")]
    HashMismatch(String),

    #[error("Failed to read chunk '{0}'")]
    ChunkReadError(String),

    #[error("Reconstruction failed: {0}")]
    Other(String),
}
```

---

## ReconstructionOptions

Opciones para el proceso de reconstrucción:

```rust
pub struct ReconstructionOptions {
    pub force_rebuild: Option<bool>,
    pub verify_after_rebuild: Option<bool>,
    pub in_place_reconstruction_threshold: Option<u64>,
    pub file_concurrency: Option<usize>,
    pub on_progress: Option<Arc<dyn Fn(f64, usize, Option<f64>, Option<usize>) + Send + Sync>>,
}
```

| Parámetro                           | Tipo                                                                        | Descripción                                                                                                                                            |
| ----------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `force_rebuild`                     | `Option<bool>`                                                              | Forzar la reconstrucción incluso si el hash del archivo coincide.                                                                                      |
| `verify_after_rebuild`              | `Option<bool>`                                                              | Verifica el hash del archivo reconstruido tras terminar. Si el hash no coincide, se lanza un error.                                                    |
| `in_place_reconstruction_threshold` | `Option<u64>`                                                               | Tamaño de archivo mínimo (en bytes) necesarios para realizar una **reconstrucción in-place** en lugar de usar un archivo temporal.                     |
| `file_concurrency`                  | `Option<usize>`                                                             | Cuántos archivos se reconstruirán de forma concurrente (valor por defecto es 5).                                                                       |
| `on_progress`                       | `Option<Arc<dyn Fn(f64, usize, Option<f64>, Option<usize>) + Send + Sync>>` | Callback que devuelve el uso de disco y la velocidad de red opcional (solo para chunk sources de almacenamiento vía streaming descarga-reconstrucción) |

---

## Detalles de métodos

### `reconstruct_file(entry, output_path, chunk_source, options, cb)`

Reconstruye un solo archivo desde un `FileEntry` en disco.

**Parámetros:**

| Nombre        | Tipo                             | Descripción                                                               |
| ------------- | -------------------------------- | ------------------------------------------------------------------------- |
| `entry`       | `&FileEntry`                     | El `FileEntry` que contiene la lista de chunks y la ruta del archivo.     |
| `outputPath`  | `&Path`                          | La ruta donde el archivo será reconstruido.                               |
| `chunkSource` | `&dyn ChunkSource`               | La implementación de chunk source desde donde se recolectarán los chunks. |
| `options`     | `Option<&ReconstructionOptions>` | Opciones para la reconstrucción.                                          |
| `cb`          | `Option<FileProgressCallback>`   | Callback opcional para el progreso.                                       |

```rust
pub type FileProgressCallback = Arc<dyn Fn(f64, usize, Option<usize>) + Send + Sync>;
```

**Devuelve:** `Result<(), ReconstructionError`

---

### `reconstruct_all(plan, output_dir, chunk_source, options)`

Reconstruye todos los archivos del DeltaPlan dado en disco.

**Parámetros:**

| Nombre         | Tipo                             | Descripción                                                               |
| -------------- | -------------------------------- | ------------------------------------------------------------------------- |
| `plan`         | `&DeltaPlan`                     | El `DeltaPlan` que contiene los archivos a reconstruir.                   |
| `output_dir`   | `&Path`                          | La ruta donde los archivos serán reconstruidos.                           |
| `chunk_source` | `Arc<dyn ChunkSource>`           | La implementación de chunk source desde donde se recolectarán los chunks. |
| `options`      | `Option<&ReconstructionOptions>` | Opciones para la reconstrucción.                                          |

**Devuelve:** `Result<(), ReconstructionError>`

---

### `reconstruct_to_stream(entry, chunk_source)`

Reconstruye un archivo en memoria y lo devuelve como un stream.

**Parámetros:**

| Nombre         | Tipo                                 | Descripción                                                               |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------- |
| `entry`        | `FileEntry`                          | El `FileEntry` que contiene la lista de chunks y la ruta del archivo.     |
| `chunk_source` | `Arc<dyn ChunkSource + Send + Sync>` | La implementación de chunk source desde donde se recolectarán los chunks. |

**Devuelve:** `Result<Pin<Box<dyn AsyncRead + Send + Sync>>, ReconstructionError>`

---

## Relacionado

- [DeltaPlan](/reference/Rust/models/delta-plan)
- [FileEntry](/reference/Rust/models/file-entry)
- [ChunkSource](/reference/Rust/chunk-sources/chunk-source)

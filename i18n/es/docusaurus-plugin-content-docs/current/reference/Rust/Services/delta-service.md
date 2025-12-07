---
title: DeltaService
description: Servicio para generar RDIndex y computar deltas entre fuentes y objetivos.
sidebar_position: 3
---

# DeltaService

`DeltaService` proporciona métodos para generar objetos `RDIndex` de directorios o streams, compara dos índices, y genera un `DeltaPlan` describiendo qué chunks necesitan subirse, descargarse, o eliminarse.

Internamente, usa `HasherService` para hashear archivos y streams.

```rust
pub trait DeltaService: Send + Sync {
  ...
}
```

---

## Métodos

| Método                                                                             | Devuelve                        | Descripción                                                                                  |
| ---------------------------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| `create_index_from_directory(root_path, chunk_size, concurrency, ignore_patterns)` | `Result<RDIndex, DeltaError>`   | Escanea un directorio, divide los archivos en chunks, los hashea, y devuelve un `RDIndex`.   |
| `create_file_entry_from_stream(stream, path)`                                      | `Result<FileEntry, DeltaError>` | Crea un `FileEntry` desde un stream de chunk asíncrono.                                      |
| `compare(source, target)`                                                          | `Result<DeltaPlan, DeltaError>` | Compara dos rd-index y devuelve un plan delta describiendo los chunks faltantes y obsoletos. |
| `merge_plans(base, updates)`                                                       | `Result<DeltaPlan, DeltaError>` | Fusiona dos DeltaPlan.                                                                       |
| `compare_for_upload(local_index, remote_index)`                                    | `Result<DeltaPlan, DeltaError>` | Prepara un plan delta para cambios de subida.                                                |
| `compare_for_download(local_index, remote_index)`                                  | `Result<DeltaPlan, DeltaError>` | Prepara un plan delta para cambios de descarga.                                              |

---

## DeltaError

Enum de errores personalizado para los resultados de DeltaService. (Usa `thiserror`)

```rust
pub enum DeltaError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Hashing failed: {0}")]
    HashError(#[from] HasherError),

    #[error("System time error: {0}")]
    SystemTimeError(#[from] SystemTimeError),

    #[error("Index creation failed: {0}")]
    IndexError(String),

    #[error("Delta comparison failed")]
    CompareError,
}
```

---

## Detalles de métodos

### `create_index_from_directory(root_path, chunk_size, concurrency, ignore_patterns)`

Genera un `RDIndex` de un directorio. Divide los archivos en chunks y los hashea.

**Parámetros:**

| Nombre            | Tipo                  | Descripción                                      |
| ----------------- | --------------------- | ------------------------------------------------ |
| `root_path`       | `&Path`               | Directorio a escanear recursivamente.            |
| `chunk_size`      | `u64`                 | Tamaño del chunk en bytes (se recomienda 1MB).   |
| `concurrency`     | `Option<usize>`       | Número máximo opcional de operaciones paralelas. |
| `ignore_patterns` | `Option<Vec<String>>` | Patrones glob opcionales a ignorar.              |

**Devuelve:** `Result<RDIndex, DeltaError>`

**Nota:** Usa `HasherService.hashStream` internamente.

---

### `create_file_entry_from_stream(stream, path)`

Crea un FileEntry a partir de un stream de chunks válido (de un archivo).

**Parámetros:**

| Parámetro | Tipo                                 | Descripción                            |
| --------- | ------------------------------------ | -------------------------------------- |
| `stream`  | `&mut (dyn AsyncChunkStream + Send)` | Stream de chunks asíncrono de entrada. |
| `path`    | `&str`                               | Ruta relativa del archivo.             |

```rust
#[async_trait]
pub trait AsyncChunkStream: Send + Sync {
    async fn next_chunk(&mut self) -> Option<Vec<u8>>;
    async fn reset(&mut self) {}
    async fn close(&mut self) {}
}
```

**Devuelve:** `Result<FileEntry, DeltaError>`

**Nota:** Hashea los chunks usando `HasherService` para generar un `FileEntry` compatible.

---

### `compare(source, target)`

Compara dos rd-index para generar un `DeltaPlan`.

**Parámetros:**

| Parámetro | Tipo               | Descripción                       |
| --------- | ------------------ | --------------------------------- |
| `source`  | `&RDIndex`         | Índice fuente.                    |
| `target`  | `Option<&RDIndex>` | Índice objetivo (puede ser None). |

**Devuelve:** `Result<DeltaPlan, DeltaError>`

---

### `merge_plans(base, updates)`

Fusiona dos planes en uno.

**Parámetros:**

| Parámetro | Tipo         | Descripción                               |
| --------- | ------------ | ----------------------------------------- |
| `base`    | `&DeltaPlan` | Plan delta base a fusionar.               |
| `updates` | `&DeltaPlan` | Plan delta de actualizaciones a fusionar. |

**Devuelve:** `Result<DeltaPlan, DeltaError>`

---

### `compare_for_upload(local_index, remote_index)`

Wrapper para generar un delta plan listo para subir archivos.

**Parámetros:**

| Parámetro      | Tipo               | Descripción      |
| -------------- | ------------------ | ---------------- |
| `local_index`  | `&RDIndex`         | rd-index local.  |
| `remote_index` | `Option<&RDIndex>` | rd-index remoto. |

**Devuelve:** `Result<DeltaPlan, DeltaError>`

---

### `compare_for_download(local_index, remote_index)`

Wrapper para generar un delta plan listo para descargar archivos.

**Parámetros:**

| Parámetro      | Tipo               | Descripción      |
| -------------- | ------------------ | ---------------- |
| `local_index`  | `Option<&RDIndex>` | rd-index local.  |
| `remote_index` | `&RDIndex`         | rd-index remoto. |

**Devuelve:** `Result<DeltaPlan, DeltaError>`

---

## Relacionado

- [RDIndex](/docs/reference/Rust/models/rdindex)
- [FileEntry](/docs/reference/Rust/models/file-entry)
- [DeltaPlan](/docs/reference/Rust/models/delta-plan)
- [HasherService](/docs/reference/Rust/services/hasher-service)

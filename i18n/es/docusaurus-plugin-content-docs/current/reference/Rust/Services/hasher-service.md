---
title: HasherService
description: Servicio abstracto para hashear archivos, streams y buffers.
sidebar_position: 1
---

# HasherService

`HasherService` define la API para calcular hashes de archivos, chunks, streams y buffers.
Es abstracto; las implementaciones reales están en la capa de infraestructura.
(e.j., `Blake3HasherService` en Rust).

Esta página documenta la **API pública disponible para el SDK de Rust**.

```rust
pub trait HasherService: Send + Sync {
  ...
}
```

---

## Métodos

| Método                                       | Devuelve                          | Descripción                                                                        |
| -------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------- |
| `hash_file(file_path, root_dir, chunk_size)` | `Result<FileEntry, HasherError>`  | Devuelve un `FileEntry` calculando el hash del archivo y los hashes de los chunks. |
| `hash_stream(stream, on_chunk)`              | `Result<Vec<Chunk>, HasherError>` | Procesa un stream de chunks y devuelve un array de chunks hasheados.               |
| `hash_buffer(data)`                          | `Result<String, HasherError>`     | Devuelve el hash de un buffer (string hex).                                        |
| `verify_chunk(data, expected_hash)`          | `Result<bool, HasherError>`       | Verifica que un chunk tiene el hash esperado.                                      |
| `verify_file(path, expected_hash)`           | `Result<bool, HasherError>`       | Verifica que un archivo tiene el hash esperado.                                    |
| `create_streaming_hasher()`                  | `Box<dyn StreamingHasher + Send>` | Crea un objeto `StreamingHasher` para hashing incremental.                         |

---

## HasherError

Enum de errores personalizado para los resultados de HasherService. (Usa `thiserror`)

```rust
pub enum HasherError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Invalid argument: {0}")]
    InvalidArgument(String),

    #[error("Hashing failed: {0}")]
    Hash(String),

    #[error("Unexpected error: {0}")]
    Other(String),
}
```

---

## Detalles de métodos

### `hash_file(file_path, root_dir, chunk_size)`

Devuelve el `FileEntry` del archivo dado, calculando su hash y los hashes de sus chunks.

**NOTA IMPORTANTE:** el tamaño de chunk seleccionado debe ser el mismo en todas las operaciones de rac-delta

**Parámetros:**

| Nombre       | Tipo   | Descripción                                     |
| ------------ | ------ | ----------------------------------------------- |
| `file_path`  | `&str` | Ruta relativa del archivo (`dir/file.txt`)      |
| `root_dir`   | `&str` | Directorio raíz del índice (`dir`)              |
| `chunk_size` | `u64`  | Tamaño en bytes de cada chunk (recomendado 1MB) |

**Devuelve:** `Result<FileEntry, HasherError>`

---

### `hash_stream(stream, on_chunk)`

Procesa un stream de chunks, opcionalmente llama a `on_chunk` para cada chunk procesado.

**Parámetros:**

| Nombre     | Tipo                                         | Descripción                                 |
| ---------- | -------------------------------------------- | ------------------------------------------- |
| `stream`   | `&mut (dyn AsyncChunkStream + Send)`         | El stream de chunks de entrada.             |
| `on_chunk` | `Option<Box<dyn Fn(Vec<u8>) + Send + Sync>>` | Callback opcional para cada chunk hasheado. |

```rust
pub trait AsyncChunkStream: Send + Sync {
  async fn next_chunk(&mut self) -> Option<Vec<u8>>;
  async fn reset(&mut self) {}
  async fn close(&mut self) {}
}
```

**Devuelve:** `Result<Vec<Chunk>, HasherError>`

---

### `hash_buffer(data)`

Hashea un buffer.

| Parámetro | Tipo    | Descripción             |
| --------- | ------- | ----------------------- |
| `data`    | `&[u8]` | El buffer para hashear. |

**Devuelve:** `Result<String, HasherError>` (hex string)

---

### `verify_chunk(data, expected_hash)`

Comprueba si un chunk tiene el hash esperado.

| Parámetro       | Tipo    | Descripción    |
| --------------- | ------- | -------------- |
| `data`          | `&[u8]` | El chunk.      |
| `expected_hash` | `&str`  | Hash esperado. |

**Devuelve:** `Result<bool, HasherError>`

---

### `verify_file(path, expected_hash)`

Comprueba si un archivo tiene el hash esperado.

| Parámetro       | Tipo   | Descripción       |
| --------------- | ------ | ----------------- |
| `path`          | `&str` | Ruta del archivo. |
| `expected_hash` | `&str` | Hash esperado.    |

**Devuelve:** `Result<bool, HasherError>`

---

### `create_streaming_hasher()`

Crea una instancia de `StreamingHasher`:

```rust
pub trait StreamingHasher: Send {
  fn update(&mut self, data: &[u8]);
  fn digest(&self) -> String;
}
```

**Devuelve:** `Box<dyn StreamingHasher + Send>`

---

## Relacionado

- [RDIndex](/docs/reference/Rust/models/rdindex)
- [FileEntry](/docs/reference/Rust/models/file-entry)
- [Chunk](/docs/reference/Rust/models/chunk)

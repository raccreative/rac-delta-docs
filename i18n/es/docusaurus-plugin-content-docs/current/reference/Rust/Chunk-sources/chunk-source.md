---
title: ChunkSource
description: Interfaz para traer chunks desde distintas fuentes.
sidebar_position: 1
---

# ChunkSource

`ChunkSource` define una interfaz para traer chunks de archivos desde cualquier fuente.
Esto se usa en `ReconstructionService` para leer chunks antes de la reconstrucción.

---

## Métodos

| Método                           | Devuelve                                                    | Descripción                                                                            |
| -------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `as_any()`                       | `&dyn Any`                                                  | Función auxiliar para any.                                                             |
| `get_chunk(hash)`                | `Result<Vec<u8>, ChunkError>`                               | Devuelve un solo chunk por su hash.                                                    |
| `get_chunks(hashes, options)`    | `Result<HashMap<String, Vec<u8>>, ChunkError>`              | Método opcional para traer múltiples chunks concurrentemente.                          |
| `stream_chunks(hashes, options)` | `Option<BoxStream<'static, Result<ChunkData, ChunkError>>>` | Método opcional para hacer streaming de chunks, con posibilidad de preservar el orden. |

---

## ChunkError

Enum de errores personalizado para los resultados de ChunkSource. (Usa `thiserror`)

```rust
pub enum ChunkError {
    #[error("Chunk '{0}' not found")]
    NotFound(String),

    #[error("Chunk '{0}' could not be read")]
    ReadError(String),

    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),
}
```

---

## Detalles de métodos

### `get_chunk(hash)`

Devuelve un solo chunk por su hash desde la fuente.

**Parámetros:**

| Nombre | Tipo   | Descripción     |
| ------ | ------ | --------------- |
| `hash` | `&str` | Hash del chunk. |

**Devuelve:** `Result<Vec<u8>, ChunkError>`

---

### `get_chunks(hashes, options)`

Trae múltiple chunks de forma concurrente.

**Parámetros:**

| Nombre                | Tipo            | Descripción                                            |
| --------------------- | --------------- | ------------------------------------------------------ |
| `hashes`              | `&[String]`     | Lista de todos los hashes de chunk a traer.            |
| `options.concurrency` | `Option<usize>` | Límite de concurrencia opcional para descargar chunks. |

**Devuelve:** `Result<HashMap<String, Vec<u8>>, ChunkError>`

---

### `stream_chunks(hashes, options)`

Stream de los chunks dados desde la fuente.

**Parámetros:**

| Nombre                   | Tipo            | Descripción                                             |
| ------------------------ | --------------- | ------------------------------------------------------- |
| `hashes`                 | `&[String]`     | Lista de todos los hashes de chunk a traer.             |
| `options.concurrency?`   | `Option<usize>` | Límite de concurrencia opcional para descargar chunks.  |
| `options.preserveOrder?` | `Option<bool>`  | Booleano opcional para mantener el orden de los chunks. |

**Devuelve:** `Option<BoxStream<'static, Result<ChunkData, ChunkError>>>`

---

## Implementaciones

Abajo están las implementaciones principales de `ChunkSource`. Cada una es completamente usable por los usuarios finales.

- [`MemoryChunkSource`](./memory-chunk-source) – Guarda chunks en memoria para acceso rápido.
- [`DiskChunkSource`](./disk-chunk-source) – Guarda chunks en disco para acceso rápido.
- [`StorageChunkSource`](./storage-chunk-source) – Trae chunks desde el adaptador de almacenamiento remoto.

## Relacionado

- [ReconstructionService](/reference/Rust/services/reconstruction-service)

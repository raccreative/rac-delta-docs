---
title: DiskChunkSource
description: Implementación de ChunkSource que guarda los chunks en el sistema de archivos local.
sidebar_position: 3
---

# DiskChunkSource

`DiskChunkSource` es una implementación de [`ChunkSource`](./chunk-source) que guarda y devuelve los chunks directamente desde el sistema de archivos (temporalmente).

---

## Constructor

| Parámetro   | Tipo      | Descripción                                             |
| ----------- | --------- | ------------------------------------------------------- |
| `cache_dir` | `PathBuf` | Directorio donde se guardarán los chunks temporalmente. |

---

## Métodos

| Método                         | Devuelve                                       | Descripción                                                                                                 |
| ------------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `get_chunk(hash)`              | `Result<Vec<u8>, ChunkError>`                  | Devuelve un único chunk por su hash.                                                                        |
| `get_chunks(hashes, options)`  | `Result<HashMap<String, Vec<u8>>, ChunkError>` | Método para devolver múltiples chunks de forma concurrente.                                                 |
| `has_chunk(hash)`              | `bool`                                         | Comprueba que un chunk existe en disco.                                                                     |
| `set_chunk_bytes(hash, data)`  | `io::Result<()>`                               | Agrega o actualiza un chunk en disco con datos como buffer ([u8]).                                          |
| `set_chunk_reader(hash, data)` | `io::Result<()>`                               | Agrega o actualiza un chunk en disco con datos como stream (tokio::io::AsyncRead + Unpin + Send + 'static). |
| `clear()`                      | `io::Result<()>`                               | Limpia todos los chunks almacenados en caché del disco.                                                     |

---

## Relacionado

- [ReconstructionService](/reference/Rust/services/reconstruction-service)
- [ChunkSource](chunk-source)

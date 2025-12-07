---
title: MemoryChunkSource
description: Implementación de ChunkSource que guarda los chunks en memoria para acceso rápido.
sidebar_position: 2
---

# MemoryChunkSource

`MemoryChunkSource` es una implementación de [`ChunkSource`](./chunk-source) que guarda todos los chunks en memoria.
Esto es útil para operaciones temporales rápidas, testing, o datos pequeños.

---

## Métodos

| Método                        | Devuelve                                       | Descripción                                                 |
| ----------------------------- | ---------------------------------------------- | ----------------------------------------------------------- |
| `get_chunk(hash)`             | `Result<Vec<u8>, ChunkError>`                  | Devuelve un único chunk por su hash.                        |
| `get_chunks(hashes, options)` | `Result<HashMap<String, Vec<u8>>, ChunkError>` | Método para devolver múltiples chunks de forma concurrente. |
| `has_chunk(hash)`             | `bool`                                         | Comprueba que un chunk existe en memoria.                   |
| `set_chunk(hash, data)`       | `()`                                           | Añade o actualiza un chunk en memoria.                      |

---

## Notas

- Ideal para datos pequeños o test unitarios.

- No muy útil para datos muy grandes debido a las limitaciones de memoria.

- Implementa la interfaz de ChunkSource por completo, por lo que puede intercambiarse por DiskChunkSource o StorageChunkSource.

## Relacionado

- [ReconstructionService](/reference/Rust/services/reconstruction-service)
- [ChunkSource](chunk-source)

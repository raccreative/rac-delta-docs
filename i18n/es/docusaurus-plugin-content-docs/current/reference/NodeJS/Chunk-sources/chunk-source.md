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

| Método                            | Devuelve                                           | Descripción                                                                            |
| --------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `getChunk(hash)`                  | `Promise<Buffer>`                                  | Devuelve un solo chunk por su hash.                                                    |
| `getChunks?(hashes, options?)`    | `Promise<Map<string, Buffer>>`                     | Método opcional para traer múltiples chunks concurrentemente.                          |
| `streamChunks?(hashes, options?)` | `AsyncGenerator<{ hash: string; data: Readable }>` | Método opcional para hacer streaming de chunks, con posibilidad de preservar el orden. |

---

## Detalles de métodos

### `getChunk(hash)`

Devuelve un solo chunk por su hash desde la fuente.

**Parámetros:**

| Nombre | Tipo     | Descripción     |
| ------ | -------- | --------------- |
| `hash` | `string` | Hash del chunk. |

**Devuelve:** `Promise<Buffer>`

---

### `getChunks?(hashes, options?)`

Trae múltiple chunks de forma concurrente.

**Parámetros:**

| Nombre                 | Tipo       | Descripción                                            |
| ---------------------- | ---------- | ------------------------------------------------------ |
| `hashes`               | `string[]` | Lista de todos los hashes de chunk a traer.            |
| `options.concurrency?` | `number`   | Límite de concurrencia opcional para descargar chunks. |

**Devuelve:** `Promise<Map<string, Buffer>>`

---

### `streamChunks?(hashes, options?)`

Stream de los chunks dados desde la fuente.

**Parámetros:**

| Nombre                   | Tipo       | Descripción                                             |
| ------------------------ | ---------- | ------------------------------------------------------- |
| `hashes`                 | `string[]` | Lista de todos los hashes de chunk a traer.             |
| `options.concurrency?`   | `number`   | Límite de concurrencia opcional para descargar chunks.  |
| `options.preserveOrder?` | `boolean`  | Booleano opcional para mantener el orden de los chunks. |

**Devuelve:** `AsyncGenerator<{ hash: string; data: Readable }>`

---

## Implementaciones

Abajo están las implementaciones principales de `ChunkSource`. Cada una es completamente usable por los usuarios finales.

- [`MemoryChunkSource`](./memory-chunk-source) – Guarda chunks en memoria para acceso rápido.
- [`DiskChunkSource`](./disk-chunk-source) – Guarda chunks en disco para acceso rápido.
- [`StorageChunkSource`](./storage-chunk-source) – Trae chunks desde el adaptador de almacenamiento remoto.

## Relacionado

- [ReconstructionService](/reference/NodeJS/services/reconstruction-service)

---
title: StorageChunkSource
description: Implementación de ChunkSource que devuelve los chunks desde el StorageAdapter (basado en hash o Url).
sidebar_position: 4
---

# StorageChunkSource

`StorageChunkSource` es una implementación avanzada de [`ChunkSource`](./chunk-source) que devuelve los chunks desde un [`StorageAdapter`](../adapters/storage-adapter).
Permite dos tipos de acceso:

- **HashStorageAdapter** — devuelve chunks a partir de un hash.
- **UrlStorageAdapter** — devuelve chunks a partir de urls, usando el campo opcional `urlsMap`.

Es la opción ideal cuando los chunks vienen de servidores remotos, CDNs, buckets S3 u otros backends de almacenamiento.

El StorageChunkSource será creado automáticamente por las pipelines, o manualmente usando:

```ts
racDeltaClient = new RacDeltaClient({...});

const chunkSource = new StorageChunkSource(racDeltaClient.storage);
```

---

## Constructor

| Parámetro | Tipo                 | Descripción                                                        |
| --------- | -------------------- | ------------------------------------------------------------------ |
| `storage` | `StorageAdapter`     | Adaptador que define cómo y desde dónde se conseguirán los chunks. |
| `urlsMap` | `Map<string,string>` | Obligatorio cuando se usa un UrlStorageAdapter. Mapea hash -> URL. |

---

## Métodos

| Método                           | Devuelve                                           | Descripción                                     |
| -------------------------------- | -------------------------------------------------- | ----------------------------------------------- |
| `getChunk(hash)`                 | `Promise<Buffer>`                                  | Devuelve un único chunk a partir de su hash.    |
| `getChunks(hashes, options?)`    | `Promise<Map<string, Buffer>>`                     | Devuelve múltiples chunks de forma concurrente. |
| `streamChunks(hashes, options?)` | `AsyncGenerator<{ hash: string; data: Readable }>` | Streaming de chunks, puede preservar el orden.  |

---

## Relacionado

- [ReconstructionService](/docs/reference/NodeJS/services/reconstruction-service)
- [StorageAdapter](/docs/reference/NodeJS/adapters/storage-adapter)
- [ChunkSource](chunk-source)

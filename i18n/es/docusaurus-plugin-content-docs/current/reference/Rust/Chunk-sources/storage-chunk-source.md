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

```rust
let client: RacDeltaClient = RacDeltaClient::new(config).await?;

let chunk_source: StorageChunkSource = StorageChunkSource::new(client.storage, None);
```

---

## Constructor

| Parámetro  | Tipo                                   | Descripción                                                        |
| ---------- | -------------------------------------- | ------------------------------------------------------------------ |
| `storage`  | `Arc<StorageAdapterEnum>`              | Adaptador que define cómo y desde dónde se conseguirán los chunks. |
| `urls_map` | `Option<Arc<HashMap<String, String>>>` | Obligatorio cuando se usa un UrlStorageAdapter. Mapea hash -> URL. |

---

## Métodos

| Método                           | Devuelve                                                    | Descripción                                     |
| -------------------------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| `get_chunk(hash)`                | `Result<Vec<u8>, ChunkError>`                               | Devuelve un único chunk a partir de su hash.    |
| `get_chunks(hashes, options)`    | `Result<HashMap<String, Vec<u8>>, ChunkError>`              | Devuelve múltiples chunks de forma concurrente. |
| `stream_chunks(hashes, options)` | `Option<BoxStream<'static, Result<ChunkData, ChunkError>>>` | Streaming de chunks, puede preservar el orden.  |

---

## Relacionado

- [ReconstructionService](/docs/reference/Rust/services/reconstruction-service)
- [StorageAdapter](/docs/reference/Rust/adapters/storage-adapter)
- [ChunkSource](chunk-source)

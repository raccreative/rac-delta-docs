---
title: StorageChunkSource
description: ChunkSource implementation that retrieves chunks from a StorageAdapter (hash or URL based).
sidebar_position: 4
---

# StorageChunkSource

`StorageChunkSource` is an advanced implementation of [`ChunkSource`](./chunk-source) that retrieves chunks from a [`StorageAdapter`](../adapters/storage-adapter).  
It allows two types of access:

- **HashStorageAdapter** — retrieves chunks from hash.
- **UrlStorageAdapter** — retrieves chunks using urls, using optional `urlsMap`.

It is the ideal option when chunks comes from remote servers, CDNs, S3 buckets or other storage backends.

The StorageChunkSource will be automatically created by pipelines, or manually created using:

```rust
let client: RacDeltaClient = RacDeltaClient::new(config).await?;

let chunk_source: StorageChunkSource = StorageChunkSource::new(client.storage, None);
```

---

## Constructor

| Parameter  | Type                                   | Description                                                   |
| ---------- | -------------------------------------- | ------------------------------------------------------------- |
| `storage`  | `Arc<StorageAdapterEnum>`              | Adapter that defines how and from where chunks are retrieved. |
| `urls_map` | `Option<Arc<HashMap<String, String>>>` | Required when using UrlStorageAdapter. Maps hash -> URL       |

---

## Methods

| Method                           | Returns                                                     | Description                               |
| -------------------------------- | ----------------------------------------------------------- | ----------------------------------------- |
| `get_chunk(hash)`                | `Result<Vec<u8>, ChunkError>`                               | Returns a single chunk by its hash.       |
| `get_chunks(hashes, options)`    | `Result<HashMap<String, Vec<u8>>, ChunkError>`              | Fetch multiple chunks concurrently.       |
| `stream_chunks(hashes, options)` | `Option<BoxStream<'static, Result<ChunkData, ChunkError>>>` | Stream chunks, possibly preserving order. |

---

## Related

- [ReconstructionService](/reference/Rust/services/reconstruction-service)
- [StorageAdapter](/reference/Rust/adapters/storage-adapter)
- [ChunkSource](chunk-source)

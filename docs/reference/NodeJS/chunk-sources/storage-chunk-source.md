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

```ts
racDeltaClient = new RacDeltaClient({...});

const chunkSource = new StorageChunkSource(racDeltaClient.storage);
```

---

## Constructor

| Parameter | Type                 | Description                                                   |
| --------- | -------------------- | ------------------------------------------------------------- |
| `storage` | `StorageAdapter`     | Adapter that defines how and from where chunks are retrieved. |
| `urlsMap` | `Map<string,string>` | Required when using UrlStorageAdapter. Maps hash -> URL       |

---

## Methods

| Method                           | Returns                                            | Description                               |
| -------------------------------- | -------------------------------------------------- | ----------------------------------------- |
| `getChunk(hash)`                 | `Promise<Buffer>`                                  | Returns a single chunk by its hash.       |
| `getChunks(hashes, options?)`    | `Promise<Map<string, Buffer>>`                     | Fetch multiple chunks concurrently.       |
| `streamChunks(hashes, options?)` | `AsyncGenerator<{ hash: string; data: Readable }>` | Stream chunks, possibly preserving order. |

---

## Related

- [ReconstructionService](/reference/NodeJS/services/reconstruction-service)
- [StorageAdapter](/reference/NodeJS/adapters/storage-adapter)
- [ChunkSource](chunk-source)

---
title: ChunkSource
description: Interface for fetching chunks from various sources.
sidebar_position: 1
---

# ChunkSource

`ChunkSource` defines an interface to retrieve file chunks from any source.  
This is used by `ReconstructionService` to read chunks before reconstruction.

---

## Methods

| Method                            | Returns                                            | Description                                                  |
| --------------------------------- | -------------------------------------------------- | ------------------------------------------------------------ |
| `getChunk(hash)`                  | `Promise<Buffer>`                                  | Returns a single chunk by its hash.                          |
| `getChunks?(hashes, options?)`    | `Promise<Map<string, Buffer>>`                     | Optional method to fetch multiple chunks concurrently.       |
| `streamChunks?(hashes, options?)` | `AsyncGenerator<{ hash: string; data: Readable }>` | Optional method to stream chunks, possibly preserving order. |

---

## Method details

### `getChunk(hash)`

Returns a single chunk by its hash from the source.

**Parameters:**

| Name   | Type     | Description                  |
| ------ | -------- | ---------------------------- |
| `hash` | `string` | Hash identifier of the chunk |

**Returns:** `Promise<Buffer>`

---

### `getChunks?(hashes, options?)`

Fetch multiple chunks concurrently.

**Parameters:**

| Name                   | Type       | Description                                       |
| ---------------------- | ---------- | ------------------------------------------------- |
| `hashes`               | `string[]` | List of all hashes to fetch                       |
| `options.concurrency?` | `number`   | Optional concurrency limit for downloading chunks |

**Returns:** `Promise<Map<string, Buffer>>`

---

### `streamChunks?(hashes, options?)`

Stream given chunks from the source.

**Parameters:**

| Name                     | Type       | Description                                       |
| ------------------------ | ---------- | ------------------------------------------------- |
| `hashes`                 | `string[]` | List of all hashes to fetch                       |
| `options.concurrency?`   | `number`   | Optional concurrency limit for downloading chunks |
| `options.preserveOrder?` | `boolean`  | Optional boolean to emit chunks in order          |

**Returns:** `AsyncGenerator<{ hash: string; data: Readable }>`

---

## Implementations

Below are the main implementations of `ChunkSource`. Each is fully usable by end users.

- [`MemoryChunkSource`](./memory-chunk-source) – Saves chunks in memory for fast access.
- [`DiskChunkSource`](./disk-chunk-source) – Saves chuks in disk for fast access.
- [`StorageChunkSource`](./storage-chunk-source) – Fetches chunks from remote storage adapters.

## Related

- [ReconstructionService](/reference/NodeJS/services/reconstruction-service)

---
title: DiskChunkSource
description: ChunkSource implementation that stores chunks on the local filesystem.
sidebar_position: 3
---

# DiskChunkSource

`DiskChunkSource` is an implementation of [`ChunkSource`](./chunk-source) that stores and retrieves chunks directly from the file system (temporal).

---

## Constructor

| Parameter  | Type     | Description                            |
| ---------- | -------- | -------------------------------------- |
| `cacheDir` | `string` | Directory where chunks will be stored. |

---

## Methods

| Method                        | Returns                        | Description                                     |
| ----------------------------- | ------------------------------ | ----------------------------------------------- |
| `getChunk(hash)`              | `Promise<Buffer>`              | Returns a single chunk by its hash.             |
| `getChunks(hashes, options?)` | `Promise<Map<string, Buffer>>` | Method to fetch multiple chunks concurrently.   |
| `hasChunk(hash)`              | `boolean`                      | Checks if a chunk exists in disk.               |
| `setChunk(hash, data)`        | `void`                         | Adds or updates a chunk in disk.                |
| `clear()`                     | `void`                         | Clears all the chunk stored cache data in disk. |

---

## Usage example

```ts
import { DiskChunkSource } from 'rac-delta';
import { Readable } from 'stream';

const source = new DiskChunkSource('./cache');

// Store a Buffer chunk
await source.setChunk('abcd1234', Buffer.from('Hello world'));

// Store a chunk from a stream
const stream = Readable.from(['streamed data']);
await source.setChunk('ef456', stream);

// Retrieve a chunk
const chunk = await source.getChunk('abcd1234');
console.log(chunk.toString()); // 'Hello world'

// Check existence
const exists = await source.hasChunk('abcd1234'); // true

// Retrieve multiple chunks
const results = await source.getChunks(['abcd1234', 'ef456']);
console.log(results.get('ef456')?.toString()); // 'streamed data'

// Clear all cached chunks
await source.clear();
```

## Related

- [ReconstructionService](/reference/NodeJS/services/reconstruction-service)
- [ChunkSource](chunk-source)

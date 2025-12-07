---
title: MemoryChunkSource
description: ChunkSource implementation that saves chunks in memory for fast access.
sidebar_position: 2
---

# MemoryChunkSource

`MemoryChunkSource` is an implementation of [`ChunkSource`](./chunk-source) that stores all chunks in memory.  
This is useful for fast temporary operations, testing, or small datasets.

---

## Methods

| Method                        | Returns                        | Description                                   |
| ----------------------------- | ------------------------------ | --------------------------------------------- |
| `getChunk(hash)`              | `Promise<Buffer>`              | Returns a single chunk by its hash.           |
| `getChunks(hashes, options?)` | `Promise<Map<string, Buffer>>` | Method to fetch multiple chunks concurrently. |
| `hasChunk(hash)`              | `boolean`                      | Checks if a chunk exists in memory.           |
| `setChunk(hash, data)`        | `void`                         | Adds or updates a chunk in memory.            |

---

## Usage Example

```ts
import { MemoryChunkSource } from 'rac-delta';

const source = new MemoryChunkSource();

// Add a chunk manually
source.setChunk('abcd1234', Buffer.from('Hello world'));

// Retrieve a chunk
const chunk = await source.getChunk('abcd1234');
console.log(chunk.toString()); // 'Hello world'

// Check if a chunk exists
const exists = source.hasChunk('abcd1234'); // true

// Retrieve multiple chunks at once
const chunks = await source.getChunks(['abcd1234']);
console.log(chunks.get('abcd1234').toString()); // 'Hello world'
```

## Notes

- Ideal for small datasets or unit testing.

- Not suitable for very large datasets due to memory limitations.

- Implements the ChunkSource interface fully, so it can be swapped with DiskChunkSource or StorageChunkSource.

## Related

- [ReconstructionService](/reference/NodeJS/services/reconstruction-service)
- [ChunkSource](chunk-source)

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

| Method                        | Returns                                        | Description                                   |
| ----------------------------- | ---------------------------------------------- | --------------------------------------------- |
| `get_chunk(hash)`             | `Result<Vec<u8>, ChunkError>`                  | Returns a single chunk by its hash.           |
| `get_chunks(hashes, options)` | `Result<HashMap<String, Vec<u8>>, ChunkError>` | Method to fetch multiple chunks concurrently. |
| `has_chunk(hash)`             | `bool`                                         | Checks if a chunk exists in memory.           |
| `set_chunk(hash, data)`       | `()`                                           | Adds or updates a chunk in memory.            |

---

## Notes

- Ideal for small datasets or unit testing.

- Not suitable for very large datasets due to memory limitations.

- Implements the ChunkSource interface fully, so it can be swapped with DiskChunkSource or StorageChunkSource.

## Related

- [ReconstructionService](/reference/Rust/services/reconstruction-service)
- [ChunkSource](chunk-source)

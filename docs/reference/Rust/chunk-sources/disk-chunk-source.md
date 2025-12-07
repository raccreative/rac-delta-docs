---
title: DiskChunkSource
description: ChunkSource implementation that stores chunks on the local filesystem.
sidebar_position: 3
---

# DiskChunkSource

`DiskChunkSource` is an implementation of [`ChunkSource`](./chunk-source) that stores and retrieves chunks directly from the file system (temporal).

---

## Constructor

| Parameter   | Type      | Description                            |
| ----------- | --------- | -------------------------------------- |
| `cache_dir` | `PathBuf` | Directory where chunks will be stored. |

---

## Methods

| Method                         | Returns                                        | Description                                                                                         |
| ------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `get_chunk(hash)`              | `Result<Vec<u8>, ChunkError>`                  | Returns a single chunk by its hash.                                                                 |
| `get_chunks(hashes, options)`  | `Result<HashMap<String, Vec<u8>>, ChunkError>` | Method to fetch multiple chunks concurrently.                                                       |
| `has_chunk(hash)`              | `bool`                                         | Checks if a chunk exists in disk.                                                                   |
| `set_chunk_bytes(hash, data)`  | `io::Result<()>`                               | Adds or updates a chunk in disk for data as buffer ([u8]).                                          |
| `set_chunk_reader(hash, data)` | `io::Result<()>`                               | Adds or updates a chunk in disk for data as stream (tokio::io::AsyncRead + Unpin + Send + 'static). |
| `clear()`                      | `io::Result<()>`                               | Clears all the chunk stored cache data in disk.                                                     |

---

## Related

- [ReconstructionService](/reference/Rust/services/reconstruction-service)
- [ChunkSource](chunk-source)

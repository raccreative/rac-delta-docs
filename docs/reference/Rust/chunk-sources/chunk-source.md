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

| Method                           | Returns                                                     | Description                                                  |
| -------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| `as_any()`                       | `&dyn Any`                                                  | Aux function for any.                                        |
| `get_chunk(hash)`                | `Result<Vec<u8>, ChunkError>`                               | Returns a single chunk by its hash.                          |
| `get_chunks(hashes, options)`    | `Result<HashMap<String, Vec<u8>>, ChunkError>`              | Optional method to fetch multiple chunks concurrently.       |
| `stream_chunks(hashes, options)` | `Option<BoxStream<'static, Result<ChunkData, ChunkError>>>` | Optional method to stream chunks, possibly preserving order. |

---

## ChunkError

Custom error enum for results of ChunkSource. (Uses `thiserror`)

```rust
pub enum ChunkError {
    #[error("Chunk '{0}' not found")]
    NotFound(String),

    #[error("Chunk '{0}' could not be read")]
    ReadError(String),

    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),
}
```

---

## Method details

### `get_chunk(hash)`

Returns a single chunk by its hash from the source.

**Parameters:**

| Name   | Type   | Description                   |
| ------ | ------ | ----------------------------- |
| `hash` | `&str` | Hash identifier of the chunk. |

**Returns:** `Result<Vec<u8>, ChunkError>`

---

### `get_chunks(hashes, options)`

Fetch multiple chunks concurrently.

**Parameters:**

| Name                  | Type            | Description                                        |
| --------------------- | --------------- | -------------------------------------------------- |
| `hashes`              | `&[String]`     | List of all hashes to fetch.                       |
| `options.concurrency` | `Option<usize>` | Optional concurrency limit for downloading chunks. |

**Returns:** `Result<HashMap<String, Vec<u8>>, ChunkError>`

---

### `stream_chunks(hashes, options)`

Stream given chunks from the source.

**Parameters:**

| Name                     | Type            | Description                                        |
| ------------------------ | --------------- | -------------------------------------------------- |
| `hashes`                 | `&[String]`     | List of all hashes to fetch.                       |
| `options.concurrency?`   | `Option<usize>` | Optional concurrency limit for downloading chunks. |
| `options.preserveOrder?` | `Option<bool>`  | Optional boolean to emit chunks in order.          |

**Returns:** `Option<BoxStream<'static, Result<ChunkData, ChunkError>>>`

---

## Implementations

Below are the main implementations of `ChunkSource`. Each is fully usable by end users.

- [`MemoryChunkSource`](./memory-chunk-source) – Saves chunks in memory for fast access.
- [`DiskChunkSource`](./disk-chunk-source) – Saves chuks in disk for fast access.
- [`StorageChunkSource`](./storage-chunk-source) – Fetches chunks from remote storage adapters.

## Related

- [ReconstructionService](/reference/Rust/services/reconstruction-service)

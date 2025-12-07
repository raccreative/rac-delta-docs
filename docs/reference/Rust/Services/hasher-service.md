---
title: HasherService
description: Abstract service for hashing files, streams, and buffers.
sidebar_position: 1
---

# HasherService

`HasherService` defines the API to calculate hashes of files, chunks, streams, and buffers.
It is abstract; real implementations are in the infrastructure layer
(e.g., `Blake3HasherService` in Rust).

This page documents the **public API available in the Rust SDK**.

```rust
pub trait HasherService: Send + Sync {
  ...
}
```

---

## Methods

| Method                                       | Returns                           | Description                                                         |
| -------------------------------------------- | --------------------------------- | ------------------------------------------------------------------- |
| `hash_file(file_path, root_dir, chunk_size)` | `Result<FileEntry, HasherError>`  | Returns a `FileEntry` calculating the file hash and chunk hashes.   |
| `hash_stream(stream, on_chunk)`              | `Result<Vec<Chunk>, HasherError>` | Processes a stream of chunks and returns an array of hashed chunks. |
| `hash_buffer(data)`                          | `Result<String, HasherError>`     | Returns the hash of a buffer (hex string).                          |
| `verify_chunk(data, expected_hash)`          | `Result<bool, HasherError>`       | Verifies that a chunk has the expected hash.                        |
| `verify_file(path, expected_hash)`           | `Result<bool, HasherError>`       | Verifies that a file has the expected hash.                         |
| `create_streaming_hasher()`                  | `Box<dyn StreamingHasher + Send>` | Creates a `StreamingHasher` object for incremental hashing.         |

---

## HasherError

Custom error enum for results of HasherService. (Uses `thiserror`)

```rust
pub enum HasherError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Invalid argument: {0}")]
    InvalidArgument(String),

    #[error("Hashing failed: {0}")]
    Hash(String),

    #[error("Unexpected error: {0}")]
    Other(String),
}
```

---

## Method Details

### `hash_file(file_path, root_dir, chunk_size)`

Returns a `FileEntry` of the given file, calculating its hash and chunk hashes.

**IMPORTANT NOTE:** selected chunk_size must be the same in all operations of rac-delta

**Parameters:**

| Name         | Type   | Description                                    |
| ------------ | ------ | ---------------------------------------------- |
| `file_path`  | `&str` | Relative path of the file (`dir/file.txt`)     |
| `root_dir`   | `&str` | Root directory of the index (`dir`)            |
| `chunk_size` | `u64`  | Size in bytes of each chunk (recommended 1 MB) |

**Returns:** `Result<FileEntry, HasherError>`

---

### `hash_stream(stream, on_chunk)`

Processes a stream of chunks, optionally calling `on_chunk` for each processed chunk.

**Parameters:**

| Name       | Type                                         | Description                              |
| ---------- | -------------------------------------------- | ---------------------------------------- |
| `stream`   | `&mut (dyn AsyncChunkStream + Send)`         | The input chunk stream.                  |
| `on_chunk` | `Option<Box<dyn Fn(Vec<u8>) + Send + Sync>>` | Optional callback for each hashed chunk. |

```rust
pub trait AsyncChunkStream: Send + Sync {
  async fn next_chunk(&mut self) -> Option<Vec<u8>>;
  async fn reset(&mut self) {}
  async fn close(&mut self) {}
}
```

**Returns:** `Result<Vec<Chunk>, HasherError>`

---

### `hash_buffer(data)`

Hashes a buffer.

| Parameter | Type    | Description         |
| --------- | ------- | ------------------- |
| `data`    | `&[u8]` | The buffer to hash. |

**Returns:** `Result<String, HasherError>` (hex string)

---

### `verify_chunk(data, expected_hash)`

Checks if a chunk has the expected hash.

| Parameter       | Type    | Description        |
| --------------- | ------- | ------------------ |
| `data`          | `&[u8]` | Chunk data buffer. |
| `expected_hash` | `&str`  | Expected hash.     |

**Returns:** `Result<bool, HasherError>`

---

### `verify_file(path, expected_hash)`

Checks if a file has the expected hash.

| Parameter       | Type   | Description    |
| --------------- | ------ | -------------- |
| `path`          | `&str` | File path.     |
| `expected_hash` | `&str` | Expected hash. |

**Returns:** `Result<bool, HasherError>`

---

### `create_streaming_hasher()`

Creates a `StreamingHasher` instance:

```rust
pub trait StreamingHasher: Send {
  fn update(&mut self, data: &[u8]);
  fn digest(&self) -> String;
}
```

**Returns:** `Box<dyn StreamingHasher + Send>`

---

## Related

- [RDIndex](/reference/Rust/models/rdindex)
- [FileEntry](/reference/Rust/models/file-entry)
- [Chunk](/reference/Rust/models/chunk)

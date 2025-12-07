---
title: DeltaService
description: Service to generate RDIndex and compute deltas between sources and targets.
sidebar_position: 3
---

# DeltaService

`DeltaService` provides methods to generate `RDIndex` objects from directories or streams,
compare two index, and generate a `DeltaPlan` describing which chunks need to be uploaded,
downloaded, or removed.

Internally, it relies on `HasherService` to hash files and streams.

```rust
pub trait DeltaService: Send + Sync {
  ...
}
```

---

## Methods

| Method                                                                             | Returns                         | Description                                                                                     |
| ---------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `create_index_from_directory(root_path, chunk_size, concurrency, ignore_patterns)` | `Result<RDIndex, DeltaError>`   | Scans a directory, splits files into chunks, hashes them, and returns an `RDIndex`.             |
| `create_file_entry_from_stream(stream, path)`                                      | `Result<FileEntry, DeltaError>` | Creates a `FileEntry` from an async chunk stream.                                               |
| `compare(source, target)`                                                          | `Result<DeltaPlan, DeltaError>` | Compares two rd-index and returns a delta plan describing missing, reused, and obsolete chunks. |
| `merge_plans(base, updates)`                                                       | `Result<DeltaPlan, DeltaError>` | Merges two delta plans                                                                          |
| `compare_for_upload(local_index, remote_index)`                                    | `Result<DeltaPlan, DeltaError>` | Prepares delta plan for uploading changes                                                       |
| `compare_for_download(local_index, remote_index)`                                  | `Result<DeltaPlan, DeltaError>` | Prepares delta plan for downloading                                                             |

---

## DeltaError

Custom error enum for results of DeltaService. (Uses `thiserror`)

```rust
pub enum DeltaError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Hashing failed: {0}")]
    HashError(#[from] HasherError),

    #[error("System time error: {0}")]
    SystemTimeError(#[from] SystemTimeError),

    #[error("Index creation failed: {0}")]
    IndexError(String),

    #[error("Delta comparison failed")]
    CompareError,
}
```

---

## Method Details

### `create_index_from_directory(root_path, chunk_size, concurrency, ignore_patterns)`

Generates an `RDIndex` for a directory. Splits files into chunks and hashes them.

**Parameters:**

| Name              | Type                  | Description                                 |
| ----------------- | --------------------- | ------------------------------------------- |
| `root_path`       | `&Path`               | Directory to scan recursively.              |
| `chunk_size`      | `u64`                 | Size of chunks in bytes (recommended 1MB).  |
| `concurrency`     | `Option<usize>`       | Optional max number of parallel operations. |
| `ignore_patterns` | `Option<Vec<String>>` | Optional glob patterns to ignore.           |

**Returns:** `Result<RDIndex, DeltaError>`

**Notes:** Uses `HasherService.hash_stream` internally.

---

### `create_file_entry_from_stream(stream, path)`

Creates a FileEntry from a valid stream of chunks (from a file).

**Parameters:**

| Parameter | Type                                 | Description                |
| --------- | ------------------------------------ | -------------------------- |
| `stream`  | `&mut (dyn AsyncChunkStream + Send)` | Input async chunk stream.  |
| `path`    | `&str`                               | Relative path of the file. |

```rust
#[async_trait]
pub trait AsyncChunkStream: Send + Sync {
    async fn next_chunk(&mut self) -> Option<Vec<u8>>;
    async fn reset(&mut self) {}
    async fn close(&mut self) {}
}
```

**Returns:** `Result<FileEntry, DeltaError>`

**Notes:** Hashes chunks with `HasherService` to produce a compatible `FileEntry`.

---

### `compare(source, target)`

Compares two rd-index to generate a `DeltaPlan`.

**Parameters:**

| Parameter | Type               | Description                 |
| --------- | ------------------ | --------------------------- |
| `source`  | `&RDIndex`         | Source index.               |
| `target`  | `Option<&RDIndex>` | Target index (can be None). |

**Returns:** `Result<DeltaPlan, DeltaError>`

---

### `merge_plans(base, updates)`

Merges two delta plans into one.

**Parameters:**

| Parameter | Type         | Description                  |
| --------- | ------------ | ---------------------------- |
| `base`    | `&DeltaPlan` | Base delta plan to merge.    |
| `updates` | `&DeltaPlan` | Updates delta plan to merge. |

**Returns:** `Result<DeltaPlan, DeltaError>`

---

### `compare_for_upload(local_index, remote_index)`

Wrapper to generate a delta plan ready for uploading files.

**Parameters:**

| Parameter      | Type               | Description      |
| -------------- | ------------------ | ---------------- |
| `local_index`  | `&RDIndex`         | Local rd-index.  |
| `remote_index` | `Option<&RDIndex>` | Remote rd-index. |

**Returns:** `Result<DeltaPlan, DeltaError>`

---

### `compare_for_download(local_index, remote_index)`

Wrapper to generate a delta plan ready for downloading files.

**Parameters:**

| Parameter      | Type               | Description      |
| -------------- | ------------------ | ---------------- |
| `local_index`  | `Option<&RDIndex>` | Local rd-index.  |
| `remote_index` | `&RDIndex`         | Remote rd-index. |

**Returns:** `Result<DeltaPlan, DeltaError>`

---

## Related

- [RDIndex](/reference/Rust/models/rdindex)
- [FileEntry](/reference/Rust/models/file-entry)
- [DeltaPlan](/reference/Rust/models/delta-plan)
- [HasherService](/reference/Rust/services/hasher-service)

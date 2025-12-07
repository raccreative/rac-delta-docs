---
title: ReconstructionService
description: Service responsible for reconstructing files from chunks using any ChunkSource.
sidebar_position: 4
---

# ReconstructionService

`ReconstructionService` defines the primary interface responsible for **reconstructing files from their chunks**, either on disk or as a stream.  
This service communicates directly with a [`ChunkSource`](../chunk-sources/chunk-source) to obtain the required data and reassemble the file.

It serves as the core component of the restoration process within rac-delta.

---

## Methods

| Method                                                            | Returns                                                              | Description                                                       |
| ----------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `reconstruct_file(entry, output_path, chunk_source, options, cb)` | `Result<(), ReconstructionError>`                                    | Reconstruct a single file in disk.                                |
| `reconstruct_all(plan, output_dir, chunk_source, options)`        | `Result<(), ReconstructionError>`                                    | Reconstruct all files from a DeltaPlan in disk.                   |
| `reconstruct_to_stream(entry, chunk_source)`                      | `Result<Pin<Box<dyn AsyncRead + Send + Sync>>, ReconstructionError>` | Reconstruct a file in memory and returns it as a Readable stream. |

---

## ReconstructionError

Custom error enum for results of ReconstructionService. (Uses `thiserror`)

```rust
pub enum ReconstructionError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Chunk '{0}' not found")]
    ChunkNotFound(String),

    #[error("Hash mismatch for file '{0}'")]
    HashMismatch(String),

    #[error("Failed to read chunk '{0}'")]
    ChunkReadError(String),

    #[error("Reconstruction failed: {0}")]
    Other(String),
}
```

---

## ReconstructionOptions

Options for the reconstruction progress:

```rust
pub struct ReconstructionOptions {
    pub force_rebuild: Option<bool>,
    pub verify_after_rebuild: Option<bool>,
    pub in_place_reconstruction_threshold: Option<u64>,
    pub file_concurrency: Option<usize>,
    pub on_progress: Option<Arc<dyn Fn(f64, usize, Option<f64>, Option<usize>) + Send + Sync>>,
}
```

| Parameter                           | Type                                                                        | Description                                                                                                                         |
| ----------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `force_rebuild`                     | `Option<bool>`                                                              | Force to rebuild even if hash file matches.                                                                                         |
| `verify_after_rebuild`              | `Option<bool>`                                                              | Verifies the reconstructed file hash after finishing. If hash does not match, an error is thrown.                                   |
| `in_place_reconstruction_threshold` | `Option<u64>`                                                               | Minimum file size (in bytes) required to perform an **in-place reconstruction** instead of using a temporary file.                  |
| `file_concurrency`                  | `Option<usize>`                                                             | How many files will reconstruct concurrently (default value is 5).                                                                  |
| `on_progress`                       | `Option<Arc<dyn Fn(f64, usize, Option<f64>, Option<usize>) + Send + Sync>>` | Callback that returns disk usage and optional network speed (only for storage chunk sources via streaming download-reconstruction). |

---

## Method Details

### `reconstruct_file(entry, output_path, chunk_source, options, cb)`

Reconstruct a single file from a `FileEntry` in disk.

**Parameters:**

| Name          | Type                             | Description                                                         |
| ------------- | -------------------------------- | ------------------------------------------------------------------- |
| `entry`       | `&FileEntry`                     | The `FileEntry` containing the list of chunks and path of the file. |
| `outputPath`  | `&Path`                          | The path where the file will be reconstructed.                      |
| `chunkSource` | `&dyn ChunkSource`               | The chunk source implementation where the chunks will be retrieved. |
| `options`     | `Option<&ReconstructionOptions>` | Options for reconstruction.                                         |
| `cb`          | `Option<FileProgressCallback>`   | Optional callback for progress.                                     |

```rust
pub type FileProgressCallback = Arc<dyn Fn(f64, usize, Option<usize>) + Send + Sync>;
```

**Returns:** `Result<(), ReconstructionError`

---

### `reconstruct_all(plan, output_dir, chunk_source, options)`

Reconstruct all files from given DeltaPlan in disk.

**Parameters:**

| Name           | Type                             | Description                                                         |
| -------------- | -------------------------------- | ------------------------------------------------------------------- |
| `plan`         | `&DeltaPlan`                     | The `DeltaPlan` containing the files to be reconstructed.           |
| `output_dir`   | `&Path`                          | The path where the files will be reconstructed.                     |
| `chunk_source` | `Arc<dyn ChunkSource>`           | The chunk source implementation where the chunks will be retrieved. |
| `options`      | `Option<&ReconstructionOptions>` | Options for reconstruction.                                         |

**Returns:** `Result<(), ReconstructionError>`

---

### `reconstruct_to_stream(entry, chunk_source)`

Reconstruct a file in memory and returns it as a stream.

**Parameters:**

| Name           | Type                                 | Description                                                         |
| -------------- | ------------------------------------ | ------------------------------------------------------------------- |
| `entry`        | `FileEntry`                          | The `FileEntry` containing the list of chunks and path of the file. |
| `chunk_source` | `Arc<dyn ChunkSource + Send + Sync>` | The chunk source implementation where the chunks will be retrieved. |

**Returns:** `Result<Pin<Box<dyn AsyncRead + Send + Sync>>, ReconstructionError>`

---

## Related

- [DeltaPlan](/docs/reference/Rust/models/delta-plan)
- [FileEntry](/docs/reference/Rust/models/file-entry)
- [ChunkSource](/docs/reference/Rust/chunk-sources/chunk-source)

---
title: HashDownloadPipeline
description: Abstract download pipeline adapter for hash-based chunk access for download flow.
sidebar_position: 3
---

# HashDownloadPipeline

`HashDownloadPipeline` is an abstract class designed to handle downloads using hash-based storage adapters (`HashStorageAdapter`).
It orchestrates the process of scanning directories, computing deltas with `DeltaService`, downloading missing chunks, and reconstructing files.

This pipeline is commonly used when downloading from storage systems where chunks are identified by their hash.

---

## Constructor

| Parameter        | Type                             | Description                                                                     |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------- |
| `storage`        | `Arc<dyn HashStorageAdapter>`    | Hash based storage adapter that will be used (automatically created by client). |
| `delta`          | `Arc<dyn DeltaService>`          | DeltaService used for generate rd-index, comparing rd-index, etc.               |
| `reconstruction` | `Arc<dyn ReconstructionService>` | ReconstructionService used for local file reconstruction.                       |
| `validation`     | `Arc<dyn ValidationService>`     | ValidationService used for file validation after reconstruction.                |
| `config`         | `Arc<RacDeltaConfig>`            | Base client configuration.                                                      |

---

## Methods

| Method                                                                                    | Returns                                         | Description                                                                                   |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `execute(local_dir, strategy, remote_index, options)`                                     | `Result<(), DownloadError>`                     | Performs a full download process for a directory.                                             |
| `load_local_index(dir)`                                                                   | `Result<RDIndex, DownloadError>`                | Will create a rd-index.json of a given directory.                                             |
| `save_local_index(local_dir, index)`                                                      | `Result<(), DownloadError>`                     | This method will save the new local index on given folder.                                    |
| `find_local_index(local_dir)`                                                             | `Result<Option<RDIndex>, DownloadError>`        | Will find for a rd-index.json if exists on given folder.                                      |
| `download_all_missing_chunks(plan, target, options)`                                      | `Result<Arc<dyn ChunkSource>, DownloadError>`   | This method will download first all needed chunks, and save them temporary on disk or memory. |
| `verify_and_delete_obsolete_chunks(plan, local_dir, remote_index, chunk_source, options)` | `Result<FileVerificationResult, DownloadError>` | This method will check for reconstructed files, verifying its hash and obsolete chunks.       |
| `update_progress(value, phase, disk_usage, speed, options)`                               | `()`                                            | This method will call progress callback given in options.                                     |
| `change_state(state, options)`                                                            | `()`                                            | This method will call state callback given in options.                                        |

---

## DownloadOptions

The `DownloadOptions` object allows you to customize the behavior of a download:

```rust
pub struct DownloadOptions {
    pub force: Option<bool>,
    pub chunks_save_path: Option<PathBuf>,
    pub use_existing_index: Option<bool>,
    pub file_reconstruction_concurrency: Option<usize>,
    pub in_place_reconstruction_threshold: Option<u64>,
    pub on_progress:
        Option<Arc<dyn Fn(DownloadPhase, f64, Option<f64>, Option<f64>) + Send + Sync>>,
    pub on_state_change: Option<Arc<dyn Fn(DownloadState) + Send + Sync>>,
}
```

| Property                            | Type                                                                              | Description                                                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `force`                             | `Option<bool>`                                                                    | If true, downloads everything. If false, only new and modified chunks will be downloaded.                          |
| `chunks_save_path`                  | `Option<PathBuf>`                                                                 | Path where chunks will be saved if `DownloadAllFirstToDisk` strategy is set.                                       |
| `use_existing_index`                | `Option<bool>`                                                                    | If true, will search first an existing rd-index in local dir.                                                      |
| `file_reconstruction_concurrency`   | `Option<usize>`                                                                   | How many files will be reconstructed concurrently.                                                                 |
| `in_place_reconstruction_threshold` | `Option<u64>`                                                                     | Minimum file size (in bytes) required to perform an **in-place reconstruction** instead of using a temporary file. |
| `on_progress`                       | `Option<Arc<dyn Fn(DownloadPhase, f64, Option<f64>, Option<f64>) + Send + Sync>>` | Optional callback to inform progress.                                                                              |
| `on_state_change`                   | `Option<Arc<dyn Fn(DownloadState) + Send + Sync>>`                                | Optional callback for state changes.                                                                               |

```rust
pub enum DownloadState {
    Downloading,
    Reconstructing,
    Cleaning,
    Scanning,
}

pub enum DownloadPhase {
    Download,
    Reconstructing,
    Deleting,
}
```

---

## DownloadError

Custom error enum for results of DownloadPipeline. (Uses `thiserror`)

```rust
pub enum DownloadError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Delta error: {0}")]
    Delta(String),

    #[error("Storage error: {0}")]
    Storage(String),

    #[error("Index error: {0}")]
    Index(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Reconstruction error: {0}")]
    Reconstruction(String),

    #[error("Invalid argument: {0}")]
    InvalidArgument(String),

    #[error("Operation aborted")]
    Aborted,

    #[error("Other error: {0}")]
    Other(String),
}
```

---

## UpdateStrategy

Enum for different strategies for reconstructing and downloading files.

```rust
pub enum UpdateStrategy {
    DownloadAllFirstToMemory,
    StreamFromNetwork,
    DownloadAllFirstToDisk,
}
```

For more info see: [Download pipeline usage](/usage/downloading#update-strategies)

---

## Method details

### `execute(local_dir, strategy, remote_index, options)`

Performs a full download process for a directory.

**Parameters**

| Name           | Type                      | Description                                                                    |
| -------------- | ------------------------- | ------------------------------------------------------------------------------ |
| `local_dir`    | `&Path`                   | Directory where the new update will be downloaded.                             |
| `strategy`     | `UpdateStrategy`          | Strategy used for downloading and reconstruction. See UpdateStrategy above.    |
| `remote_index` | `Option<RDIndex>`         | Optional remote rd-index. If none provided, will try to download from storage. |
| `options`      | `Option<DownloadOptions>` | Options for the download process. See DownloadOptions above.                   |

**Returns**

`Result<(), DownloadError>`

---

### `load_local_index(dir)`

This method will create a rd-index.json of a given directory, scanning files and generating hashes.

**Parameters**

| Name  | Type    | Description                          |
| ----- | ------- | ------------------------------------ |
| `dir` | `&Path` | Directory path to generate rd-index. |

**Returns**

`Result<RDIndex, DownloadError>`

---

### `save_local_index(local_dir, index)`

This method will save the new local index on given folder.

**Parameters**

| Name        | Type       | Description                                  |
| ----------- | ---------- | -------------------------------------------- |
| `local_dir` | `&Path`    | Directory where the new index will be saved. |
| `index`     | `&RDIndex` | The RDIndex object to save.                  |

**Returns**

`Result<(), DownloadError>`

---

### `find_local_index(local_dir)`

This method will find for a rd-index.json if exists on given folder.

**Parameters**

| Name        | Type    | Description                        |
| ----------- | ------- | ---------------------------------- |
| `local_dir` | `&Path` | Directory path to search rd-index. |

**Returns**

`Result<Option<RDIndex>, DownloadError>`

---

### `download_all_missing_chunks(plan, target, options)`

This method will download first all needed chunks for download, and save them temporary on disk or memory.

Will return `ChunkSource`, ChunkSources will be needed to reconstruct files, this method will ONLY return
memory or disk chunk sources for offline reconstruction, if you use a storage like S3, you can omit this
and use directly the StorageChunkSource with `reconstruction.reconstruct_all()` if you prefer.

(Using StorageChunkSource will download chunks and reconstruct file at same time, concurrently)

**Parameters**

| Name      | Type                      | Description                                                                           |
| --------- | ------------------------- | ------------------------------------------------------------------------------------- |
| `plan`    | `&DeltaPlan`              | The `DeltaPlan` generated by delta.compare of the two rd-index.json for the download. |
| `target`  | `DownloadTarget`          | Target of the resulting ChunkSource.                                                  |
| `options` | `Option<DownloadOptions>` | Options for the download process. See DownloadOptions above.                          |

```rust
pub enum DownloadTarget {
    Memory,
    Disk,
}
```

**Returns**

`Result<Arc<dyn ChunkSource>, DownloadError>`

---

### `verify_and_delete_obsolete_chunks(plan, local_dir, remote_index, chunk_source, options)`

This method will check for reconstructed files, verifying its hash and obsolete chunks. If obsolete chunks are still present, it will delete them, and reconstruct file again if needed.

**Parameters**

| Name           | Type                      | Description                                                                                                                      |
| -------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `plan`         | `&DeltaPlan`              | the `DeltaPlan` generated by delta.compare of the two rd-index.json for the download.                                            |
| `local_dir`    | `&Path`                   | Directory path to check files.                                                                                                   |
| `remote_index` | `&RDIndex`                | The remote index for reference.                                                                                                  |
| `chunk_source` | `Arc<dyn ChunkSource>`    | `ChunkSource` to download corrupt chunks in case of invalid files. See [ChunkSource](/reference/Rust/chunk-sources/chunk-source) |
| `options`      | `Option<DownloadOptions>` | Options object, see DownloadOptions above for more info (this method only uses callback)                                         |

**Returns**

`Result<FileVerificationResult, DownloadError>`

```rust
pub struct FileVerificationResult {
    pub deleted_files: Vec<String>,
    pub verified_files: Vec<String>,
    pub rebuilt_files: Vec<String>,
}
```

---

### `update_progress(value, phase, disk_usage, speed, options)`

Method that will be internally used to call given `on_progress` callback in options.

**Parameters**

| Name         | Type                       | Description                                           |
| ------------ | -------------------------- | ----------------------------------------------------- |
| `value`      | `f64`                      | Value of the progress.                                |
| `phase`      | `DownloadPhase`            | Current download phase (downloading or deleting).     |
| `disk_usage` | `Option<f64>`              | Speed in bytes/s for reconstruction speed.            |
| `speed`      | `Option<f64>`              | Speed in bytes/s for downloading phase.               |
| `options`    | `Option<&DownloadOptions>` | Options that must include the `on_progress` callback. |

**Returns** `()`

---

### `change_state(state, options)`

Method that will be internally used to call given `on_state_change` callback in options.

**Parameters**

| Name      | Type                       | Description                                               |
| --------- | -------------------------- | --------------------------------------------------------- |
| `state`   | `DownloadState`            | Current state of the progress.                            |
| `options` | `Option<&DownloadOptions>` | Options that must include the `on_state_change` callback. |

**Returns** `()`

---

## Related

- [UrlDownloadPipeline](/reference/Rust/pipelines/url-download-pipeline)
- [ChunkSource](/reference/Rust/chunk-sources/chunk-source)
- [RDIndex](/reference/Rust/models/rdindex)
- [DeltaPlan](/reference/Rust/models/delta-plan)

---
title: HashUploadPipeline
description: Abstract upload pipeline adapter for hash-based chunk access for upload flow.
sidebar_position: 1
---

# HashUploadPipeline

`HashUploadPipeline` is an abstract pipeline designed to handle uploads using hash-based storage adapters (`HashStorageAdapter`).
It orchestrates the process of scanning directories, computing deltas with `DeltaService`, uploading missing chunks, and cleaning up obsolete chunks.

This pipeline is commonly used when uploading to storage systems where chunks are identified by their hash.

---

## Constructor

| Parameter | Type                          | Description                                                                     |
| --------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `storage` | `Arc<dyn HashStorageAdapter>` | Hash based storage adapter that will be used (automatically created by client). |
| `delta`   | `Arc<dyn DeltaService>`       | DeltaService used for generate rd-index, comparing rd-index, etc.               |
| `config`  | `Arc<RacDeltaConfig>`         | Base client configuration.                                                      |

---

## Methods

| Method                                                  | Returns                          | Description                                                              |
| ------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| `execute(directory, remote_index, options)`             | `Result<RDIndex, PipelineError>` | Performs a full upload process for a directory.                          |
| `scan_directory(dir, ignore_patterns)`                  | `Result<RDIndex, PipelineError>` | Scans the directory recursively and creates an RDIndex.                  |
| `upload_missing_chunks(plan, base_dir, force, options)` | `Result<(), PipelineError>`      | Uploads only the missing or updated chunks defined in a DeltaPlan.       |
| `upload_index(index)`                                   | `Result<(), PipelineError>`      | Uploads the RDIndex file to the storage adapter.                         |
| `delete_obsolete_chunks(plan, options)`                 | `Result<(), PipelineError>`      | Deletes obsolete chunks from the storage as specified by the delta plan. |
| `update_progress(value, phase, speed, options)`         | `()`                             | Optional method that calls the progress callback in options.             |
| `change_state(state, options)`                          | `()`                             | Optional method that calls the change_state callback in options.         |

---

## UploadOptions

The `UploadOptions` object allows you to customize the behavior of an upload:

```rust
pub struct UploadOptions {
    pub force: Option<bool>,
    pub require_remote_index: Option<bool>,
    pub ignore_patterns: Option<Vec<String>>,
    pub on_progress: Option<Arc<dyn Fn(UploadPhase, f64, Option<f64>) + Send + Sync>>,
    pub on_state_change: Option<Arc<dyn Fn(UploadState) + Send + Sync>>,
}
```

| Property               | Type                                                               | Description                                                                                                           |
| ---------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `force`                | `Option<bool>`                                                     | If true, forces complete upload even if remote index exists. If false, only new and modified chunks will be uploaded. |
| `require_remote_index` | `Option<bool>`                                                     | If true and no remote index found, abort upload. If false (default), uploads everything if no remote index found.     |
| `ignore_patterns`      | `Option<Vec<String>>`                                              | Files or directories that must be ignored when creating the rd-index.json.                                            |
| `on_progress`          | `Option<Arc<dyn Fn(UploadPhase, f64, Option<f64>) + Send + Sync>>` | Optional callback to inform progress.                                                                                 |
| `on_state_change`      | `Option<Arc<dyn Fn(UploadState) + Send + Sync>>`                   | Optional callback for state changes.                                                                                  |

```rust
pub enum UploadState {
    Uploading,
    Comparing,
    Cleaning,
    Finalizing,
    Scanning,
}

pub enum UploadPhase {
    Upload,
    Deleting,
}
```

---

## PipelineError

Custom error enum for results of HashUploadPipeline. (Uses `thiserror`)

```rust
pub enum PipelineError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Delta error: {0}")]
    Delta(String),

    #[error("Storage error: {0}")]
    Storage(String),

    #[error("Index error: {0}")]
    Index(String),

    #[error("Invalid argument: {0}")]
    InvalidArgument(String),

    #[error("Operation aborted")]
    Aborted,

    #[error("Other error: {0}")]
    Other(String),
}
```

---

## Method details

### `execute(directory, remote_index, options)`

Performs a full upload process for a directory. Returns the resulting `RDIndex` after upload.

**Parameters**

| Name           | Type                    | Description                                                                    |
| -------------- | ----------------------- | ------------------------------------------------------------------------------ |
| `directory`    | `&Path`                 | Directory that will be compared and uploaded.                                  |
| `remote_index` | `Option<RDIndex>`       | Optional remote rd-index. If none provided, will try to download from storage. |
| `options`      | `Option<UploadOptions>` | Options for the upload process. See UploadOptions above.                       |

**Returns**

`Result<RDIndex, PipelineError>`

---

### `scan_directory(dir, ignore_patterns)`

Scans the directory recursively and creates an RDIndex, ignoring files matching the provided patterns.

**Parameters**

| Name             | Type                  | Description                                                                         |
| ---------------- | --------------------- | ----------------------------------------------------------------------------------- |
| `dir`            | `&Path`               | Directory that will be scanned.                                                     |
| `ignorePatterns` | `Option<Vec<String>>` | Optional ignore patterns, these patterns will be ignored when creating the RDIndex. |

**Returns**

`Result<RDIndex, PipelineError>`

---

### `upload_missing_chunks(plan, base_dir, force, options)`

Uploads only the missing or updated chunks defined in a DeltaPlan.

**Parameters**

| Name       | Type                    | Description                                              |
| ---------- | ----------------------- | -------------------------------------------------------- |
| `plan`     | `&DeltaPlan`            | The delta plan indicating which chunks are missing.      |
| `base_dir` | `&Path`                 | Base directory containing local files.                   |
| `force`    | `bool`                  | If true, will force overwrite of chunks in storage.      |
| `options`  | `Option<UploadOptions>` | Options for the upload process. See UploadOptions above. |

**Returns**

`Result<(), PipelineError>`

---

### `upload_index(index)`

Uploads the RDIndex file to the storage adapter.

**Parameters**

| Name    | Type       | Description                 |
| ------- | ---------- | --------------------------- |
| `index` | `&RDIndex` | The index object to upload. |

**Returns**

`Result<(), PipelineError>`

---

### `delete_obsolete_chunks(plan, options)`

Deletes obsolete chunks from the storage as specified by the delta plan.

**Parameters**

| Name      | Type                    | Description                                              |
| --------- | ----------------------- | -------------------------------------------------------- |
| `plan`    | `&DeltaPlan`            | The delta plan indicating which chunks are obsolete.     |
| `options` | `Option<UploadOptions>` | Options for the upload process. See UploadOptions above. |

**Returns**

`Result<(), PipelineError>`

---

### `update_progress(value, phase, speed, options)`

Method that will be internally used to call given `on_progress` callback in options.

**Parameters**

| Name      | Type                     | Description                                           |
| --------- | ------------------------ | ----------------------------------------------------- |
| `value`   | `f64`                    | Value of the progress.                                |
| `phase`   | `UploadPhase`            | Current upload phase (uploading or deleting).         |
| `speed`   | `Option<f64>`            | Speed in bytes/s for uploading phase.                 |
| `options` | `Option<&UploadOptions>` | Options that must include the `on_progress` callback. |

**Returns** `()`

---

### `change_state(state, options)`

Method that will be internally used to call given `on_state_change` callback in options.

**Parameters**

| Name      | Type                     | Description                                               |
| --------- | ------------------------ | --------------------------------------------------------- |
| `state`   | `UploadState`            | Current state of the progress.                            |
| `options` | `Option<&UploadOptions>` | Options that must include the `on_state_change` callback. |

**Returns** `()`

---

## Related

- [UrlUploadPipeline](/docs/reference/Rust/pipelines/url-upload-pipeline)
- [RDIndex](/docs/reference/Rust/models/rdindex)

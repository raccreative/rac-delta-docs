---
title: UrlUploadPipeline
description: Abstract upload pipeline adapter for url-based chunk access for upload flow.
sidebar_position: 2
---

# UrlUploadPipeline

`UrlUploadPipeline` is an abstract class designed to handle uploads using URL-based storage adapters (`UrlStorageAdapter`).
Unlike `HashUploadPipeline`, this pipeline assumes that the delta plan (which chunks to upload or delete) is calculated externally and provided to the pipeline.

This pipeline is commonly used for remote storage systems where each chunk has a dedicated URL for upload or deletion.

---

## Constructor

| Parameter | Type                         | Description                                                                    |
| --------- | ---------------------------- | ------------------------------------------------------------------------------ |
| `storage` | `Arc<dyn UrlStorageAdapter>` | Url based storage adapter that will be used (automatically created by client). |
| `config`  | `Arc<RacDeltaConfig>`        | Base client configuration.                                                     |

---

## Methods

| Method                                          | Returns                          | Description                                                      |
| ----------------------------------------------- | -------------------------------- | ---------------------------------------------------------------- |
| `execute(local_index, urls, options)`           | `Result<RDIndex, PipelineError>` | Performs a full upload process for given urls.                   |
| `upload_missing_chunks(upload_urls, options)`   | `Result<(), PipelineError>`      | Uploads the chunks defined in uploadUrls.                        |
| `upload_index(index, upload_url)`               | `Result<(), PipelineError>`      | Uploads the RDIndex file to the given url.                       |
| `delete_obsolete_chunks(delete_urls, options)`  | `Result<(), PipelineError>`      | Deletes obsolete chunks from the storage as specified by urls.   |
| `update_progress(value, phase, speed, options)` | `()`                             | Optional method that calls the progress callback in options.     |
| `change_state(state, options)`                  | `()`                             | Optional method that calls the change_state callback in options. |

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

Custom error enum for results of UrlUploadPipeline. (Uses `thiserror`)

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

### `execute(local_index, urls, options)`

Performs the full upload process using the provided URLs for chunks and index.

**Parameters**

| Name               | Type                            | Description                                                                            |
| ------------------ | ------------------------------- | -------------------------------------------------------------------------------------- |
| `local_index`      | `RDIndex`                       | The local rd-index needed to sync, required as user should have already compared both. |
| `urls.upload_urls` | `HashMap<String, ChunkUrlInfo>` | The urls identified by hash to upload chunks. See ChunkUrlInfo below.                  |
| `urls.delete_urls` | `Option<Vec<String>>`           | The urls to delete remote obsolete chunks.                                             |
| `urls.index_url`   | `String`                        | The url to upload the new rd-index.json.                                               |
| `options`          | `Option<UploadOptions>`         | Options for the upload process. See UploadOptions above.                               |

```rust
pub struct ChunkUrlInfo {
    pub url: String,
    pub offset: u64,
    pub size: u64,
    pub file_path: String,
}
```

See [ChunkUrlInfo](/docs/reference/Rust/models/chunk-url-info)

**Returns**

`Result<RDIndex, PipelineError>`

---

### `upload_missing_chunks(upload_urls, options)`

Uploads all missing chunks to their respective URLs. Chunks are read from disk based on the paths specified in `ChunkUrlInfo`.

**Parameters**

| Name          | Type                            | Description                                                                                                   |
| ------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `upload_urls` | `HashMap<String, ChunkUrlInfo>` | The urls identified by hash to upload chunks. See [ChunkUrlInfo](/docs/reference/Rust/models/chunk-url-info). |
| `options`     | `Option<UploadOptions>`         | Options for the upload process. See UploadOptions above.                                                      |

**Returns**

`Result<(), PipelineError>`

---

### `upload_index(index, upload_url)`

Uploads the RDIndex file to the specified URL.

**Parameters**

| Name         | Type       | Description                 |
| ------------ | ---------- | --------------------------- |
| `index`      | `&RDIndex` | The index object to upload. |
| `upload_url` | `&str`     | Url to upload index.        |

**Returns**

`Result<(), PipelineError>`

---

### `delete_obsolete_chunks(delete_urls, options)`

Deletes obsolete chunks from the remote storage using their URLs. Includes retry logic and progress tracking.

**Parameters**

| Name          | Type                    | Description                                              |
| ------------- | ----------------------- | -------------------------------------------------------- |
| `delete_urls` | `Vec<String>`           | The urls list to delete.                                 |
| `options`     | `Option<UploadOptions>` | Options for the upload process. See UploadOptions above. |

**Returns**

`Promise<void>`

### `update_progress(value, phase, speed, options)`

Method that will be internally used to call given `on_progress` callback in options.

**Parameters**

| Name      | Type                     | Description                                           |
| --------- | ------------------------ | ----------------------------------------------------- |
| `value`   | `f64`                    | Value of the progress.                                |
| `phase`   | `UploadPhase`            | Current upload phase (downloading or deleting).       |
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

- [HashUploadPipeline](/docs/reference/Rust/pipelines/hash-upload-pipeline)
- [RDIndex](/docs/reference/Rust/models/rdindex)

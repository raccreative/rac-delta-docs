---
title: RDIndex
description: Representation of a rd-index.json within the Rust SDK.
sidebar_position: 4
---

# RDIndex

A `RDIndex` represents a single rd-index.json file.  
It describes the version of the rd-index, creation timestamp, the chunk size used to divide files, and the list of files that compose the index.

Each instance is produced automatically by the SDK when scanning directories.

---

## Structure

```rust
pub struct RDIndex {
  pub version: u32;
  pub created_at: u64;
  pub chunk_size: u64;
  pub files: Vec<FileEntry>;
}
```

## Properties

| Property   | Type             | Description                                           |
| ---------- | ---------------- | ----------------------------------------------------- |
| version    | `u32`            | Version of the rac-delta protocol used (default is 1) |
| created_at | `u64`            | Unix timestamp (ms) when the file was created.        |
| chunk_size | `u64`            | Size of the chunk used to divide files.               |
| files      | `Vec<FileEntry>` | List of files of the rd-index and its chunks.         |

## Related models

- [Chunk](/reference/Rust/models/chunk)
- [FileEntry](/reference/Rust/models/file-entry)

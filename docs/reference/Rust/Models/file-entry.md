---
title: FileEntry
description: Representation of a file entry in the rd-index.json within the Rust SDK.
sidebar_position: 3
---

# FileEntry

A `FileEntry` represents a single file inside an `RDIndex`.  
It describes the file path, size, hash, last modification timestamp, and the list of chunks that compose the file.

Each instance is produced automatically by the SDK when scanning directories or reconstructing an index.

---

## Structure

```rust
pub struct FileEntry {
  pub path: String;
  pub size: u64;
  pub hash: String;
  pub modified_at: u64;
  pub chunks: Vec<Chunk>;
}
```

## Properties

| Property   | Type         | Description                                          |
| ---------- | ------------ | ---------------------------------------------------- |
| path       | `String`     | Relative path of the file inside the indexed root    |
| size       | `u64`        | Size of the file in bytes                            |
| hash       | `String`     | The hash of the file (blake3)                        |
| modifiedAt | `u64`        | Unix timestamp (ms) when the file was last modified. |
| chunks     | `Vec<Chunk>` | List of chunks representing this file.               |

## Related models

- [Chunk](/docs/reference/Rust/models/chunk)
- [RDIndex](/docs/reference/Rust/models/rdindex)

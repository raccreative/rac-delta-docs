---
title: Chunk
description: Representation of a chunk of a file in the rd-index.json within the Rust SDK.
sidebar_position: 1
---

# Chunk

A `Chunk` represents a single chunk inside a `FileEntry` inside a `RDIndex`.  
It describes the chunk hash, the offset and the chunk size.

Each instance is produced automatically by the SDK when scanning directories or generating file entries.

---

## Structure

```rust
pub struct Chunk {
  pub hash: String;
  pub offset: u64;
  pub size: u64;
}
```

## Properties

| Property | Type     | Description                                  |
| -------- | -------- | -------------------------------------------- |
| hash     | `String` | Hash of the chunk (blake3)                   |
| offset   | `u64`    | The offset position of the chunk in the file |
| size     | `u64`    | Size of the chunk in bytes                   |

---

## Related models

- [FileEntry](/docs/reference/Rust/models/file-entry)
- [RDIndex](/docs/reference/Rust/models/rdindex)

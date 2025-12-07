---
title: StorageAdapter
description: Abstract storage adapter.
sidebar_position: 1
---

# StorageAdapter

`StorageAdapter` defines the contract for any storage backend that stores chunks.

It has two extensions, `HashStorageAdapter` and `UrlStorageAdapter`.

```rust
pub trait StorageAdapter: Send + Sync {
    async fn dispose(&self);
}
```

---

## Methods

| Method      | Returns                    | Description                                   |
| ----------- | -------------------------- | --------------------------------------------- |
| `dispose()` | `Pin<Box<dyn Future<()>>>` | Disposes the storage connection if supported. |

---

## StorageError

Custom error enum for results of Storage Adapters. (Uses `thiserror`)

```rust
pub enum StorageError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Chunk not found: {0}")]
    NotFound(String),

    #[error("Chunk already exists: {0}")]
    AlreadyExists(String),

    #[error("Serialization error: {0}")]
    SerdeJson(#[from] serde_json::Error),

    #[error("Other error: {0}")]
    Other(String),
}
```

---

## Related

- [HashStorageAdapter](/reference/Rust/adapters/hash-storage-adapter)
- [UrlStorageAdapter](/reference/Rust/adapters/url-storage-adapter)

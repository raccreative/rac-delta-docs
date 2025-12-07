---
title: StorageAdapter
description: Adaptador de almacenamiento abstracto.
sidebar_position: 1
---

# StorageAdapter

`StorageAdapter` define el contrato para cualquier backend de almacenamiento que guarde chunks.

Tiene dos extensiones, `HashStorageAdapter` y `UrlStorageAdapter`.

```rust
pub trait StorageAdapter: Send + Sync {
    async fn dispose(&self);
}
```

---

## Métodos

| Método      | Devuelve                   | Descripción                                           |
| ----------- | -------------------------- | ----------------------------------------------------- |
| `dispose()` | `Pin<Box<dyn Future<()>>>` | Deshecha la conexión de almacenamiento si se soporta. |

---

## StorageError

Enum de errores personalizado para los resultados de StorageAdapter. (Usa `thiserror`)

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

## Relacionado

- [HashStorageAdapter](/reference/Rust/adapters/hash-storage-adapter)
- [UrlStorageAdapter](/reference/Rust/adapters/url-storage-adapter)

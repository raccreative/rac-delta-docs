---
title: ValidationService
description: Service for validating files and RDIndex objects.
sidebar_position: 2
---

# ValidationService

`ValidationService` validates files and RDIndex objects.  
Internally, it uses `HasherService` to verify file and chunk hashes.

```rust
pub trait ValidationService: Send + Sync {
  ...
}
```

---

## Methods

| Method                             | Returns                         | Description                                      |
| ---------------------------------- | ------------------------------- | ------------------------------------------------ |
| `validate_file(entry, path)`       | `Result<bool, ValidationError>` | Validates a single file against its `FileEntry`. |
| `validate_index(index, base_path)` | `Result<bool, ValidationError>` | Validates all files described in an `RDIndex`.   |

---

## ValidationError

Custom error enum for results of ValidationService. (Uses `thiserror`)

```rust
pub enum ValidationError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Hash verification failed")]
    HashMismatch,
}
```

---

## Method Details

### `validate_file(entry, path)`

Verifies a file.

**Parameters:**

| Name    | Type         | Description                      |
| ------- | ------------ | -------------------------------- |
| `entry` | `&FileEntry` | Metadata of the file to validate |
| `path`  | `&str`       | Path to the file on disk         |

**Returns:** `Result<bool, ValidationError>` – `true` if the file is valid.

**Notes:** Uses `HasherService` internally to verify the hash of the file and its chunks.

---

### `validate_index(index, base_path)`

Verifies every file within a rd-index.json.

**Parameters:**

| Name        | Type       | Description                                 |
| ----------- | ---------- | ------------------------------------------- |
| `index`     | `&RDIndex` | RDIndex object describing files to validate |
| `base_path` | `&str`     | Directory containing the files              |

**Returns:** `Result<bool, ValidationError>` – `true` if all files are valid.

**Notes:** Internally calls `validateFile` for each file using `HasherService`.

## Related

- [RDIndex](/reference/Rust/models/rdindex)
- [FileEntry](/reference/Rust/models/file-entry)
- [HasherService](/reference/Rust/services/hasher-service)

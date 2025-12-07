---
title: HashStorageAdapter
description: Abstract storage adapter for hash-based chunk access.
sidebar_position: 2
---

# HashStorageAdapter

`HashStorageAdapter` defines the contract for any storage backend that stores chunks
identified by **hash**.  
It extends [`StorageAdapter`](./storage-adapter).

This class is abstract; real implementations belong to the infrastructure layer
and are not used directly by consumers of the SDK.

---

## Methods

| Method                        | Returns                                                                     | Description                            |
| ----------------------------- | --------------------------------------------------------------------------- | -------------------------------------- |
| `get_chunk(hash)`             | `Result<Option<Box<dyn AsyncRead + Send + Unpin + 'static>>, StorageError>` | Retrieve a chunk stream by its hash.   |
| `put_chunk(hash, data, opts)` | `Result<(), StorageError>`                                                  | Upload a chunk from a readable stream. |
| `chunk_exists(hash)`          | `Result<bool, StorageError>`                                                | Check whether a chunk exists.          |
| `delete_chunk(hash)`          | `Result<(), StorageError>`                                                  | Delete a chunk.                        |
| `list_chunks()`               | `Result<Option<Vec<String>>, StorageError>`                                 | Optional: list stored chunk hashes.    |
| `get_chunk_info(hash)`        | `Result<Option<BlobInfo>, StorageError>`                                    | Optional: return chunk metadata.       |
| `get_remote_index()`          | `Result<Option<RDIndex>, StorageError>`                                     | Retrieve remote rd-index.json          |
| `put_remote_index(index)`     | `Result<(), StorageError>`                                                  | Upload remote rd-index.json            |

---

## Method details

### `get_chunk(hash)`

Retrieve a readable stream of a chunk, or `None` if the chunk is not present.

**Parameters**

| Name   | Type   | Description       |
| ------ | ------ | ----------------- |
| `hash` | `&str` | Chunk identifier. |

**Returns**

```rust
Result<Option<Box<dyn AsyncRead + Send + Unpin + 'static>>, StorageError>
```

---

### `put_chunk(hash, data, opts)`

Upload a chunk identified by its hash.

**Parameters**

| Name             | Type                                          | Description                                                                 |
| ---------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| `hash`           | `&str`                                        | Chunk hash.                                                                 |
| `data`           | `Box<dyn AsyncRead + Send + Unpin + 'static>` | Source data stream.                                                         |
| `opts.overwrite` | `Option<bool>`                                | Whether to overwrite if exists.                                             |
| `opts.size`      | `Option<u64>`                                 | Optional size of the chunk, often needed by some storage providers like S3. |

**Returns**

`Result<(), StorageError>`

---

### `chunk_exists(hash)`

Check if a chunk with given hash exists.

**Parameters**

| Name   | Type   | Description |
| ------ | ------ | ----------- |
| `hash` | `&str` | Chunk hash. |

**Returns**

`Result<bool, StorageError>`

---

### `delete_chunk(hash)`

Deletes a chunk with given hash if exists.

**Parameters**

| Name   | Type   | Description       |
| ------ | ------ | ----------------- |
| `hash` | `&str` | Chunk identifier. |

**Returns**

`Result<(), StorageError>`

---

### `list_chunks()`

Retrieves a list of chunk hashes of the workspace. Optional method.

**Returns**

`Result<option<Vec<String>>, StorageError>`

---

### `get_chunk_info(hash)`

Retrieves metadata of given chunk by hash if exists. Optional method.

**Parameters**

| Name   | Type   | Description            |
| ------ | ------ | ---------------------- |
| `hash` | `&str` | Chunk hash identifier. |

**Returns**

`Result<Option<BlobInfo>, StorageError>`

```rust
pub struct BlobInfo {
  pub hash: String;
  pub size: u64;
  pub modified: Option<u64>;
  pub metadata: Option<HashMap<String, String>>;
}
```

---

### `get_remote_index()`

Retrieves remote rd-index.json if found on workspace path.

**Returns**

`Result<Option<RDIndex>, StorageError>`

---

### `put_remote_index(index)`

Uploads a rd-index.json to storage workspace (storage-config-path/rd-index.json).

**Parameters**

| Name    | Type      | Description          |
| ------- | --------- | -------------------- |
| `index` | `RDIndex` | The rd-index object. |

**Returns**

`Result<(), StorageError>`

---

## Related

- [RDIndex](/reference/Rust/models/rdindex)
- [StorageAdapter](/reference/Rust/adapters/storage-adapter)
- [StorageError](/reference/Rust/adapters/storage-adapter#storageerror)

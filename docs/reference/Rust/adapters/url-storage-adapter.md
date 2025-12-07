---
title: UrlStorageAdapter
description: Abstract storage adapter for url-based chunk access.
sidebar_position: 3
---

# UrlStorageAdapter

`UrlStorageAdapter` defines the contract for any storage backend that stores chunks
accessed by **url**.  
It extends [`StorageAdapter`](./storage-adapter).

This class is abstract; real implementations belong to the infrastructure layer
and are not used directly by consumers of the SDK.

---

## Methods

| Method                                | Returns                                                                     | Description                                |
| ------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------ |
| `get_chunk_by_url(url)`               | `Result<Option<Box<dyn AsyncRead + Send + Unpin + 'static>>, StorageError>` | Retrieve a chunk stream by url.            |
| `put_chunk_by_url(url, data)`         | `Result<(), StorageError>`                                                  | Uploads a chunk from a stream by url.      |
| `delete_chunk_by_url(url)`            | `Result<(), StorageError>`                                                  | Deletes a chunk via url.                   |
| `chunk_exists_by_url(url)`            | `Result<bool, StorageError>`                                                | Check whether a chunk exists via url.      |
| `list_chunks_by_url(url)`             | `Result<Option<Vec<String>>, StorageError>`                                 | Optional: list stored chunk hashes by url. |
| `get_chunk_info_by_url(hash, url)`    | `Result<Option<BlobInfo>, StorageError>`                                    | Optional: return chunk metadata via url.   |
| `get_remote_index_by_url(url)`        | `Result<Option<RDIndex>, StorageError>`                                     | Retrieve remote rd-index.json by url.      |
| `put_remote_index_by_url(url, index)` | `Result<(), StorageError>`                                                  | Upload remote rd-index.json by url.        |

---

## Method details

### `get_chunk_by_url(url)`

Retrieve a stream of a chunk, or `None` if the chunk is not present by url.

**Parameters**

| Name  | Type     | Description                                      |
| ----- | -------- | ------------------------------------------------ |
| `url` | `string` | Url that will be used to retrieve desired chunk. |

**Returns**

```rust
Result<Option<Box<dyn AsyncRead + Send + Unpin + 'static>>, StorageError>
```

---

### `put_chunk_by_url(url, data)`

Upload a chunk by url.

**Parameters**

| Name   | Type                                          | Description          |
| ------ | --------------------------------------------- | -------------------- |
| `url`  | `&str`                                        | Url to upload chunk. |
| `data` | `Box<dyn AsyncRead + Send + Unpin + 'static>` | Source data stream.  |

**Returns**

`Result<(), StorageError>`

---

### `delete_chunk_by_url(url)`

Deletes a chunk by url if exists.

**Parameters**

| Name  | Type   | Description          |
| ----- | ------ | -------------------- |
| `url` | `&str` | Url to delete chunk. |

**Returns**

`Result<(), StorageError>`

---

### `chunk_exists_by_url(url)`

Check if a chunk exists by url.

**Parameters**

| Name  | Type   | Description                   |
| ----- | ------ | ----------------------------- |
| `url` | `&str` | Url to check if chunk exists. |

**Returns**

`Result<bool, StorageError>`

---

### `list_chunks_by_url(url)`

Retrieves a list of chunk hashes by url. Optional method.

**Parameters**

| Name  | Type   | Description         |
| ----- | ------ | ------------------- |
| `url` | `&str` | Url to list chunks. |

**Returns**

`Result<Option<Vec<String>>, StorageError>`

---

### `get_chunk_info_by_url(hash, url)`

Retrieves metadata of given chunk by url. Optional method.

**Parameters**

| Name   | Type   | Description                      |
| ------ | ------ | -------------------------------- |
| `hash` | `&str` | Hash of the chunk for reference. |
| `url`  | `&str` | Url to get chunk info.           |

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

### `get_remote_index_by_url(url)`

Retrieves remote rd-index.json from given url.

**Parameters**

| Name  | Type   | Description       |
| ----- | ------ | ----------------- |
| `url` | `&str` | Url to get index. |

**Returns**

`Result<Option<RDIndex>, StorageError>`

---

### `put_remote_index_by_url(url, index)`

Uploads a rd-index.json to storage by url.

**Parameters**

| Name    | Type      | Description             |
| ------- | --------- | ----------------------- |
| `url`   | `&str`    | The url to upload index |
| `index` | `RDIndex` | The rd-index object     |

**Returns**

`Result<(), StorageError>`

---

## Related

- [RDIndex](/reference/Rust/models/rdindex)
- [StorageAdapter](/reference/Rust/adapters/storage-adapter)
- [StorageError](/reference/Rust/adapters/storage-adapter#storageerror)

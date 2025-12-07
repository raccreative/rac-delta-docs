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

## Properties

| Name   | Type    | Description                      |
| ------ | ------- | -------------------------------- |
| `type` | `"url"` | Identifies the adapter category. |

---

## Methods

| Method                            | Returns                     | Description                                   |
| --------------------------------- | --------------------------- | --------------------------------------------- |
| `getChunkByUrl(url)`              | `Promise<Readable \| null>` | Retrieve a chunk stream by url.               |
| `putChunkByUrl(url, data)`        | `Promise<void>`             | Upload a chunk from a readable stream by url. |
| `chunkExistsByUrl(url)`           | `Promise<boolean>`          | Check whether a chunk exists via url.         |
| `deleteChunkByUrl(url)`           | `Promise<void>`             | Delete a chunk via url.                       |
| `listChunksByUrl?(url)`           | `Promise<string[]>`         | Optional: list stored chunk hashes by url.    |
| `getChunkInfoByUrl?(url)`         | `Promise<BlobInfo \| null>` | Optional: return chunk metadata via url.      |
| `getRemoteIndexByUrl(url)`        | `Promise<RDIndex \| null>`  | Retrieve remote rd-index.json by url          |
| `putRemoteIndexByUrl(url, index)` | `Promise<void>`             | Upload remote rd-index.json by url            |

---

## Method details

### `getChunkByUrl(url)`

Retrieve a readable stream of a chunk, or `null` if the chunk is not present by url.

**Parameters**

| Name  | Type     | Description                                     |
| ----- | -------- | ----------------------------------------------- |
| `url` | `string` | Url that will be used to retrieve desired chunk |

**Returns**

`Promise<Readable | null>`

---

### `putChunkByUrl(url, data)`

Upload a chunk by url.

**Parameters**

| Name   | Type       | Description         |
| ------ | ---------- | ------------------- |
| `url`  | `string`   | Url to upload chunk |
| `data` | `Readable` | Source data stream  |

**Returns**

`Promise<void>`

---

### `chunkExistsByUrl(url)`

Check if a chunk exists by url.

**Parameters**

| Name  | Type     | Description                  |
| ----- | -------- | ---------------------------- |
| `url` | `string` | Url to check if chunk exists |

**Returns**

`Promise<boolean>`

---

### `deleteChunkByUrl(url)`

Deletes a chunk by url if exists.

**Parameters**

| Name  | Type     | Description         |
| ----- | -------- | ------------------- |
| `url` | `string` | Url to delete chunk |

**Returns**

`Promise<void>`

---

### `listChunksByUrl?(url)`

Retrieves a list of chunk hashes by url. Optional method.

**Parameters**

| Name  | Type     | Description        |
| ----- | -------- | ------------------ |
| `url` | `string` | Url to list chunks |

**Returns**

`Promise<string[]>`

---

### `getChunkInfoByUrl?(url)`

Retrieves metadata of given chunk by url. Optional method.

**Parameters**

| Name  | Type     | Description           |
| ----- | -------- | --------------------- |
| `url` | `string` | Url to get chunk info |

**Returns**

`Promise<BlobInfo | null>`

```ts
export interface BlobInfo {
  hash: string;
  size: number;
  modified?: Date;
  metadata?: Record<string, string>;
}
```

---

### `getRemoteIndexByUrl(url)`

Retrieves remote rd-index.json from given url.

**Parameters**

| Name  | Type     | Description      |
| ----- | -------- | ---------------- |
| `url` | `string` | Url to get index |

**Returns**

`Promise<RDIndex | null>`

---

### `putRemoteIndexByUrl(url, index)`

Uploads a rd-index.json to storage by url.

**Parameters**

| Name    | Type      | Description             |
| ------- | --------- | ----------------------- |
| `url`   | `string`  | The url to upload index |
| `index` | `RDIndex` | The rd-index object     |

**Returns**

`Promise<void>`

---

## Related

- [RDIndex](/reference/NodeJS/models/rdindex)
- [StorageAdapter](/reference/NodeJS/adapters/storage-adapter)

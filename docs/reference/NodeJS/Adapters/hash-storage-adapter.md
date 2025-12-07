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

## Properties

| Name   | Type     | Description                      |
| ------ | -------- | -------------------------------- |
| `type` | `"hash"` | Identifies the adapter category. |

---

## Methods

| Method                        | Returns                     | Description                            |
| ----------------------------- | --------------------------- | -------------------------------------- |
| `getChunk(hash)`              | `Promise<Readable \| null>` | Retrieve a chunk stream by its hash.   |
| `putChunk(hash, data, opts?)` | `Promise<void>`             | Upload a chunk from a readable stream. |
| `chunkExists(hash)`           | `Promise<boolean>`          | Check whether a chunk exists.          |
| `deleteChunk(hash)`           | `Promise<void>`             | Delete a chunk.                        |
| `listChunks?()`               | `Promise<string[]>`         | Optional: list stored chunk hashes.    |
| `getChunkInfo?(hash)`         | `Promise<BlobInfo \| null>` | Optional: return chunk metadata.       |
| `getRemoteIndex()`            | `Promise<RDIndex \| null>`  | Retrieve remote rd-index.json          |
| `putRemoteIndex(index)`       | `Promise<void>`             | Upload remote rd-index.json            |

---

## Method details

### `getChunk(hash)`

Retrieve a readable stream of a chunk, or `null` if the chunk is not present.

**Parameters**

| Name   | Type     | Description      |
| ------ | -------- | ---------------- |
| `hash` | `string` | Chunk identifier |

**Returns**

`Promise<Readable | null>`

---

### `putChunk(hash, data, opts?)`

Upload a chunk identified by its hash.

**Parameters**

| Name              | Type       | Description                                                                |
| ----------------- | ---------- | -------------------------------------------------------------------------- |
| `hash`            | `string`   | Chunk hash                                                                 |
| `data`            | `Readable` | Source data stream                                                         |
| `opts.overwrite?` | `boolean`  | Whether to overwrite if exists                                             |
| `opts.size?`      | `number`   | Optional size of the chunk, often needed by some storage providers like S3 |

**Returns**

`Promise<void>`

---

### `chunkExists(hash)`

Check if a chunk with given hash exists.

**Parameters**

| Name   | Type     | Description |
| ------ | -------- | ----------- |
| `hash` | `string` | Chunk hash  |

**Returns**

`Promise<boolean>`

---

### `deleteChunk(hash)`

Deletes a chunk with given hash if exists.

**Parameters**

| Name   | Type     | Description      |
| ------ | -------- | ---------------- |
| `hash` | `string` | Chunk identifier |

**Returns**

`Promise<void>`

---

### `listChunks?()`

Retrieves a list of chunk hashes of the workspace. Optional method.

**Returns**

`Promise<string[]>`

---

### `getChunkInfo?(hash)`

Retrieves metadata of given chunk by hash if exists. Optional method.

**Parameters**

| Name   | Type     | Description      |
| ------ | -------- | ---------------- |
| `hash` | `string` | Chunk identifier |

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

### `getRemoteIndex()`

Retrieves remote rd-index.json if found on workspace path.

**Returns**

`Promise<RDIndex | null>`

---

### `putRemoteIndex(index)`

Uploads a rd-index.json to storage workspace (storage-config-path/rd-index.json).

**Parameters**

| Name    | Type      | Description         |
| ------- | --------- | ------------------- |
| `index` | `RDIndex` | The rd-index object |

**Returns**

`Promise<void>`

---

## Related

- [RDIndex](/reference/NodeJS/models/rdindex)
- [StorageAdapter](/reference/NodeJS/adapters/storage-adapter)

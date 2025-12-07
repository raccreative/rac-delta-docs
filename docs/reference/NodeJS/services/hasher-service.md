---
title: HasherService
description: Abstract service for hashing files, streams, and buffers.
sidebar_position: 1
---

# HasherService

`HasherService` defines the API to calculate hashes of files, chunks, streams, and buffers.
It is abstract; real implementations are in the infrastructure layer
(e.g., `HashWasmHasherService` in Node.js).

This page documents the **public API available in the Node.js SDK**.

---

## Methods

| Method                                   | Returns                    | Description                                                         |
| ---------------------------------------- | -------------------------- | ------------------------------------------------------------------- |
| `hashFile(filePath, rootDir, chunkSize)` | `Promise<FileEntry>`       | Returns a `FileEntry` calculating the file hash and chunk hashes.   |
| `hashStream(stream, onChunk?)`           | `Promise<Chunk[]>`         | Processes a stream of chunks and returns an array of hashed chunks. |
| `hashBuffer(data)`                       | `Promise<string>`          | Returns the hash of a buffer (hex string).                          |
| `verifyChunk(data, expectedHash)`        | `Promise<boolean>`         | Verifies that a chunk has the expected hash.                        |
| `verifyFile(path, expectedHash)`         | `Promise<boolean>`         | Verifies that a file has the expected hash.                         |
| `createStreamingHasher()`                | `Promise<StreamingHasher>` | Creates a `StreamingHasher` object for incremental hashing.         |

---

## Method Details

### `hashFile(filePath, rootDir, chunkSize)`

Returns a `FileEntry` of the given file, calculating its hash and chunk hashes.

**IMPORTANT NOTE:** selected chunkSize must be the same in all operations of rac-delta

**Parameters:**

| Name        | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `filePath`  | `string` | Relative path of the file (`dir/file.txt`)     |
| `rootDir`   | `string` | Root directory of the index (`dir`)            |
| `chunkSize` | `number` | Size in bytes of each chunk (recommended 1 MB) |

**Returns:** `Promise<FileEntry>`

---

### `hashStream(stream, onChunk?)`

Processes a stream of chunks, optionally calling `onChunk` for each processed chunk.

**Parameters:**

| Name      | Type                          | Description                             |
| --------- | ----------------------------- | --------------------------------------- |
| `stream`  | `AsyncChunkStream`            | The input chunk stream                  |
| `onChunk` | `(chunk: Uint8Array) => void` | Optional callback for each hashed chunk |

```ts
export interface AsyncChunkStream extends AsyncIterable<Uint8Array> {
  nextChunk(): Promise<Uint8Array | null>;
  reset?(): Promise<void>;
  close?(): Promise<void>;
}
```

**Returns:** `Promise<Chunk[]>`

---

### `hashBuffer(data)`

Hashes a buffer.

| Parameter | Type         | Description        |
| --------- | ------------ | ------------------ |
| `data`    | `Uint8Array` | The buffer to hash |

**Returns:** `Promise<string>` (hex string)

---

### `verifyChunk(data, expectedHash)`

Checks if a chunk has the expected hash.

| Parameter      | Type         | Description   |
| -------------- | ------------ | ------------- |
| `data`         | `Uint8Array` | Chunk data    |
| `expectedHash` | `string`     | Expected hash |

**Returns:** `Promise<boolean>`

---

### `verifyFile(path, expectedHash)`

Checks if a file has the expected hash.

| Parameter      | Type     | Description   |
| -------------- | -------- | ------------- |
| `path`         | `string` | File path     |
| `expectedHash` | `string` | Expected hash |

**Returns:** `Promise<boolean>`

---

### `createStreamingHasher()`

Creates a `StreamingHasher` instance:

```ts
export interface StreamingHasher {
  update(data: Uint8Array | Buffer): void;
  digest(encoding?: 'hex'): string;
}
```

**Returns:** `Promise<StreamingHasher>`

## Example

```ts
const fileEntry = await racDeltaClient.hasher.hashFile('my-dir/file.txt', 'my-dir', 1024 * 1024);
```

## Related

- [RDIndex](/reference/NodeJS/models/rdindex)
- [FileEntry](/reference/NodeJS/models/file-entry)
- [Chunk](/reference/NodeJS/models/chunk)

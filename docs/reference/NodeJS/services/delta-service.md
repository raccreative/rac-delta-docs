---
title: DeltaService
description: Service to generate RDIndex and compute deltas between sources and targets.
sidebar_position: 3
---

# DeltaService

`DeltaService` provides methods to generate `RDIndex` objects from directories or streams,
compare two index, and generate a `DeltaPlan` describing which chunks need to be uploaded,
downloaded, or removed.

Internally, it relies on `HasherService` to hash files and streams.

---

## Methods

| Method                                                                         | Returns              | Description                                                                                     |
| ------------------------------------------------------------------------------ | -------------------- | ----------------------------------------------------------------------------------------------- |
| `createIndexFromDirectory(rootPath, chunkSize, concurrency?, ignorePatterns?)` | `Promise<RDIndex>`   | Scans a directory, splits files into chunks, hashes them, and returns an `RDIndex`.             |
| `createFileEntryFromStream(stream, path)`                                      | `Promise<FileEntry>` | Creates a `FileEntry` from an async chunk stream.                                               |
| `compare(source, target)`                                                      | `DeltaPlan`          | Compares two rd-index and returns a delta plan describing missing, reused, and obsolete chunks. |
| `mergePlans(base, updates)`                                                    | `DeltaPlan`          | Merges two delta plans                                                                          |
| `compareForUpload(localIndex, remoteIndex)`                                    | `Promise<DeltaPlan>` | Prepares delta plan for uploading changes                                                       |
| `compareForDownload(localIndex, remoteIndex)`                                  | `Promise<DeltaPlan>` | Prepares delta plan for downloading                                                             |

---

## Method Details

### `createIndexFromDirectory(rootPath, chunkSize, concurrency?, ignorePatterns?)`

Generates an `RDIndex` for a directory. Splits files into chunks and hashes them.

**Parameters:**

| Name             | Type        | Description                                |
| ---------------- | ----------- | ------------------------------------------ |
| `rootPath`       | `string`    | Directory to scan recursively              |
| `chunkSize`      | `number`    | Size of chunks in bytes (recommended 1MB)  |
| `concurrency`    | `number?`   | Optional max number of parallel operations |
| `ignorePatterns` | `string[]?` | Optional glob patterns to ignore           |

**Returns:** `Promise<RDIndex>`

**Notes:** Uses `HasherService.hashStream` internally.

---

### `createFileEntryFromStream(stream, path)`

Creates a FileEntry from a valid stream of chunks (from a file).

**Parameters:**

| Parameter | Type               | Description               |
| --------- | ------------------ | ------------------------- |
| `stream`  | `AsyncChunkStream` | Input async chunk stream  |
| `path`    | `string`           | Relative path of the file |

```ts
export interface AsyncChunkStream extends AsyncIterable<Uint8Array> {
  nextChunk(): Promise<Uint8Array | null>;
  reset?(): Promise<void>;
  close?(): Promise<void>;
}
```

**Returns:** `Promise<FileEntry>`

**Notes:** Hashes chunks with `HasherService` to produce a compatible `FileEntry`.

---

### `compare(source, target)`

Compares two rd-index to generate a `DeltaPlan`.

**Parameters:**

| Parameter | Type              | Description                |
| --------- | ----------------- | -------------------------- |
| `source`  | `RDIndex`         | Source index               |
| `target`  | `RDIndex \| null` | Target index (can be null) |

**Returns:** `DeltaPlan`

---

### `mergePlans(base, updates)`

Merges two delta plans into one.

**Parameters:**

| Parameter | Type        | Description                 |
| --------- | ----------- | --------------------------- |
| `base`    | `DeltaPlan` | Base delta plan to merge    |
| `updates` | `DeltaPlan` | Updates delta plan to merge |

**Returns:** `DeltaPlan`

---

### `compareForUpload(localIndex, remoteIndex)`

Wrapper to generate a delta plan ready for uploading files.

**Parameters:**

| Parameter     | Type              | Description     |
| ------------- | ----------------- | --------------- |
| `localIndex`  | `RDIndex`         | Local rd-index  |
| `remoteIndex` | `RDIndex \| null` | Remote rd-index |

**Returns:** `Promise<DeltaPlan>`

---

### `compareForDownload(localIndex, remoteIndex)`

Wrapper to generate a delta plan ready for downloading files.

**Parameters:**

| Parameter     | Type              | Description     |
| ------------- | ----------------- | --------------- |
| `localIndex`  | `RDIndex \| null` | Local rd-index  |
| `remoteIndex` | `RDIndex`         | Remote rd-index |

**Returns:** `Promise<DeltaPlan>`

---

## Related

- [RDIndex](/reference/NodeJS/models/rdindex)
- [FileEntry](/reference/NodeJS/models/file-entry)
- [DeltaPlan](/reference/NodeJS/models/delta-plan)
- [HasherService](/reference/NodeJS/services/hasher-service)

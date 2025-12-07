---
title: HashUploadPipeline
description: Abstract upload pipeline adapter for hash-based chunk access for upload flow.
sidebar_position: 2
---

# HashUploadPipeline

`HashUploadPipeline` is an abstract extension of `UploadPipeline` designed to handle uploads using hash-based storage adapters (`HashStorageAdapter`).
It orchestrates the process of scanning directories, computing deltas with `DeltaService`, uploading missing chunks, and cleaning up obsolete chunks.

This pipeline is commonly used when uploading to storage systems where chunks are identified by their hash.

---

## Constructor

| Parameter | Type                 | Description                                                                     |
| --------- | -------------------- | ------------------------------------------------------------------------------- |
| `storage` | `HashStorageAdapter` | Hash based storage adapter that will be used (automatically created by client). |
| `delta`   | `DeltaService`       | DeltaService used for generate rd-index, comparing rd-index, etc.               |
| `config`  | `RacDeltaConfig`     | Base client configuration.                                                      |

---

## Methods

| Method                                                | Returns            | Description                                                              |
| ----------------------------------------------------- | ------------------ | ------------------------------------------------------------------------ |
| `execute(directory, remoteIndex?, options?)`          | `Promise<RDIndex>` | Performs a full upload process for a directory.                          |
| `scanDirectory(dir, ignorePatterns?)`                 | `Promise<RDIndex>` | Scans the directory recursively and creates an RDIndex.                  |
| `uploadMissingChunks(plan, baseDir, force, options?)` | `Promise<void>`    | Uploads only the missing or updated chunks defined in a DeltaPlan.       |
| `uploadIndex(index)`                                  | `Promise<void>`    | Uploads the RDIndex file to the storage adapter.                         |
| `deleteObsoleteChunks(delta, options?)`               | `Promise<void>`    | Deletes obsolete chunks from the storage as specified by the delta plan. |

---

## Method details

### `execute(directory, remoteIndex?, options?)`

Performs a full upload process for a directory. Returns the resulting `RDIndex` after upload.

**Parameters**

| Name          | Type            | Description                                                                          |
| ------------- | --------------- | ------------------------------------------------------------------------------------ |
| `directory`   | `string`        | Directory that will be compared and uploaded.                                        |
| `remoteIndex` | `RDIndex`       | Optional remote rd-index. If none provided, will try to download from storage.       |
| `options`     | `UploadOptions` | Options for the upload process. See [UploadOptions](./upload-pipeline#uploadoptions) |

**Returns**

`Promise<RDIndex>`

---

### `scanDirectory(dir, ignorePatterns?)`

Scans the directory recursively and creates an RDIndex, ignoring files matching the provided patterns.

**Parameters**

| Name             | Type       | Description                                                                         |
| ---------------- | ---------- | ----------------------------------------------------------------------------------- |
| `dir`            | `string`   | Directory that will be scanned.                                                     |
| `ignorePatterns` | `string[]` | Optional ignore patterns, these patterns will be ignored when creating the RDIndex. |

**Returns**

`Promise<RDIndex>`

---

### `uploadMissingChunks(plan, baseDir, force, options?)`

Uploads only the missing or updated chunks defined in a DeltaPlan.

**Parameters**

| Name      | Type            | Description                                                                          |
| --------- | --------------- | ------------------------------------------------------------------------------------ |
| `plan`    | `DeltaPlan`     | The delta plan indicating which chunks are missing.                                  |
| `baseDir` | `string`        | Base directory containing local files.                                               |
| `force`   | `boolean`       | If true, will force overwrite of chunks in storage.                                  |
| `options` | `UploadOptions` | Options for the upload process. See [UploadOptions](./upload-pipeline#uploadoptions) |

**Returns**

`Promise<void>`

---

### `uploadIndex(index)`

Uploads the RDIndex file to the storage adapter.

**Parameters**

| Name    | Type      | Description                 |
| ------- | --------- | --------------------------- |
| `index` | `RDIndex` | The index object to upload. |

**Returns**

`Promise<void>`

---

### `deleteObsoleteChunks(delta, options?)`

Deletes obsolete chunks from the storage as specified by the delta plan.

**Parameters**

| Name      | Type            | Description                                                                          |
| --------- | --------------- | ------------------------------------------------------------------------------------ |
| `delta`   | `DeltaPlan`     | The delta plan indicating which chunks are obsolete.                                 |
| `options` | `UploadOptions` | Options for the upload process. See [UploadOptions](./upload-pipeline#uploadoptions) |

**Returns**

`Promise<void>`

---

## Related

- [UploadPipeline](/reference/NodeJS/pipelines/upload-pipeline)
- [UrlUploadPipeline](/reference/NodeJS/pipelines/url-upload-pipeline)
- [RDIndex](/reference/NodeJS/models/rdindex)

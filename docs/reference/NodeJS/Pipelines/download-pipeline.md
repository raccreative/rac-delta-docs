---
title: DownloadPipeline
description: Base abstract class responsible for managing the file download flow.
sidebar_position: 4
---

# DownloadPipeline

`DownloadPipeline` is the base abstract class responsible for managing the file download flow in rac-delta.
It provides the core structure for notifying progress, handling state changes, and coordinating downloads, but does not implement all the actual storage logic.

This class is meant to be extended by specialized pipelines such as `HashDownloadPipeline` and `UrlDownloadPipeline`.

---

## Methods

Shared base methods.

| Method                                                                              | Returns                                                                                | Description                                                                             |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `updateProgress(value, state, diskUsage?, speed?, options?)`                        | `void`                                                                                 | Callback for progress such as downloading or reconstructing files.                      |
| `changeState(state, options?)`                                                      | `void`                                                                                 | Callback to notify state changes.                                                       |
| `loadLocalIndex(dir)`                                                               | `Promise<RDIndex>`                                                                     | Will create a rd-index.json of a given directory.                                       |
| `findLocalIndex(localDir)`                                                          | `Promise<RDIndex \| null>`                                                             | Will find for a rd-index.json if exists on given folder.                                |
| `verifyAndDeleteObsoleteChunks(plan, localDir, remoteIndex, chunkSource, options?)` | `Promise<{ deletedFiles: string[]; verifiedFiles: string[]; rebuiltFiles: string[] }>` | This method will check for reconstructed files, verifying its hash and obsolete chunks. |
| `saveLocalIndex(localDir, index)`                                                   | `Promise<void>`                                                                        | This method will save the new local index on given folder.                              |

---

## DownloadOptions

The `DownloadOptions` object allows you to customize the behavior of a download:

```ts
export interface DownloadOptions {
  force?: boolean;
  chunksSavePath?: string;
  useExistingIndex?: boolean;
  fileReconstructionConcurrency?: number;
  inPlaceReconstructionThreshold?: number;
  onProgress?: (
    type: 'download' | 'deleting' | 'reconstructing',
    progress: number,
    diskUsage?: number,
    speed?: number
  ) => void;
  onStateChange?: (state: 'downloading' | 'reconstructing' | 'cleaning' | 'scanning') => void;
}
```

| Property                         | Type                                           | Description                                                                                                        |
| -------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `force`                          | `boolean`                                      | If true, downloads everything. If false, only new and modified chunks will be downloaded.                          |
| `chunksSavePath`                 | `string`                                       | Path where chunks will be saved if `DownloadAllFirstToDisk` strategy is set.                                       |
| `useExistingIndex`               | `boolean`                                      | If true, will search first an existing rd-index in local dir.                                                      |
| `fileReconstructionConcurrency`  | `number`                                       | How many files will be reconstructed concurrently.                                                                 |
| `inPlaceReconstructionThreshold` | `number`                                       | Minimum file size (in bytes) required to perform an **in-place reconstruction** instead of using a temporary file. |
| `onProgress`                     | `(type, progress, diskUsage?, speed?) => void` | Optional callback to inform progress.                                                                              |
| `onStateChange`                  | `(state) => void`                              | Optional callback for state changes.                                                                               |

---

## UpdateStrategy

Enum for different strategies for reconstructing and downloading files.

```ts
export enum UpdateStrategy {
  DownloadAllFirstToMemory = 'download-all-first-to-memory',
  StreamFromNetwork = 'stream-from-network',
  DownloadAllFirstToDisk = 'download-all-first-to-disk',
}
```

For more info see: [Download pipeline usage](/docs/usage/downloading#update-strategies)

---

## Method details

### `updateProgress(value, state, diskUsage?, speed?, options?)`

Used to call given `onProgress` callback inside `options`.

**Parameters**

| Name         | Type                                     | Description                                                                              |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| `value`      | `number`                                 | Progress value (0 - 100)                                                                 |
| `state`      | `download \| deleting \| reconstructing` | Which operation is being monitorized                                                     |
| `diskUsage?` | `number`                                 | Speed in bytes/s (only for state reconstructing)                                         |
| `speed?`     | `number`                                 | Speed in bytes/s (only for state download)                                               |
| `options?`   | `DownloadOptions`                        | Options object, see DownloadOptions above for more info (this method only uses callback) |

**Returns**

`void`

---

### `changeState(state, options?)`

Used to call given `onStateChange` callback inside `options`.

**Parameters**

| Name       | Type                                           | Description                                                                              |
| ---------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `state`    | `'download' \| 'deleting' \| 'reconstructing'` | State of the flow.                                                                       |
| `options?` | `DownloadOptions`                              | Options object, see DownloadOptions above for more info (this method only uses callback) |

**Returns**

`void`

---

### `loadLocalIndex(dir)`

This method will create a rd-index.json of a given directory, scanning files and generating hashes.

**Parameters**

| Name  | Type     | Description                          |
| ----- | -------- | ------------------------------------ |
| `dir` | `string` | Directory path to generate rd-index. |

**Returns**

`Promise<RDIndex>`

---

### `findLocalIndex(localDir)`

This method will find for a rd-index.json if exists on given folder.

**Parameters**

| Name       | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| `localDir` | `string` | Directory path to search rd-index. |

**Returns**

`Promise<RDIndex>`

---

### `verifyAndDeleteObsoleteChunks(plan, localDir, remoteIndex, chunkSource, options?)`

This method will check for reconstructed files, verifying its hash and obsolete chunks. If obsolete chunks are still present, it will delete them, and reconstruct file again if needed.

**Parameters**

| Name          | Type              | Description                                                                                                                             |
| ------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `plan`        | `DeltaPlan`       | the `DeltaPlan` generated by delta.compare of the two rd-index.json for the download.                                                   |
| `localDir`    | `string`          | Directory path to check files.                                                                                                          |
| `remoteIndex` | `RDIndex`         | The remote index for reference.                                                                                                         |
| `chunkSource` | `ChunkSource`     | `ChunkSource` to download corrupt chunks in case of invalid files. See [ChunkSource](/docs/reference/NodeJS/chunk-sources/chunk-source) |
| `options?`    | `DownloadOptions` | Options object, see DownloadOptions above for more info (this method only uses callback)                                                |

**Returns**

`Promise<{ deletedFiles: string[]; verifiedFiles: string[]; rebuiltFiles: string[] }>`

---

### `saveLocalIndex(localDir, index)`

This method will save the new local index on given folder.

**Parameters**

| Name       | Type      | Description                                  |
| ---------- | --------- | -------------------------------------------- |
| `localDir` | `string`  | Directory where the new index will be saved. |
| `index`    | `RDIndex` | The RDIndex object to save.                  |

**Returns**

`Promise<void>`

---

## Related

- [HashDownloadPipeline](/docs/reference/NodeJS/pipelines/hash-download-pipeline)
- [UrlDownloadPipeline](/docs/reference/NodeJS/pipelines/url-download-pipeline)
- [ChunkSource](/docs/reference/NodeJS/chunk-sources/chunk-source)
- [RDIndex](/docs/reference/NodeJS/models/rdindex)
- [DeltaPlan](/docs/reference/NodeJS/models/delta-plan)

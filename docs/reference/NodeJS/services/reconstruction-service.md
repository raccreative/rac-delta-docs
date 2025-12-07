---
title: ReconstructionService
description: Service responsible for reconstructing files from chunks using any ChunkSource.
sidebar_position: 4
---

# ReconstructionService

`ReconstructionService` defines the primary interface responsible for **reconstructing files from their chunks**, either on disk or as a stream.  
This service communicates directly with a [`ChunkSource`](../chunk-sources/chunk-source) to obtain the required data and reassemble the file.

It serves as the core component of the restoration process within rac-delta.

---

## Methods

| Method                                                      | Returns             | Description                                                       |
| ----------------------------------------------------------- | ------------------- | ----------------------------------------------------------------- |
| `reconstructFile(entry, outputPath, chunkSource, options?)` | `Promise<void>`     | Reconstruct a single file in disk.                                |
| `reconstructAll(plan, outputDir, chunkSource, options?)`    | `Promise<void>`     | Reconstruct all files from a DeltaPlan in disk.                   |
| `reconstructToStream(entry, chunkSource)`                   | `Promise<Readable>` | Reconstruct a file in memory and returns it as a Readable stream. |

---

## ReconstructionOptions

Options for the reconstruction progress:

```ts
export interface ReconstructionOptions {
  forceRebuild?: boolean;
  verifyAfterRebuild?: boolean;
  inPlaceReconstructionThreshold?: number;
  fileConcurrency?: number;
  onProgress?: (
    reconstructProgress: number,
    diskSpeed: number,
    networkProgress?: number,
    networkSpeed?: number
  ) => void;
}
```

| Parameter                        | Type      | Description                                                                                                                         |
| -------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `forceRebuild`                   | `boolean` | Force to rebuild even if hash file matches.                                                                                         |
| `verifyAfterRebuild`             | `boolean` | Verifies the reconstructed file hash after finishing. If hash does not match, an error is thrown.                                   |
| `inPlaceReconstructionThreshold` | `number`  | Minimum file size (in bytes) required to perform an **in-place reconstruction** instead of using a temporary file.                  |
| `fileConcurrency`                | `number`  | How many files will reconstruct concurrently (default value is 5).                                                                  |
| `onProgress`                     | `boolean` | Callback that returns disk usage and optional network speed (only for storage chunk sources via streaming download-reconstruction). |

---

## Method Details

### `reconstructFile(entry, outputPath, chunkSource, options?)`

Reconstruct a single file from a `FileEntry` in disk.

**Parameters:**

| Name          | Type                    | Description                                                         |
| ------------- | ----------------------- | ------------------------------------------------------------------- |
| `entry`       | `FileEntry`             | The `FileEntry` containing the list of chunks and path of the file. |
| `outputPath`  | `string`                | The path where the file will be reconstructed.                      |
| `chunkSource` | `ChunkSource`           | The chunk source implementation where the chunks will be retrieved. |
| `options?`    | `ReconstructionOptions` | Options for reconstruction.                                         |

**Returns:** `Promise<void>`

---

### `reconstructAll(plan, outputDir, chunkSource, options?)`

Reconstruct all files from given DeltaPlan in disk.

**Parameters:**

| Name          | Type                    | Description                                                         |
| ------------- | ----------------------- | ------------------------------------------------------------------- |
| `plan`        | `DeltaPlan`             | The `DeltaPlan` containing the files to be reconstructed.           |
| `outputDir`   | `string`                | The path where the files will be reconstructed.                     |
| `chunkSource` | `ChunkSource`           | The chunk source implementation where the chunks will be retrieved. |
| `options?`    | `ReconstructionOptions` | Options for reconstruction.                                         |

**Returns:** `Promise<void>`

---

### `reconstructToStream(entry, chunkSource)`

Reconstruct a file in memory and returns it as a Readable stream.

**Parameters:**

| Name          | Type          | Description                                                         |
| ------------- | ------------- | ------------------------------------------------------------------- |
| `entry`       | `FileEntry`   | The `FileEntry` containing the list of chunks and path of the file. |
| `chunkSource` | `ChunkSource` | The chunk source implementation where the chunks will be retrieved. |

**Returns:** `Promise<void>`

---

## Related

- [DeltaPlan](/reference/NodeJS/models/delta-plan)
- [FileEntry](/reference/NodeJS/models/file-entry)
- [ChunkSource](/reference/NodeJS/chunk-sources/chunk-source)

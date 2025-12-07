---
title: UrlDownloadPipeline
description: Abstract download pipeline adapter for url-based chunk access for download flow.
sidebar_position: 6
---

# UrlDownloadPipeline

`UrlDownloadPipeline` is an abstract extension of `DownloadPipeline` designed to handle uploads using URL-based storage adapters (`UrlStorageAdapter`).
Unlike `HashDownloadPipeline`, this pipeline assumes that the delta plan (which chunks to download) is calculated externally and provided to the pipeline.

This pipeline is commonly used for remote storage systems where each chunk has a dedicated URL for download.

---

## Constructor

| Parameter        | Type                    | Description                                                                    |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------ |
| `storage`        | `UrlStorageAdapter`     | Url based storage adapter that will be used (automatically created by client). |
| `reconstruction` | `ReconstructionService` | ReconstructionService used for local file reconstruction.                      |
| `validation`     | `ValidationService`     | ValidationService used for file validation after reconstruction.               |
| `delta`          | `DeltaService`          | DeltaService used for generate rd-index, comparing rd-index, etc.              |
| `config`         | `RacDeltaConfig`        | Base client configuration.                                                     |

---

## Methods

| Method                                                                      | Returns                | Description                                                                                            |
| --------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `execute(localDir, { downloadUrls, indexUrl }, strategy,  plan?, options?)` | `Promise<void>`        | Performs a full download process for a directory.                                                      |
| `downloadAllMissingChunks(downloadUrls, target, options?)`                  | `Promise<ChunkSource>` | This method will download first all needed chunks via urls, and save them temporary on disk or memory. |

---

## Method details

### `execute(localDir, urls, strategy,  plan?, options?)`

Performs a full download process for a directory via urls.

**Parameters**

| Name                | Type                           | Description                                                                                                  |
| ------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `localDir`          | `string`                       | Directory where the new update will be downloaded.                                                           |
| `urls.downloadUrls` | `Record<string, ChunkUrlInfo>` | The urls identified by hash to download chunks. See ChunkUrlInfo below.                                      |
| `urls.indexUrl`     | `string`                       | Url to download remote rd-index.json.                                                                        |
| `strategy`          | `UpdateStrategy`               | Strategy used for downloading and reconstruction. See [UpdateStrategy](/usage/downloading#update-strategies) |
| `plan`              | `DeltaPlan`                    | Optional DeltaPlan for reference, if none provided will try to generate one.                                 |
| `options`           | `DownloadOptions`              | Options for the download process. See [DownloadOptions](./download-pipeline#downloadoptions)                 |

```ts
export interface ChunkUrlInfo {
  url: string;
  offset: number;
  size: number;
  filePath: string;
}
```

See [ChunkUrlInfo](/reference/NodeJS/models/chunk-url-info)

**Returns**

`Promise<void>`

---

### `downloadAllMissingChunks(downloadUrls, target, options?)`

This method will download first all needed chunks for process, and save them temporary on disk or memory.

Will return `ChunkSource`, ChunkSources will be needed to reconstruct files, this method will ONLY return
memory or disk chunk sources for offline reconstruction, if you use a storage like S3, you can omit this
and use directly the StorageChunkSource with `reconstruction.reconstructAll()` if you prefer.

(Using StorageChunkSource will download chunks and reconstruct file at same time, concurrently)

**Parameters**

| Name           | Type                           | Description                                                                                  |
| -------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `downloadUrls` | `Record<string, ChunkUrlInfo>` | The urls identified by hash to download chunks. See ChunkUrlInfo above.                      |
| `target`       | `'memory' \| 'disk'`           | Target of the resulting ChunkSource.                                                         |
| `options`      | `DownloadOptions`              | Options for the download process. See [DownloadOptions](./download-pipeline#downloadoptions) |

**Returns**

`Promise<void>`

---

## Related

- [DownloadPipeline](/reference/NodeJS/pipelines/download-pipeline)
- [HashDownloadPipeline](/reference/NodeJS/pipelines/hash-download-pipeline)
- [ChunkSource](/reference/NodeJS/chunk-sources/chunk-source)
- [RDIndex](/reference/NodeJS/models/rdindex)
- [DeltaPlan](/reference/NodeJS/models/delta-plan)

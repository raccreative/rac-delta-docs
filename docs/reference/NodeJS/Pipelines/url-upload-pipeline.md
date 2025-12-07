---
title: UrlUploadPipeline
description: Abstract upload pipeline adapter for url-based chunk access for upload flow.
sidebar_position: 3
---

# UrlUploadPipeline

`UrlUploadPipeline` is an abstract extension of `UploadPipeline` designed to handle uploads using URL-based storage adapters (`UrlStorageAdapter`).
Unlike `HashUploadPipeline`, this pipeline assumes that the delta plan (which chunks to upload or delete) is calculated externally and provided to the pipeline.

This pipeline is commonly used for remote storage systems where each chunk has a dedicated URL for upload or deletion.

---

## Constructor

| Parameter | Type                | Description                                                                    |
| --------- | ------------------- | ------------------------------------------------------------------------------ |
| `storage` | `UrlStorageAdapter` | Url based storage adapter that will be used (automatically created by client). |
| `config`  | `RacDeltaConfig`    | Base client configuration.                                                     |

---

## Methods

| Method                                                                 | Returns            | Description                                                    |
| ---------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------- |
| `execute(localIndex, { uploadUrls, deleteUrls?, indexUrl }, options?)` | `Promise<RDIndex>` | Performs a full upload process for given urls.                 |
| `uploadMissingChunks(uploadUrls, options?)`                            | `Promise<void>`    | Uploads the chunks defined in uploadUrls.                      |
| `uploadIndex(index, uploadUrl)`                                        | `Promise<void>`    | Uploads the RDIndex file to the given url.                     |
| `deleteObsoleteChunks(deleteUrls, options?)`                           | `Promise<void>`    | Deletes obsolete chunks from the storage as specified by urls. |

---

## Method details

### `execute(localIndex, { uploadUrls, deleteUrls?, indexUrl }, options?)`

Performs the full upload process using the provided URLs for chunks and index.

**Parameters**

| Name              | Type                           | Description                                                                            |
| ----------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| `localIndex`      | `RDIndex`                      | The local rd-index needed to sync, required as user should have already compared both. |
| `urls.uploadUrls` | `Record<string, ChunkUrlInfo>` | The urls identified by hash to upload chunks. See ChunkUrlInfo below.                  |
| `urls.deleteUrls` | `string[]`                     | The urls to delete remote obsolete chunks.                                             |
| `urls.indexUrl`   | `string`                       | The url to upload the new rd-index.json.                                               |
| `options`         | `UploadOptions`                | Options for the upload process. See [UploadOptions](./upload-pipeline#uploadoptions)   |

```ts
export interface ChunkUrlInfo {
  url: string;
  offset: number;
  size: number;
  filePath: string;
}
```

See [ChunkUrlInfo](/docs/reference/NodeJS/models/chunk-url-info)

**Returns**

`Promise<RDIndex>`

---

### `uploadMissingChunks(uploadUrls, options?)`

Uploads all missing chunks to their respective URLs. Chunks are read from disk based on the paths specified in `ChunkUrlInfo`.

**Parameters**

| Name         | Type                           | Description                                                                                                     |
| ------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `uploadUrls` | `Record<string, ChunkUrlInfo>` | The urls identified by hash to upload chunks. See [ChunkUrlInfo](/docs/reference/NodeJS/models/chunk-url-info). |
| `options`    | `UploadOptions`                | Options for the upload process. See [UploadOptions](./upload-pipeline#uploadoptions)                            |

**Returns**

`Promise<void>`

---

### `uploadIndex(index, uploadUrl)`

Uploads the RDIndex file to the specified URL.

**Parameters**

| Name        | Type      | Description                 |
| ----------- | --------- | --------------------------- |
| `index`     | `RDIndex` | The index object to upload. |
| `uploadUrl` | `string`  | Url to upload index.        |

**Returns**

`Promise<void>`

---

### `deleteObsoleteChunks(deleteUrls, options?)`

Deletes obsolete chunks from the remote storage using their URLs. Includes retry logic and progress tracking.

**Parameters**

| Name         | Type            | Description                                                                          |
| ------------ | --------------- | ------------------------------------------------------------------------------------ |
| `deleteUrls` | `string[]`      | The urls list to delete.                                                             |
| `options`    | `UploadOptions` | Options for the upload process. See [UploadOptions](./upload-pipeline#uploadoptions) |

**Returns**

`Promise<void>`

---

## Related

- [UploadPipeline](/docs/reference/NodeJS/pipelines/upload-pipeline)
- [HashUploadPipeline](/docs/reference/NodeJS/pipelines/hash-upload-pipeline)
- [RDIndex](/docs/reference/NodeJS/models/rdindex)

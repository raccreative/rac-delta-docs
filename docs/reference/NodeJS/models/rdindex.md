---
title: RDIndex
description: Representation of a rd-index.json within the Node.js SDK.
sidebar_position: 4
---

# RDIndex

A `RDIndex` represents a single rd-index.json file.  
It describes the version of the rd-index, creation timestamp, the chunk size used to divide files, and the list of files that compose the index.

Each instance is produced automatically by the SDK when scanning directories.

---

## Structure

```ts
export interface RDIndex {
  version: number;
  createdAt: number;
  chunkSize: number;
  files: FileEntry[];
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |version|`number` |Version of the rac-delta protocol used (default is 1)|
    |createdAt|`number`|Unix timestamp (ms) when the file was created.|
    |chunkSize|`number`|Size of the chunk used to divide files.|
    |files|`FileEntry[]`|List of files of the rd-index and its chunks.|

## Related models

- [Chunk](/reference/NodeJS/models/chunk)
- [FileEntry](/reference/NodeJS/models/file-entry)

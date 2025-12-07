---
title: DeltaPlan
description: Representation of information needed to upload or download for a new update within the Node.js SDK.
sidebar_position: 5
---

# DeltaPlan

A `DeltaPlan` represents what is needed to perform a new upload or download of a directory.  
It describes the new and modified files, the deleted files, the missing chunks and the obsolete chunks of the target.

Each instance is produced automatically by the SDK when comparing rd-indexes.

---

## Structure

```ts
export interface ChunkEntry extends Chunk {
  filePath: string;
}

export interface DeltaPlan {
  newAndModifiedFiles: FileEntry[];
  deletedFiles: string[];
  missingChunks: ChunkEntry[];
  obsoleteChunks: ChunkEntry[];
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |newAndModifiedFiles|`FileEntry[]` |List of files that are new of have been modified since last update.|
    |deletedFiles|`string[]`|List of the file names that have been deleted since last update.|
    |missingChunks|`ChunkEntry[]`|List of the chunks that are missing in the update and need to be downloaded.|
    |obsoleteChunks|`ChunkEntry[]`|List of the chunks that are obsolete in the update and need to be deleted or replaced.|

## Related models

- [Chunk](/docs/reference/NodeJS/models/chunk)
- [FileEntry](/docs/reference/NodeJS/models/file-entry)

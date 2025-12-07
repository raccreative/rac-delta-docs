---
title: FileEntry
description: Representation of a file entry in the rd-index.json within the Node.js SDK.
sidebar_position: 3
---

# FileEntry

A `FileEntry` represents a single file inside an `RDIndex`.  
It describes the file path, size, hash, last modification timestamp, and the list of chunks that compose the file.

Each instance is produced automatically by the SDK when scanning directories or reconstructing an index.

---

## Structure

```ts
export interface FileEntry {
  path: string;
  size: number;
  hash: string;
  modifiedAt: number;
  chunks: Chunk[];
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |path|`string` |Relative path of the file inside the indexed root|
    |size|`number`|Size of the file in bytes|
    |hash|`string`| The hash of the file (blake3) |
    |modifiedAt|`number`|Unix timestamp (ms) when the file was last modified.|
    |chunks|`Chunk[]`|List of chunks representing this file.|

## Related models

- [Chunk](/reference/NodeJS/models/chunk)
- [RDIndex](/reference/NodeJS/models/rdindex)

---
title: Chunk
description: Representation of a chunk of a file in the rd-index.json within the Node.js SDK.
sidebar_position: 1
---

# Chunk

A `Chunk` represents a single chunk inside a `FileEntry` inside a `RDIndex`.  
It describes the chunk hash, the offset and the chunk size.

Each instance is produced automatically by the SDK when scanning directories or generating file entries.

---

## Structure

```ts
export interface Chunk {
  hash: string;
  offset: number;
  size: number;
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |hash|`string` |Hash of the chunk (blake3) |
    |offset|`number`| The offset position of the chunk in the file |
    |size|`number`|Size of the chunk in bytes|

## Related models

- [FileEntry](/docs/reference/NodeJS/models/file-entry)
- [RDIndex](/docs/reference/NodeJS/models/rdindex)

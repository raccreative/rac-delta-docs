---
sidebar_position: 2
---

# Interfaces

Interfaces are important to know how rac-delta objects are represented whithin the SDK and what parameters are needed for operations of the protocol.

## Chunk

The chunk interface represents the chunks inside the rd-index.json file, and its information.

You must implement Chunk interface like this:

```js
Chunk {
  hash: string;
  offset: number;
  size: number;
}
```

## FileEntry

The FileEntry interface represents the files inside the rd-index.json, and its information.

You must implement FileEntry interface like this:

```js
FileEntry {
  path: string;
  size: number;
  hash: string;
  modifiedAt: number;
  chunks: Chunk[];
}
```

## RDIndex

The RDIndex interface represents the whole rd-index.json.

You must implement RDIndex interface like this:

```js
RDIndex {
  version: number;
  createdAt: number;
  chunkSize: number;
  files: FileEntry[];
}
```

## DeltaPlan

The DeltaPlan interface represents the result of two rd-index.json comparison. It depicts new and modified files, deleted files, missing chunks and obsolete chunks.

You should implement DeltaPlan like this:

```js
ChunkEntry extends Chunk {
  filePath: string;
}

DeltaPlan {
  newAndModifiedFiles: FileEntry[];
  deletedFiles: string[];
  missingChunks: ChunkEntry[];
  obsoleteChunks: ChunkEntry[];
}
```

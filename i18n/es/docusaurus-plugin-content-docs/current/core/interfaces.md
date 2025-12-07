---
sidebar_position: 2
---

# Interfaces

Las interfaces son importantes para saber cómo los objetos de rac-delta son representados en el SDK y qué parámetros necesitan para las operaciones del protocolo.

## Chunk

La interfaz de Chunk representa los chunks dentro del archivo rd-index.json, y su información.

Debes implementar la interfaz de Chunk así:

```js
Chunk {
  hash: string;
  offset: number;
  size: number;
}
```

## FileEntry

La interfaz de FileEntry representa los archivos dentro del rd-index.json, y su información.

Debes implementar la interfaz de FileEntry así:

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

La interfaz de RDIndex representa todo el rd-index.json.

Debes implementar la interfaz RDIndex así:

```js
RDIndex {
  version: number;
  createdAt: number;
  chunkSize: number;
  files: FileEntry[];
}
```

## DeltaPlan

La interfaz DeltaPlan representa el resultado de la comparación de dos rd-index.json. Describe los archivos nuevos y modificados, los archivos eliminados, los chunks faltantes y los chunks obsoletos.

Debes implementar la interfaz DeltaPlan así:

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

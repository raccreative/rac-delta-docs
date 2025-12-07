---
title: DeltaPlan
description: Representación de la información necesaria para subir o descargar una nueva actualización en el SDK de Node.js.
sidebar_position: 5
---

# DeltaPlan

Un `DeltaPlan` representa lo que es necesario para realizar una nueva subida o descarga de un directorio.
Se compone de los archivos nuevos y modificados, los archivos eliminados, los chunks nuevos y los chunks obsoletos del objetivo.

Cada instancia es generada automáticamente por el SDK cuando se comparan índices.

---

## Estructura

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

## Propiedades

| Propiedad           | Tipo           | Descripción                                                                                           |
| ------------------- | -------------- | ----------------------------------------------------------------------------------------------------- |
| newAndModifiedFiles | `FileEntry[]`  | Lista de los archivos que son nuevos o han sido modificados desde la última actualización.            |
| deletedFiles        | `string[]`     | Lista de los nombres de archivo que han sido eliminados desde la última actualización.                |
| missingChunks       | `ChunkEntry[]` | Lista de los chunks que no están en la actualización y necesitan ser descargados.                     |
| obsoleteChunks      | `ChunkEntry[]` | Lista de los chunks que son obsoletos en la actualización y tienen que ser eliminados o reemplazados. |

## Modelos relacionados

- [Chunk](/reference/NodeJS/models/chunk)
- [FileEntry](/reference/NodeJS/models/file-entry)

---
title: FileEntry
description: Representación de un file entry en el rd-index.json dentro del SDK de Node.js.
sidebar_position: 3
---

# FileEntry

Un `FileEntry` representa un único archivo dentro de un `RDIndex`.
Se compone de la ruta del archivo, el tamaño, el hash, última modificación, y la lista de chunks que componen el archivo.

Cada instancia es generada automáticamente por el SDK cuando se escanean directorios o se construyen índices.

---

## Estructura

```ts
export interface FileEntry {
  path: string;
  size: number;
  hash: string;
  modifiedAt: number;
  chunks: Chunk[];
}
```

## Propiedades

| Propiedad  | Tipo      | Descripción                                                         |
| ---------- | --------- | ------------------------------------------------------------------- |
| path       | `string`  | Ruta relativa del archivo dentro de la raíz indexada                |
| size       | `number`  | Tamaño del archivo en bytes                                         |
| hash       | `string`  | El hash del archivo (blake3)                                        |
| modifiedAt | `number`  | Unix timestamp (ms) cuando el archivo fue modificado por última vez |
| chunks     | `Chunk[]` | Lista de chunks que representan el archivo                          |

## Modelos relacionados

- [Chunk](/reference/NodeJS/models/chunk)
- [RDIndex](/reference/NodeJS/models/rdindex)

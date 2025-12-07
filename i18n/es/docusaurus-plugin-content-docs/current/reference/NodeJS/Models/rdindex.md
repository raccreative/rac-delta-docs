---
title: RDIndex
description: Representación de un rd-index.json dentro del SDK de Node.js.
sidebar_position: 4
---

# RDIndex

Un `RDIndex` representa un único archivo rd-index.json.
Se compone de la versión del protocolo, timestamp de creación, el tamaño de chunk utilizado para dividir los archivos, y la lista de archivos que componen el índice.

Cada instancia se genera automáticamente por el SDK cuando se escanean directorios.

---

## Estructura

```ts
export interface RDIndex {
  version: number;
  createdAt: number;
  chunkSize: number;
  files: FileEntry[];
}
```

## Propiedades

| Propiedad | Tipo          | Descripción                                                |
| --------- | ------------- | ---------------------------------------------------------- |
| version   | `number`      | Versión del protocolo rac-delta usado (por defecto es 1)   |
| createdAt | `number`      | Unix timestamp (ms) de cuando el archivo fue creado.       |
| chunkSize | `number`      | Tamaño de chunk usado para dividir los archivos.           |
| files     | `FileEntry[]` | Lista de los archivos que componen el índice y sus chunks. |

## Modelos relacionados

- [Chunk](/reference/NodeJS/models/chunk)
- [FileEntry](/reference/NodeJS/models/file-entry)

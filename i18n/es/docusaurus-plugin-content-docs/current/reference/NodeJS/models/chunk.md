---
title: Chunk
description: Representación de un chunk de un archivo en el rd-index.json en el SDK de Node.js.
sidebar_position: 1
---

# Chunk

Un `Chunk` representa un único chunk dentro de un `FileEntry` dentro de un `RDIndex`.
Contiene el hash del chunk, el offset y el tamaño del chunk.

Cada instancia es producida automáticamente por el SDK cuando se escanean directorios o se generan file entries.

---

## Estructura

```ts
export interface Chunk {
  hash: string;
  offset: number;
  size: number;
}
```

## Propiedades

| Propiedad | Tipo     | Descripción                                |
| --------- | -------- | ------------------------------------------ |
| hash      | `string` | Hash del chunk (blake3)                    |
| offset    | `number` | La posición offset del chunk en el archivo |
| size      | `number` | Tamaño del chunk en bytes                  |

## Modelos relacionados

- [FileEntry](/reference/NodeJS/models/file-entry)
- [RDIndex](/reference/NodeJS/models/rdindex)

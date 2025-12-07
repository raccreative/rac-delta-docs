---
title: ChunkUrlInfo
description: Representación de un chunk con url preparada para descargar o subir usando el adaptador en el SDK de Node.js.
sidebar_position: 2
---

# ChunkUrlInfo

Un `ChunkUrlInfo` representa un único chunk que será subido o descargado con una URL proporcionada por el usuario.
Se compone de la url del chunk, el offset, la ruta del archivo padre y el tamaño del chunk.

Cada instancia debería ser generada por el usuario con las URLs firmadas a usar.

---

## Estructura

```ts
export interface ChunkUrlInfo {
  url: string;
  offset: number;
  size: number;
  filePath: string;
}
```

## Propiedades

| Propiedad | Tipo     | Descripción                                |
| --------- | -------- | ------------------------------------------ |
| url       | `string` | Url para subir o descargar el chunk        |
| offset    | `number` | La posición offset del chunk en el archivo |
| size      | `number` | Tamaño del chunk en bytes                  |
| filePath  | `string` | Ruta relativa del archivo padre            |

## Modelos relacionados

- [FileEntry](/reference/NodeJS/models/file-entry)
- [RDIndex](/reference/NodeJS/models/rdindex)

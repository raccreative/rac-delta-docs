---
title: ChunkUrlInfo
description: Representación de un chunk con url preparada para descargar o subir usando el adaptador en el SDK de Rust.
sidebar_position: 2
---

# ChunkUrlInfo

Un `ChunkUrlInfo` representa un único chunk que será subido o descargado con una URL proporcionada por el usuario.
Se compone de la url del chunk, el offset, la ruta del archivo padre y el tamaño del chunk.

Cada instancia debería ser generada por el usuario con las URLs firmadas a usar.

---

## Estructura

```rust
pub struct ChunkUrlInfo {
  pub url: String;
  pub offset: u64;
  pub size: u64;
  pub file_path: String;
}
```

## Propiedades

| Propiedad | Tipo     | Descripción                                |
| --------- | -------- | ------------------------------------------ |
| url       | `String` | Url para subir o descargar el chunk        |
| offset    | `u64`    | La posición offset del chunk en el archivo |
| size      | `u64`    | Tamaño del chunk en bytes                  |
| file_path | `String` | Ruta relativa del archivo padre            |

## Modelos relacionados

- [FileEntry](/docs/reference/Rust/models/file-entry)
- [RDIndex](/docs/reference/Rust/models/rdindex)

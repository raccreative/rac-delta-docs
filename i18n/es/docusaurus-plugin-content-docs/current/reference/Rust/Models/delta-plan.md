---
title: DeltaPlan
description: Representación de la información necesaria para subir o descargar una nueva actualización en el SDK de Rust.
sidebar_position: 5
---

# DeltaPlan

Un `DeltaPlan` representa lo que es necesario para realizar una nueva subida o descarga de un directorio.
Se compone de los archivos nuevos y modificados, los archivos eliminados, los chunks nuevos y los chunks obsoletos del objetivo.

Cada instancia es generada automáticamente por el SDK cuando se comparan índices.

---

## Estructura

```rust
pub struct ChunkEntry {
  pub chunk: Chunk,
  pub file_path: String;
}

pub struct DeltaPlan {
  pub new_and_modified_files: Vec<FileEntry>;
  pub deleted_files: Vec<String>;
  pub missing_chunks: Vec<ChunkEntry>;
  pub obsolete_chunks: Vec<ChunkEntry>;
}
```

## Propiedades

| Propiedad              | Tipo              | Descripción                                                                                           |
| ---------------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| new_and_modified_files | `Vec<FileEntry>`  | Lista de los archivos que son nuevos o han sido modificados desde la última actualización.            |
| deleted_files          | `Vec<String>`     | Lista de los nombres de archivo que han sido eliminados desde la última actualización.                |
| missing_chunks         | `Vec<ChunkEntry>` | Lista de los chunks que no están en la actualización y necesitan ser descargados.                     |
| obsolete_chunks        | `Vec<ChunkEntry>` | Lista de los chunks que son obsoletos en la actualización y tienen que ser eliminados o reemplazados. |

## Modelos relacionados

- [Chunk](/reference/Rust/models/chunk)
- [FileEntry](/reference/Rust/models/file-entry)

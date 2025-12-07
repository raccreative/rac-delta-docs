---
title: FileEntry
description: Representación de un file entry en el rd-index.json dentro del SDK de Rust.
sidebar_position: 3
---

# FileEntry

Un `FileEntry` representa un único archivo dentro de un `RDIndex`.
Se compone de la ruta del archivo, el tamaño, el hash, última modificación, y la lista de chunks que componen el archivo.

Cada instancia es generada automáticamente por el SDK cuando se escanean directorios o se construyen índices.

---

## Estructura

```rust
pub struct FileEntry {
  pub path: String;
  pub size: u64;
  pub hash: String;
  pub modified_at: u64;
  pub chunks: Vec<Chunk>;
}
```

## Propiedades

| Propiedad  | Tipo         | Descripción                                                         |
| ---------- | ------------ | ------------------------------------------------------------------- |
| path       | `String`     | Ruta relativa del archivo dentro de la raíz indexada                |
| size       | `u64`        | Tamaño del archivo en bytes                                         |
| hash       | `String`     | El hash del archivo (blake3)                                        |
| modifiedAt | `u64`        | Unix timestamp (ms) cuando el archivo fue modificado por última vez |
| chunks     | `Vec<Chunk>` | Lista de chunks que representan el archivo                          |

## Modelos relacionados

- [Chunk](/docs/reference/Rust/models/chunk)
- [RDIndex](/docs/reference/Rust/models/rdindex)

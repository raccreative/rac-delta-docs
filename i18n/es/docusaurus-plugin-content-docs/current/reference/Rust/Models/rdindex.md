---
title: RDIndex
description: Representación de un rd-index.json dentro del SDK de Rust.
sidebar_position: 4
---

# RDIndex

Un `RDIndex` representa un único archivo rd-index.json.
Se compone de la versión del protocolo, timestamp de creación, el tamaño de chunk utilizado para dividir los archivos, y la lista de archivos que componen el índice.

Cada instancia se genera automáticamente por el SDK cuando se escanean directorios.

---

## Estructura

```rust
pub struct RDIndex {
  pub version: u32;
  pub created_at: u64;
  pub chunk_size: u64;
  pub files: Vec<FileEntry>;
}
```

## Propiedades

| Propiedad  | Tipo             | Descripción                                                |
| ---------- | ---------------- | ---------------------------------------------------------- |
| version    | `u32`            | Versión del protocolo rac-delta usado (por defecto es 1)   |
| created_at | `u64`            | Unix timestamp (ms) de cuando el archivo fue creado.       |
| chunk_size | `u64`            | Tamaño de chunk usado para dividir los archivos.           |
| files      | `Vec<FileEntry>` | Lista de los archivos que componen el índice y sus chunks. |

## Modelos relacionados

- [Chunk](/reference/Rust/models/chunk)
- [FileEntry](/reference/Rust/models/file-entry)

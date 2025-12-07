---
title: Chunk
description: Representación de un chunk de un archivo en el rd-index.json en el SDK de Rust.
sidebar_position: 1
---

# Chunk

Un `Chunk` representa un único chunk dentro de un `FileEntry` dentro de un `RDIndex`.
Contiene el hash del chunk, el offset y el tamaño del chunk.

Cada instancia es producida automáticamente por el SDK cuando se escanean directorios o se generan file entries.

---

## Estructura

```rust
pub struct Chunk {
  pub hash: String;
  pub offset: u64;
  pub size: u64;
}
```

## Properties

| Propiedad | Tipo     | Descripción                                |
| --------- | -------- | ------------------------------------------ |
| hash      | `String` | Hash del chunk (blake3)                    |
| offset    | `u64`    | La posición offset del chunk en el archivo |
| size      | `u64`    | Tamaño del chunk en bytes                  |

---

## Modelos relacionados

- [FileEntry](/reference/Rust/models/file-entry)
- [RDIndex](/reference/Rust/models/rdindex)

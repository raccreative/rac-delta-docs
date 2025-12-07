---
title: ValidationService
description: Servicio para validar archivos y objetos RDIndex.
sidebar_position: 2
---

# ValidationService

`ValidationService` valida los archivos y los objetos RDIndex.
Internamente usa `HasherService` para verificar hashes de archivo y chunks.

```rust
pub trait ValidationService: Send + Sync {
  ...
}
```

---

## Métodos

| Método                             | Devuelve                        | Descripción                                 |
| ---------------------------------- | ------------------------------- | ------------------------------------------- |
| `validate_file(entry, path)`       | `Result<bool, ValidationError>` | Valida un único archivo con su `FileEntry`. |
| `validate_index(index, base_path)` | `Result<bool, ValidationError>` | Valida todos los archivos de un `RDIndex`.  |

---

## ValidationError

Enum de errores personalizado para los resultados de ValidationService. (Usa `thiserror`)

```rust
pub enum ValidationError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Hash verification failed")]
    HashMismatch,
}
```

---

## Detalles de métodos

### `validate_file(entry, path)`

Verifica un archivo.

**Parámetros:**

| Nombre  | Tipo         | Descripción                      |
| ------- | ------------ | -------------------------------- |
| `entry` | `&FileEntry` | Metadatos del archivo a validar. |
| `path`  | `&str`       | Ruta del archivo en disco.       |

**Devuelve:** `Result<bool, ValidationError>` – `true` si el archivo es válido.

**Nota:** Usa `HasherService` internamente para verificar el hash del archivo y sus chunks.

---

### `validate_index(index, base_path)`

Vefifica todos los archivos de un rd-index.json.

**Parámetros:**

| Nombre      | Tipo       | Descripción                                |
| ----------- | ---------- | ------------------------------------------ |
| `index`     | `&RDIndex` | Objeto RDIndex con los archivos a validar. |
| `base_path` | `&str`     | Directorio contenedor de los archivos.     |

**Devuelve:** `Result<bool, ValidationError>` – `true` si todos los archivos son válidos.

**Nota:** Internamente llama a `validateFile` para cada archivo usando `HasherService`.

## Relacionado

- [RDIndex](/docs/reference/Rust/models/rdindex)
- [FileEntry](/docs/reference/Rust/models/file-entry)
- [HasherService](/docs/reference/Rust/services/hasher-service)

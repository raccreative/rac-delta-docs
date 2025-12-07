---
title: UrlStorageAdapter
description: Adaptador de almacenamiento abstracto para el acceso a chunks basado en urls.
sidebar_position: 3
---

# UrlStorageAdapter

`UrlStorageAdapter` define el contrato para cualquier backend de almacenamiento que guarda chunks accesibles por **url**.  
Extiende [`StorageAdapter`](./storage-adapter).

Esta clase es abstracta; las implementaciones reales pertenecen a la capa de infraestructura y no son usadas directamente por los consumidores del SDK.

---

## Métodos

| Método                                | Devuelve                                                                    | Descripción                                               |
| ------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------- |
| `get_chunk_by_url(url)`               | `Result<Option<Box<dyn AsyncRead + Send + Unpin + 'static>>, StorageError>` | Devuelve un stream de chunk por url.                      |
| `put_chunk_by_url(url, data)`         | `Result<(), StorageError>`                                                  | Sube un chunk desde un stream por url.                    |
| `delete_chunk_by_url(url)`            | `Result<(), StorageError>`                                                  | Elimina un chunk por url.                                 |
| `chunk_exists_by_url(url)`            | `Result<bool, StorageError>`                                                | Comprueba que un chunk existe por url.                    |
| `list_chunks_by_url(url)`             | `Result<Option<Vec<String>>, StorageError>`                                 | Opcional: lista los hashes de chunks almacenados por url. |
| `get_chunk_info_by_url(hash, url)`    | `Result<Option<BlobInfo>, StorageError>`                                    | Opcional: devuelve metadatos de chunk por url.            |
| `get_remote_index_by_url(url)`        | `Result<Option<RDIndex>, StorageError>`                                     | Devuelve el rd-index.json remoto por url.                 |
| `put_remote_index_by_url(url, index)` | `Result<(), StorageError>`                                                  | Sube el rd-index.json remoto por url.                     |

---

## Detalles de métodos

### `get_chunk_by_url(url)`

Devuelve un readable stream de un chunk, o `None` si el chunk no existe por url.

**Parámetros**

| Nombre | Tipo     | Descripción                                       |
| ------ | -------- | ------------------------------------------------- |
| `url`  | `string` | Url que se usará para descargar el chunk deseado. |

**Devuelve**

```rust
Result<Option<Box<dyn AsyncRead + Send + Unpin + 'static>>, StorageError>
```

---

### `put_chunk_by_url(url, data)`

Sube un chunk por url.

**Parámetros**

| Nombre | Tipo                                          | Descripción                |
| ------ | --------------------------------------------- | -------------------------- |
| `url`  | `&str`                                        | Url para subir el chunk.   |
| `data` | `Box<dyn AsyncRead + Send + Unpin + 'static>` | Fuente de datos en stream. |

**Devuelve**

`Result<(), StorageError>`

---

### `delete_chunk_by_url(url)`

Elimina un chunk por url si existe.

**Parámetros**

| Nombre | Tipo   | Descripción                 |
| ------ | ------ | --------------------------- |
| `url`  | `&str` | Url para eliminar el chunk. |

**Devuelve**

`Result<(), StorageError>`

---

### `chunk_exists_by_url(url)`

Comprueba si un chunk existe por url.

**Parámetros**

| Nombre | Tipo   | Descripción                            |
| ------ | ------ | -------------------------------------- |
| `url`  | `&str` | Url para comprobar si el chunk existe. |

**Devuelve**

`Result<bool, StorageError>`

---

### `list_chunks_by_url(url)`

Devuelve una lista de los hashes de chunks por url. Método opcional.

**Parámetros**

| Nombre | Tipo   | Descripción             |
| ------ | ------ | ----------------------- |
| `url`  | `&str` | Url para listar chunks. |

**Devuelve**

`Result<Option<Vec<String>>, StorageError>`

---

### `get_chunk_info_by_url(hash, url)`

Devuelve los metadatos del chunk por url. Método opcional.

**Parámetros**

| Nombre | Tipo   | Descripción                       |
| ------ | ------ | --------------------------------- |
| `hash` | `&str` | Hash del chunk para referencia.   |
| `url`  | `&str` | Url para traer la info del chunk. |

**Devuelve**

`Result<Option<BlobInfo>, StorageError>`

```rust
pub struct BlobInfo {
  pub hash: String;
  pub size: u64;
  pub modified: Option<u64>;
  pub metadata: Option<HashMap<String, String>>;
}
```

---

### `get_remote_index_by_url(url)`

Devuelve el rd-index.json remoto desde la url dada.

**Parámetros**

| Nombre | Tipo   | Descripción                   |
| ------ | ------ | ----------------------------- |
| `url`  | `&str` | Url para descargar el índice. |

**Devuelve**

`Result<Option<RDIndex>, StorageError>`

---

### `put_remote_index_by_url(url, index)`

Sube un rd-index.json al almacenamiento desde la url.

**Parámetros**

| Nombre  | Tipo      | Descripción                  |
| ------- | --------- | ---------------------------- |
| `url`   | `&str`    | La url para subir el índice. |
| `index` | `RDIndex` | El objeto rd-index.          |

**Devuelve**

`Result<(), StorageError>`

---

## Relacionado

- [RDIndex](/docs/reference/Rust/models/rdindex)
- [StorageAdapter](/docs/reference/Rust/adapters/storage-adapter)
- [StorageError](/docs/reference/Rust/adapters/storage-adapter#storageerror)

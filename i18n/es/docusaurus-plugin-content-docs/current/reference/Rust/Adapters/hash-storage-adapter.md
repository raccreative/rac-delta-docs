---
title: HashStorageAdapter
description: Adaptador de almacenamiento abstracto para acceso de chunk basado en hash.
sidebar_position: 2
---

# HashStorageAdapter

`HashStorageAdapter` define el contrato para cualquier backend de almacenamiento que guarda chunks identificados por **hash**.  
Extiende [`StorageAdapter`](./storage-adapter).

Esta clase es abstracta; las implementaciones reales pertenecen a la capa de infrastructura y no se usan directamente por los consumidores del SDK.

---

## Métodos

| Método                        | Devuelve                                                                    | Descripción                                     |
| ----------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------- |
| `get_chunk(hash)`             | `Result<Option<Box<dyn AsyncRead + Send + Unpin + 'static>>, StorageError>` | Devuelve un stream de chunk por su hash.        |
| `put_chunk(hash, data, opts)` | `Result<(), StorageError>`                                                  | Sube un chunk a partir de un stream.            |
| `chunk_exists(hash)`          | `Result<bool, StorageError>`                                                | Comprueba si un chunk existe.                   |
| `delete_chunk(hash)`          | `Result<(), StorageError>`                                                  | Borra un chunk.                                 |
| `list_chunks()`               | `Result<Option<Vec<String>>, StorageError>`                                 | Opcional: lista los hashes de chunks guardados. |
| `get_chunk_info(hash)`        | `Result<Option<BlobInfo>, StorageError>`                                    | Opcional: devuelve metadatos del chunk.         |
| `get_remote_index()`          | `Result<Option<RDIndex>, StorageError>`                                     | Devuelve el rd-index.json remoto.               |
| `put_remote_index(index)`     | `Result<(), StorageError>`                                                  | Sube un rd-index.json remoto.                   |

---

## Detalles de métodos

### `get_chunk(hash)`

Devuelve un stream de un chunk, o `null` si el chunk no existe.

**Parámetros**

| Nombre | Tipo   | Descripción              |
| ------ | ------ | ------------------------ |
| `hash` | `&str` | Identificador del chunk. |

**Devuelve**

```rust
Result<Option<Box<dyn AsyncRead + Send + Unpin + 'static>>, StorageError>
```

---

### `put_chunk(hash, data, opts)`

Sube un chunk identificado por su hash.

**Parámetros**

| Nombre           | Tipo                                          | Descripción                                                                    |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------------------------ |
| `hash`           | `&str`                                        | Hash del chunk.                                                                |
| `data`           | `Box<dyn AsyncRead + Send + Unpin + 'static>` | Fuente de datos en stream.                                                     |
| `opts.overwrite` | `Option<bool>`                                | Sobreescribir si existe o no.                                                  |
| `opts.size`      | `Option<u64>`                                 | Tamaño del chunk opcional, a veces necesitado por algunos proveedores como S3. |

**Devuelve**

`Result<(), StorageError>`

---

### `chunk_exists(hash)`

Comprueba si un chunk con ese hash existe.

**Parámetros**

| Nombre | Tipo   | Descripción     |
| ------ | ------ | --------------- |
| `hash` | `&str` | Hash del chunk. |

**Devuelve**

`Result<bool, StorageError>`

---

### `delete_chunk(hash)`

Elimina un chunk con ese hash si existe.

**Parámetros**

| Nombre | Tipo   | Descripción     |
| ------ | ------ | --------------- |
| `hash` | `&str` | Hash del chunk. |

**Devuelve**

`Result<(), StorageError>`

---

### `list_chunks()`

Devuelve una lista los hashes de chunk del espacio de trabajo. Método opcional.

**Devuelve**

`Result<option<Vec<String>>, StorageError>`

---

### `get_chunk_info(hash)`

Devuelve los metadatos de un chunk por hash si existe. Método opcional.

**Parámetros**

| Nombre | Tipo   | Descripción     |
| ------ | ------ | --------------- |
| `hash` | `&str` | Hash del chunk. |

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

### `get_remote_index()`

Devuelve el rd-index.json remoto si se encuentra en la ruta del espacio de trabajo.

**Devuelve**

`Result<Option<RDIndex>, StorageError>`

---

### `put_remote_index(index)`

Sube un rd-index.json al almacenamiento (ruta-configuracion-almacenamiento/rd-index.json).

**Parámetros**

| Nombre  | Tipo      | Descripción         |
| ------- | --------- | ------------------- |
| `index` | `RDIndex` | El objeto rd-index. |

**Devuelve**

`Result<(), StorageError>`

---

## Relacionado

- [RDIndex](/reference/Rust/models/rdindex)
- [StorageAdapter](/reference/Rust/adapters/storage-adapter)
- [StorageError](/reference/Rust/adapters/storage-adapter#storageerror)

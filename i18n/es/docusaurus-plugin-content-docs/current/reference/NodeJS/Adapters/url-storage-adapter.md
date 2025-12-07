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

## Propiedades

| Nombre | Tipo    | Descripción                            |
| ------ | ------- | -------------------------------------- |
| `type` | `"url"` | Identifica la categoría del adaptador. |

---

## Métodos

| Método                            | Devuelve                    | Descripción                                               |
| --------------------------------- | --------------------------- | --------------------------------------------------------- |
| `getChunkByUrl(url)`              | `Promise<Readable \| null>` | Devuelve un stream de chunk por url.                      |
| `putChunkByUrl(url, data)`        | `Promise<void>`             | Sube un chunk desde un readable stream por url.           |
| `chunkExistsByUrl(url)`           | `Promise<boolean>`          | Comprueba que un chunk existe por url.                    |
| `deleteChunkByUrl(url)`           | `Promise<void>`             | Elimina un chunk por url.                                 |
| `listChunksByUrl?(url)`           | `Promise<string[]>`         | Opcional: lista los hashes de chunks almacenados por url. |
| `getChunkInfoByUrl?(url)`         | `Promise<BlobInfo \| null>` | Opcional: devuelve metadatos de chunk por url.            |
| `getRemoteIndexByUrl(url)`        | `Promise<RDIndex \| null>`  | Devuelve el rd-index.json remoto por url.                 |
| `putRemoteIndexByUrl(url, index)` | `Promise<void>`             | Sube el rd-index.json remoto por url.                     |

---

## Detalles de métodos

### `getChunkByUrl(url)`

Devuelve un readable stream de un chunk, o `null` si el chunk no existe por url.

**Parámetros**

| Nombre | Tipo     | Descripción                                       |
| ------ | -------- | ------------------------------------------------- |
| `url`  | `string` | Url que se usará para descargar el chunk deseado. |

**Devuelve**

`Promise<Readable | null>`

---

### `putChunkByUrl(url, data)`

Sube un chunk por url.

**Parámetros**

| Nombre | Tipo       | Descripción                |
| ------ | ---------- | -------------------------- |
| `url`  | `string`   | Url para subir el chunk.   |
| `data` | `Readable` | Fuente de datos en stream. |

**Devuelve**

`Promise<void>`

---

### `chunkExistsByUrl(url)`

Comprueba si un chunk existe por url.

**Parámetros**

| Nombre | Tipo     | Descripción                            |
| ------ | -------- | -------------------------------------- |
| `url`  | `string` | Url para comprobar si el chunk existe. |

**Devuelve**

`Promise<boolean>`

---

### `deleteChunkByUrl(url)`

Elimina un chunk por url si existe.

**Parámetros**

| Nombre | Tipo     | Descripción                 |
| ------ | -------- | --------------------------- |
| `url`  | `string` | Url para eliminar el chunk. |

**Devuelve**

`Promise<void>`

---

### `listChunksByUrl?(url)`

Devuelve una lista de los hashes de chunks por url. Método opcional.

**Parámetros**

| Nombre | Tipo     | Descripción             |
| ------ | -------- | ----------------------- |
| `url`  | `string` | Url para listar chunks. |

**Devuelve**

`Promise<string[]>`

---

### `getChunkInfoByUrl?(url)`

Devuelve los metadatos del chunk por url. Método opcional.

**Parámetros**

| Nombre | Tipo     | Descripción                       |
| ------ | -------- | --------------------------------- |
| `url`  | `string` | Url para traer la info del chunk. |

**Devuelve**

`Promise<BlobInfo | null>`

```ts
export interface BlobInfo {
  hash: string;
  size: number;
  modified?: Date;
  metadata?: Record<string, string>;
}
```

---

### `getRemoteIndexByUrl(url)`

Devuelve el rd-index.json remoto desde la url dada.

**Parámetros**

| Nombre | Tipo     | Descripción                   |
| ------ | -------- | ----------------------------- |
| `url`  | `string` | Url para descargar el índice. |

**Devuelve**

`Promise<RDIndex | null>`

---

### `putRemoteIndexByUrl(url, index)`

Sube un rd-index.json al almacenamiento desde la url.

**Parámetros**

| Nombre  | Tipo      | Descripción                  |
| ------- | --------- | ---------------------------- |
| `url`   | `string`  | La url para subir el índice. |
| `index` | `RDIndex` | El objeto rd-index.          |

**Devuelve**

`Promise<void>`

---

## Relacionado

- [RDIndex](/docs/reference/NodeJS/models/rdindex)
- [StorageAdapter](/docs/reference/NodeJS/adapters/storage-adapter)

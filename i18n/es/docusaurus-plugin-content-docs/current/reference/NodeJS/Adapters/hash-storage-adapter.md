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

## Propiedades

| Nombre | Tipo     | Descripción                            |
| ------ | -------- | -------------------------------------- |
| `type` | `"hash"` | Identifica la categoría del adaptador. |

---

## Métodos

| Método                        | Devuelve                    | Descripción                                     |
| ----------------------------- | --------------------------- | ----------------------------------------------- |
| `getChunk(hash)`              | `Promise<Readable \| null>` | Devuelve un stream de chunk por su hash.        |
| `putChunk(hash, data, opts?)` | `Promise<void>`             | Sube un chunk a partir de un readable stream.   |
| `chunkExists(hash)`           | `Promise<boolean>`          | Comprueba si un chunk existe.                   |
| `deleteChunk(hash)`           | `Promise<void>`             | Borra un chunk.                                 |
| `listChunks?()`               | `Promise<string[]>`         | Opcional: lista los hashes de chunks guardados. |
| `getChunkInfo?(hash)`         | `Promise<BlobInfo \| null>` | Opcional: devuelve metadatos del chunk.         |
| `getRemoteIndex()`            | `Promise<RDIndex \| null>`  | Devuelve el rd-index.json remoto.               |
| `putRemoteIndex(index)`       | `Promise<void>`             | Sube un rd-index.json remoto.                   |

---

## Detalles de métodos

### `getChunk(hash)`

Devuelve un readable stream de un chunk, o `null` si el chunk no existe.

**Parámetros**

| Nombre | Tipo     | Descripción              |
| ------ | -------- | ------------------------ |
| `hash` | `string` | Identificador del chunk. |

**Devuelve**

`Promise<Readable | null>`

---

### `putChunk(hash, data, opts?)`

Sube un chunk identificado por su hash.

**Parámetros**

| Nombre            | Tipo       | Descripción                                                                    |
| ----------------- | ---------- | ------------------------------------------------------------------------------ |
| `hash`            | `string`   | Hash del chunk.                                                                |
| `data`            | `Readable` | Fuente de datos en stream.                                                     |
| `opts.overwrite?` | `boolean`  | Sobreescribir si existe o no.                                                  |
| `opts.size?`      | `number`   | Tamaño del chunk opcional, a veces necesitado por algunos proveedores como S3. |

**Devuelve**

`Promise<void>`

---

### `chunkExists(hash)`

Comprueba si un chunk con ese hash existe.

**Parámetros**

| Nombre | Tipo     | Descripción     |
| ------ | -------- | --------------- |
| `hash` | `string` | Hash del chunk. |

**Devuelve**

`Promise<boolean>`

---

### `deleteChunk(hash)`

Elimina un chunk con ese hash si existe.

**Parámetros**

| Nombre | Tipo     | Descripción              |
| ------ | -------- | ------------------------ |
| `hash` | `string` | Identificador del chunk. |

**Devuelve**

`Promise<void>`

---

### `listChunks?()`

Devuelve una lista los hashes de chunk del espacio de trabajo. Método opcional.

**Devuelve**

`Promise<string[]>`

---

### `getChunkInfo?(hash)`

Devuelve los metadatos de un chunk por hash si existe. Método opcional.

**Parámetros**

| Nombre | Tipo     | Descripción              |
| ------ | -------- | ------------------------ |
| `hash` | `string` | Identificador del chunk. |

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

### `getRemoteIndex()`

Devuelve el rd-index.json remoto si se encuentra en la ruta del espacio de trabajo.

**Devuelve**

`Promise<RDIndex | null>`

---

### `putRemoteIndex(index)`

Sube un rd-index.json al almacenamiento (ruta-configuracion-almacenamiento/rd-index.json).

**Parámetros**

| Nombre  | Tipo      | Descripción         |
| ------- | --------- | ------------------- |
| `index` | `RDIndex` | El objeto rd-index. |

**Devuelve**

`Promise<void>`

---

## Relacionado

- [RDIndex](/docs/reference/NodeJS/models/rdindex)
- [StorageAdapter](/docs/reference/NodeJS/adapters/storage-adapter)

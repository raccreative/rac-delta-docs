---
title: HasherService
description: Servicio abstracto para hashear archivos, streams y buffers.
sidebar_position: 1
---

# HasherService

`HasherService` define la API para calcular hashes de archivos, chunks, streams y buffers.
Es abstracto; las implementaciones reales están en la capa de infraestructura.
(e.j., `HashWasmHasherService` en Node.js).

Esta página documenta la **API pública disponible para el SDK de Node.js**.

---

## Métodos

| Método                                   | Devuelve                   | Descripción                                                                        |
| ---------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------- |
| `hashFile(filePath, rootDir, chunkSize)` | `Promise<FileEntry>`       | Devuelve un `FileEntry` calculando el hash del archivo y los hashes de los chunks. |
| `hashStream(stream, onChunk?)`           | `Promise<Chunk[]>`         | Procesa un stream de chunks y devuelve un array de chunks hasheados.               |
| `hashBuffer(data)`                       | `Promise<string>`          | Devuelve el hash de un buffer (string hex).                                        |
| `verifyChunk(data, expectedHash)`        | `Promise<boolean>`         | Verifica que un chunk tiene el hash esperado.                                      |
| `verifyFile(path, expectedHash)`         | `Promise<boolean>`         | Verifica que un archivo tiene el hash esperado.                                    |
| `createStreamingHasher()`                | `Promise<StreamingHasher>` | Crea un objeto `StreamingHasher` para hashing incremental.                         |

---

## Detalles de métodos

### `hashFile(filePath, rootDir, chunkSize)`

Devuelve el `FileEntry` del archivo dado, calculando su hash y los hashes de sus chunks.

**NOTA IMPORTANTE:** el tamaño de chunk seleccionado debe ser el mismo en todas las operaciones de rac-delta

**Parámetros:**

| Nombre      | Tipo     | Descripción                                     |
| ----------- | -------- | ----------------------------------------------- |
| `filePath`  | `string` | Ruta relativa del archivo (`dir/file.txt`)      |
| `rootDir`   | `string` | Directorio raíz del índice (`dir`)              |
| `chunkSize` | `number` | Tamaño en bytes de cada chunk (recomendado 1MB) |

**Devuelve:** `Promise<FileEntry>`

---

### `hashStream(stream, onChunk?)`

Procesa un stream de chunks, opcionalmente llama a `onChunk` para cada chunk procesado.

**Parámetros:**

| Nombre    | Tipo                          | Descripción                                 |
| --------- | ----------------------------- | ------------------------------------------- |
| `stream`  | `AsyncChunkStream`            | El stream de chunks de entrada.             |
| `onChunk` | `(chunk: Uint8Array) => void` | Callback opcional para cada chunk hasheado. |

```ts
export interface AsyncChunkStream extends AsyncIterable<Uint8Array> {
  nextChunk(): Promise<Uint8Array | null>;
  reset?(): Promise<void>;
  close?(): Promise<void>;
}
```

**Devuelve:** `Promise<Chunk[]>`

---

### `hashBuffer(data)`

Hashea un buffer.

| Parámetro | Tipo         | Descripción             |
| --------- | ------------ | ----------------------- |
| `data`    | `Uint8Array` | El buffer para hashear. |

**Devuelve:** `Promise<string>` (hex)

---

### `verifyChunk(data, expectedHash)`

Comprueba si un chunk tiene el hash esperado.

| Parámetro      | Tipo         | Descripción    |
| -------------- | ------------ | -------------- |
| `data`         | `Uint8Array` | El chunk.      |
| `expectedHash` | `string`     | Hash esperado. |

**Devuelve:** `Promise<boolean>`

---

### `verifyFile(path, expectedHash)`

Comprueba si un archivo tiene el hash esperado.

| Parámetro      | Tipo     | Descripción       |
| -------------- | -------- | ----------------- |
| `path`         | `string` | Ruta del archivo. |
| `expectedHash` | `string` | Hash esperado.    |

**Devuelve:** `Promise<boolean>`

---

### `createStreamingHasher()`

Crea una instancia de `StreamingHasher`:

```ts
export interface StreamingHasher {
  update(data: Uint8Array | Buffer): void;
  digest(encoding?: 'hex'): string;
}
```

**Devuelve:** `Promise<StreamingHasher>`

## Ejemplo

```ts
const fileEntry = await racDeltaClient.hasher.hashFile('my-dir/file.txt', 'my-dir', 1024 * 1024);
```

## Relacionado

- [RDIndex](/docs/reference/NodeJS/models/rdindex)
- [FileEntry](/docs/reference/NodeJS/models/file-entry)
- [Chunk](/docs/reference/NodeJS/models/chunk)

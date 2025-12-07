---
title: DiskChunkSource
description: Implementación de ChunkSource que guarda los chunks en el sistema de archivos local.
sidebar_position: 3
---

# DiskChunkSource

`DiskChunkSource` es una implementación de [`ChunkSource`](./chunk-source) que guarda y devuelve los chunks directamente desde el sistema de archivos (temporalmente).

---

## Constructor

| Parámetro  | Tipo     | Descripción                                             |
| ---------- | -------- | ------------------------------------------------------- |
| `cacheDir` | `string` | Directorio donde se guardarán los chunks temporalmente. |

---

## Métodos

| Método                        | Devuelve                       | Descripción                                                 |
| ----------------------------- | ------------------------------ | ----------------------------------------------------------- |
| `getChunk(hash)`              | `Promise<Buffer>`              | Devuelve un único chunk por su hash.                        |
| `getChunks(hashes, options?)` | `Promise<Map<string, Buffer>>` | Método para devolver múltiples chunks de forma concurrente. |
| `hasChunk(hash)`              | `boolean`                      | Comprueba que un chunk existe en disco.                     |
| `setChunk(hash, data)`        | `void`                         | Añade o actualiza un chunk en disco.                        |
| `clear()`                     | `void`                         | Limpia todos los chunks almacenados en caché del disco.     |

---

## Ejemplo de uso

```ts
import { DiskChunkSource } from 'rac-delta';
import { Readable } from 'stream';

const source = new DiskChunkSource('./cache');

// Guarda un chunk desde un buffer
await source.setChunk('abcd1234', Buffer.from('Hello world'));

// Guarda un chunk desde un stream
const stream = Readable.from(['streamed data']);
await source.setChunk('ef456', stream);

// Devuelve un chunk
const chunk = await source.getChunk('abcd1234');
console.log(chunk.toString()); // 'Hello world'

// Comprueba existencia
const exists = await source.hasChunk('abcd1234'); // true

// Devuelve múltiples chunks
const results = await source.getChunks(['abcd1234', 'ef456']);
console.log(results.get('ef456')?.toString()); // 'streamed data'

// Limpia los chunks
await source.clear();
```

## Relacionado

- [ReconstructionService](/reference/NodeJS/services/reconstruction-service)
- [ChunkSource](chunk-source)

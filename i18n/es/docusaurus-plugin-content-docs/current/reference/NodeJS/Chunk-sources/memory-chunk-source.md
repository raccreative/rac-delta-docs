---
title: MemoryChunkSource
description: Implementación de ChunkSource que guarda los chunks en memoria para acceso rápido.
sidebar_position: 2
---

# MemoryChunkSource

`MemoryChunkSource` es una implementación de [`ChunkSource`](./chunk-source) que guarda todos los chunks en memoria.
Esto es útil para operaciones temporales rápidas, testing, o datos pequeños.

---

## Métodos

| Método                        | Devuelve                       | Descripción                                                 |
| ----------------------------- | ------------------------------ | ----------------------------------------------------------- |
| `getChunk(hash)`              | `Promise<Buffer>`              | Devuelve un único chunk por su hash.                        |
| `getChunks(hashes, options?)` | `Promise<Map<string, Buffer>>` | Método para devolver múltiples chunks de forma concurrente. |
| `hasChunk(hash)`              | `boolean`                      | Comprueba que un chunk existe en memoria.                   |
| `setChunk(hash, data)`        | `void`                         | Añade o actualiza un chunk en memoria.                      |

---

## Ejemplo de uso

```ts
import { MemoryChunkSource } from 'rac-delta';

const source = new MemoryChunkSource();

// Añade un chunk manualmente
source.setChunk('abcd1234', Buffer.from('Hello world'));

// Devuelve un chunk
const chunk = await source.getChunk('abcd1234');
console.log(chunk.toString()); // 'Hello world'

// Comprueba si existe
const exists = source.hasChunk('abcd1234'); // true

// Devuelve varios chunks
const chunks = await source.getChunks(['abcd1234']);
console.log(chunks.get('abcd1234').toString()); // 'Hello world'
```

## Notas

- Ideal para datos pequeños o test unitarios.

- No muy útil para datos muy grandes debido a las limitaciones de memoria.

- Implementa la interfaz de ChunkSource por completo, por lo que puede intercambiarse por DiskChunkSource o StorageChunkSource.

## Relacionado

- [ReconstructionService](/docs/reference/NodeJS/services/reconstruction-service)
- [ChunkSource](chunk-source)

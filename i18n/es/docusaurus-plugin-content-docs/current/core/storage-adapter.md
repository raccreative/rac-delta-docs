---
sidebar_position: 4
---

# Adaptador de almacenamiento

El adaptador de almacenamiento es un servicio especial que implementa el almacenamiento seleccionado usando la configuración vista en [configuración](/core/configuration). Como rac-delta es agnóstico al almacenamiento, tener una abstracción para este es una solución perfecta.

El adaptador de almacenamiento conectará directamente con tu backend (Ejemplo: s3 sdk).

## Adaptador de almacenamiento base

Como hay dos tipos de almacenamiento (Url o Hash), el adaptador necesita una clase base que será extendida. Esto se hace porque el adaptador URL necesita parámetros y nombres diferentes.

(Si planeas implementar solo un tipo de almacenamiento, entonces no necesitas usar esta división de tipos y usar solo el que necesites)

```ts
abstract class StorageAdapter {
  abstract readonly type: 'hash' | 'url';

  abstract dispose(): Promise<void>;
}
```

## Adaptador de almacenamiento Hash

Este tipo de adaptador está hecho para todos los almacenamientos que funcionan con rutas hash (por ejemplo: dir/chunks/hash). Todos los almacenamientos salvo URL usan este tipo.

```ts title="Ejemplo de abstracción en TypeScript"
abstract class HashStorageAdapter extends StorageAdapter {
  readonly type = 'hash' as const;

  abstract getChunk(hash: string): Promise<Readable | null>;

  abstract putChunk(
    hash: string,
    data: Readable,
    opts?: { overwrite?: boolean; size?: number }
  ): Promise<void>;

  abstract chunkExists(hash: string): Promise<boolean>;

  abstract deleteChunk(hash: string): Promise<void>;

  listChunks?(): Promise<string[]>;

  getChunkInfo?(hash: string): Promise<BlobInfo | null>;

  abstract getRemoteIndex(): Promise<RDIndex | null>;

  abstract putRemoteIndex(index: RDIndex): Promise<void>;
}

// usado por getChunkInfo
interface BlobInfo {
  hash: string;
  size: number;
  modified?: Date;
  metadata?: Record<string, string>;
}
```

## Adaptador de almacenamiento Url

Este tipo de adaptador solo se usa par el tipo de almacenamiento URL:

```ts title="Ejemplo de abstracción en TypeScript"
export abstract class UrlStorageAdapter extends StorageAdapter {
  readonly type = 'url' as const;

  abstract getChunkByUrl(url: string): Promise<Readable | null>;

  abstract putChunkByUrl(url: string, data: Readable): Promise<void>;

  abstract deleteChunkByUrl(url: string): Promise<void>;

  abstract chunkExistsByUrl(url: string): Promise<boolean>;

  listChunksByUrl?(url: string): Promise<string[]>;

  getChunkInfoByUrl?(hash: string, url: string): Promise<BlobInfo | null>;

  abstract getRemoteIndexByUrl(url: string): Promise<RDIndex | null>;

  abstract putRemoteIndexByUrl(url: string, index: RDIndex): Promise<void>;
}
```

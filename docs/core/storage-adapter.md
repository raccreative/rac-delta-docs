---
sidebar_position: 4
---

# Storage Adapter

Storage Adapter is a special service that will implement the selected storage using the configuration seen on [configuration](/core/configuration). As rac-delta is storage agnostic, having an abstraction for storage is a perfect solution.

Storage adapter will directly connect with your storage (Example: s3 sdk).

## Base storage adapter

As storage has two types (Url or Hash) needs a base class that will be extended. This is done because URL storage adapter needs different parameters and method names.

(If you plan to implement only one type of storage, then you don't need to use the type division and only use the Storage Adapter you need)

```ts
abstract class StorageAdapter {
  abstract readonly type: 'hash' | 'url';

  abstract dispose(): Promise<void>;
}
```

## Hash storage adapter

This storage adapter type is made for every storage that works with hash paths (example: dir/chunks/hash). Every storage except URL storage uses this type.

```ts title="TypeScript abstraction example"
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

// used for getChunkInfo
interface BlobInfo {
  hash: string;
  size: number;
  modified?: Date;
  metadata?: Record<string, string>;
}
```

## Url storage adapter

This adapter type is only used for the URL storage type:

```ts title="TypeScript abstraction example"
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

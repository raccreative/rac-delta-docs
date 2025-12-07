---
sidebar_position: 5
---

# Services

In order to organize and to use rac-delta properly, it is important to atomize responsibilities of the protocol in different services.

rac-delta core is composed by four main services that will connect every operation of the protocol together.

## Hasher service

This service will be responsible of implementing hashing to create file and chunk hashes, to verify integrity and to generate `FileEntry` and `Chunk` objects with its hashes.

Here it is the abstraction of the service, ready to be implemented with any library you prefer.

```ts title="Abstract hasher service in TypeScript"
interface StreamingHasher {
  update(data: Uint8Array | Buffer): void;
  digest(encoding?: 'hex'): string;
}

interface HasherService {
  hashFile(filePath: string, rootDir: string, chunkSize: number): Promise<FileEntry>;

  hashStream(stream: AsyncChunkStream, onChunk?: (chunk: Uint8Array) => void): Promise<Chunk[]>;

  hashBuffer(data: Uint8Array): Promise<string>;

  verifyChunk(data: Uint8Array, expectedHash: string): Promise<boolean>;

  verifyFile(path: string, expectedHash: string): Promise<boolean>;

  createStreamingHasher(): Promise<StreamingHasher>;
}
```

## Validation service

The validation service is used only for validation of files and rd-index.json files. It uses the `hasher service` for this, has basic methods that returns boolean.

```ts title="Abstract validation service in TypeScript"
interface ValidationService {
  validateFile(entry: FileEntry, path: string): Promise<boolean>;

  validateIndex(index: RDIndex, basePath: string): Promise<boolean>;
}
```

## Delta service

The delta service is responsible of mainly creating rd-indexes, comparing rd-indexes or merging rd-indexes.

Comparing two rd-index files will generate a [Delta Plan](/core/interfaces#deltaplan) that will include the changes to upload or download.

```ts title="Abstract delta service in TypeScript"
interface DeltaService {
  createIndexFromDirectory(
    rootPath: string,
    chunkSize: number,
    concurrency?: number,
    ignorePatterns?: string[]
  ): Promise<RDIndex>;

  createFileEntryFromStream(stream: AsyncChunkStream, path: string): Promise<FileEntry>;

  compare(source: RDIndex, target: RDIndex | null): DeltaPlan;

  mergePlans(base: DeltaPlan, updates: DeltaPlan): DeltaPlan;

  compareForUpload(localIndex: RDIndex, remoteIndex: RDIndex | null): Promise<DeltaPlan>;

  compareForDownload(localIndex: RDIndex | null, remoteIndex: RDIndex): Promise<DeltaPlan>;
}
```

### AsyncChunkStream

As you can see above, `createFileEntryFromStream` uses `AsyncChunkStream`, an object that extends AsyncIterable for a more custom experience:

```ts
interface AsyncChunkStream extends AsyncIterable<Uint8Array> {
  nextChunk(): Promise<Uint8Array | null>;
  reset?(): Promise<void>;
  close?(): Promise<void>;
}
```

As how streams are treated differently in each language, take this only as recommendation and a guide, it can differ on other languages like Python or Rust.

## Reconstruction service

The reconstruction service is a complex service that is responsible of reconstruct files via chunks.

It can reconstruct a single file or all files of a given delta plan.

```ts title="Example reconstruction service abstraction in TypeScript"
interface ReconstructionService {
  reconstructFile(
    entry: FileEntry,
    outputPath: string,
    chunkSource: ChunkSource,
    options?: ReconstructionOptions
  ): Promise<void>;

  reconstructAll(
    plan: DeltaPlan,
    outputDir: string,
    chunkSource: ChunkSource,
    options?: ReconstructionOptions
  ): Promise<void>;

  reconstructToStream(entry: FileEntry, chunkSource: ChunkSource): Promise<Readable>;
}
```

It only has three public methods, but it will have many private functions depending on how complex you want the service to be. (Temporal reconstruction, in-place reconstruction, thresholds, validation, streaming...)

### ChunkSource

As you can see above, every method needs a `ChunkSource`, a special service that connects directly with your storage adapter, your memory, or your disk, depending on how you want your chunks managed.

This is the abstraction for `ChunkSource`:

```ts title="TypeScript ChunkSource abstraction"
interface ChunkSource {
  getChunk(hash: string): Promise<Buffer>;

  getChunks?(hashes: string[], options?: { concurrency?: number }): Promise<Map<string, Buffer>>;

  streamChunks?(
    hashes: string[],
    options?: { concurrency?: number; preserveOrder?: boolean }
  ): AsyncGenerator<{ hash: string; data: Readable }>;
}
```

The recommended implementations are: `StorageChunkSource`, `MemoryChunkSource` and `DiskChunkSource` (First one will get chunks from remote storage, the second one from memory if chunks were downloaded first, and third one the same but from disk)

The recommended use for the reconstruction service is to try `streamChunks` > `getChunks` > `getChunk` if they exist, for better performance.

### ReconstructionOptions

For a better user experience, customization and service performance, there are some recommended configuration parameters for the service:

```js
interface ReconstructionOptions {
  forceRebuild?: boolean;
  verifyAfterRebuild?: boolean;
  inPlaceReconstructionThreshold?: number;
  fileConcurrency?: number;
  onProgress?: (
    reconstructProgress: number,
    diskSpeed: number,
    networkProgress?: number,
    networkSpeed?: number
  ) => void;
}
```

#### `forceRebuild`

Force to rebuild even if hash file matches. (`boolean`)

#### `verifyAfterRebuild`

Verifies the reconstructed file hash after finishing. If hash does not match, an error is thrown. (`boolean`)

#### `inPlaceReconstructionThreshold`

Minimum file size (in bytes) required to perform an **in-place reconstruction** instead of using a temporary file.
Default: `400 * 1024 * 1024` (400 MB).

**In-place reconstruction:**
The existing file is opened and updated directly by overwriting only the modified or missing chunks.

**.tmp reconstruction:**
The file is fully rebuilt in a temporary `.tmp` location using all chunks (new and existing), then replaced over the original file.

**When to use:**
In-place reconstruction is recommended for **large files**, as it avoids rewriting the entire file and significantly reduces disk space usage.
However, it may be **unsafe for certain formats** (e.g., ZIP archives or databases) that are sensitive to partial writes or corruption.
To disable in-place reconstruction entirely, set this value to `0`.

#### `fileConcurrency`

How many files will reconstruct concurrently (default value is 5). (`number`)

#### `onProgress`

Callback that returns disk usage and optional network speed (only for storage chunk sources via streaming download-reconstruction)

---
sidebar_position: 6
---

# Pipelines

Pipelines are optional, but a recommended way to unify all services and configuration into one coherent pipeline that follows the protocol perfectly.

This way you only need to use it like `pipeline.execute(...)` and forget about extra steps.

## Upload pipeline

The first pipeline is the upload pipeline, this one will follow the rac-delta protocol to upload new version of your build scanning your local directory, generating a rd-index.json, comparing, and patching changes. All this using your current configuration.

### Base upload pipeline

Like the Storage Adapter, the upload pipeline also needs a Base Class, as it will have Hash and Url versions, with different parameters and slightly different behaviour.

```ts
type UploadState = 'uploading' | 'comparing' | 'cleaning' | 'finalizing' | 'scanning';

abstract class BaseUploadPipeline {
  protected updateProgress(
    value: number,
    state: 'upload' | 'deleting',
    speed?: number,
    options?: UploadOptions
  ) {
    options?.onProgress?.(state, value, speed);
  }

  protected changeState(state: UploadState, options?: UploadOptions) {
    options?.onStateChange?.(state);
  }
}
```

### Hash upload pipeline

This pipeline will be the one used for almost every storage implementation (S3, SSH, Azure...) except from URL (for signed URLs)

```ts title="Example abstract class for HashUploadPipeline in TS"
abstract class HashUploadPipeline extends BaseUploadPipeline {
  constructor(
    protected readonly storage: HashStorageAdapter,
    protected readonly delta: DeltaService,
    protected readonly config: RacDeltaConfig
  ) {
    super();
  }

  abstract execute(
    directory: string,
    remoteIndex?: RDIndex,
    options?: UploadOptions
  ): Promise<RDIndex>;

  abstract scanDirectory(dir: string, ignorePatterns?: string[]): Promise<RDIndex>;

  abstract uploadMissingChunks(
    plan: DeltaPlan,
    baseDir: string,
    force: boolean,
    options?: UploadOptions
  ): Promise<void>;

  abstract deleteObsoleteChunks(plan: DeltaPlan, options?: UploadOptions): Promise<void>;

  abstract uploadIndex(index: RDIndex): Promise<void>;
}
```

### URL upload pipeline

This pipeline will be the one used for URL Storage (signed URLs)

```ts title="Example abstract class for UrlUploadPipeline in TS"
abstract class UrlUploadPipeline extends BaseUploadPipeline {
  constructor(
    protected readonly storage: UrlStorageAdapter,
    protected readonly config: RacDeltaConfig
  ) {
    super();
  }

  abstract execute(
    localIndex: RDIndex,
    urls: {
      uploadUrls: Record<string, ChunkUrlInfo>;
      deleteUrls?: string[];
      indexUrl: string;
    },
    options?: UploadOptions
  ): Promise<RDIndex>;

  abstract uploadMissingChunks(
    uploadUrls: Record<string, ChunkUrlInfo>,
    options?: UploadOptions
  ): Promise<void>;

  abstract uploadIndex(index: RDIndex, uploadUrl: string): Promise<void>;

  abstract deleteObsoleteChunks(deleteUrls: string[], options?: UploadOptions): Promise<void>;
}

interface ChunkUrlInfo {
  url: string;
  offset: number;
  size: number;
  filePath: string;
}
```

As you can see, method names and props are different. In this case, the user must provide the urls. It takes for granted that the API that provides those URLs already compared rd-index files and created a `DeltaPlan` to get the correct urls.

### UploadOptions

For better customization and performance of the pipeline, some optional configuration can be used:

```js
interface UploadOptions {
  force?: boolean;
  requireRemoteIndex?: boolean;
  ignorePatterns?: string[];
  onProgress?: (type: 'upload' | 'deleting', progress: number, speed?: number) => void;
  onStateChange?: (state: UploadState) => void;
}
```

#### `force`

If true, forces complete upload even if remote index exists. If false, only new and modified chunks will be uploaded. (`boolean`)

#### `requireRemoteIndex`

If true and no remote index found, abort upload. If false (default), uploads everything if no remote index found. (`boolean`)

#### `ignorePatterns`

Files or directories that must be ignored when creating the rd-index.json. (`string[]`)

- Example: `['*.ts', '/folder/*', 'ignorefile.txt']`

#### `onProgress`

Optional callback to inform progress.

#### `onStateChange`

Optional callback for state changes.

## Download pipeline

The second pipeline is the download pipeline, this one is a little bit more complex, as file reconstruction enters the party (for this we will see UpdateStrategy below)

### Base download pipeline

Like the upload pipeline, this one is also divided in Hash and Url, so it needs a base pipeline for shared implementations:

```ts
abstract class DownloadPipeline {
  protected updateProgress(
    value: number,
    state: 'download' | 'reconstructing' | 'deleting',
    diskUsage?: number,
    speed?: number,
    options?: DownloadOptions
  ) {
    options?.onProgress?.(state, value, diskUsage, speed);
  }

  protected changeState(
    state: 'downloading' | 'reconstructing' | 'cleaning' | 'scanning',
    options?: DownloadOptions
  ) {
    options?.onStateChange?.(state);
  }

  abstract loadLocalIndex(dir: string): Promise<RDIndex>;

  abstract findLocalIndex(localDir: string): Promise<RDIndex | null>;

  abstract verifyAndDeleteObsoleteChunks(
    plan: DeltaPlan,
    localDir: string,
    remoteIndex: RDIndex,
    chunkSource: ChunkSource,
    options?: DownloadOptions
  ): Promise<{ deletedFiles: string[]; verifiedFiles: string[]; rebuiltFiles: string[] }>;
}
```

### Hash download pipeline

This pipeline will be the one used for almost every storage implementation (S3, SSH, Azure...) except from URL (for signed URLs)

```ts title="Example hash download pipeline abstraction in TS"
export abstract class HashDownloadPipeline extends DownloadPipeline {
  constructor(
    protected readonly storage: HashStorageAdapter,
    protected readonly delta: DeltaService,
    protected readonly reconstruction: ReconstructionService,
    protected readonly validation: ValidationService,
    protected readonly config: RacDeltaConfig
  ) {
    super();
  }

  abstract execute(
    localDir: string,
    strategy: UpdateStrategy,
    remoteIndex?: RDIndex,
    options?: DownloadOptions
  ): Promise<void>;

  abstract saveLocalIndex(localDir: string, index: RDIndex): Promise<void>;

  abstract downloadAllMissingChunks(
    plan: DeltaPlan,
    target: 'memory' | 'disk',
    options?: DownloadOptions
  ): Promise<ChunkSource>;
}
```

### URL downlaod pipeline

This pipeline will be the one used for URL Storage (signed URLs)

```ts title="Example url download pipeline abstraction in TS"
abstract class UrlDownloadPipeline extends DownloadPipeline {
  constructor(
    protected readonly storage: UrlStorageAdapter,
    protected readonly reconstruction: ReconstructionService,
    protected readonly validation: ValidationService,
    protected readonly delta: DeltaService,
    protected readonly config: RacDeltaConfig
  ) {
    super();
  }

  abstract execute(
    localDir: string,
    urls: {
      downloadUrls: Record<string, ChunkUrlInfo>;
      indexUrl: string;
    },
    strategy: UpdateStrategy,
    plan?: DeltaPlan,
    options?: DownloadOptions
  ): Promise<void>;

  abstract saveLocalIndex(localDir: string, index: RDIndex): Promise<void>;

  abstract downloadAllMissingChunks(
    downloadUrls: Record<string, ChunkUrlInfo>,
    target: 'memory' | 'disk',
    options?: DownloadOptions
  ): Promise<ChunkSource>;
}

interface ChunkUrlInfo {
  url: string;
  offset: number;
  size: number;
  filePath: string;
}
```

### UpdateStrategy

For better customizable pipelines, we recommend using `UpdateStrategy`, this enum will make available different ways to download and reconstruct your files.

```ts
enum UpdateStrategy {
  DownloadAllFirstToMemory = 'download-all-first-to-memory',

  StreamFromNetwork = 'stream-from-network',

  DownloadAllFirstToDisk = 'download-all-first-to-disk',
}
```

#### `DownloadAllFirstToMemory`

Downloads every chunk before reconstruction and save chunks in memory.
Perfect for fast connection and offline reconstruction.

**NOTE**: For large updates this is not recommended, as could use a lot of memory.

#### `DownloadAllFirstToDisk`

Downloads every chunk before reconstruction and save chunks in disk to given path. Perfect for fast connection, fast disks and offline reconstruction.

#### `StreamFromNetwork`

Downloads chunks on demand while reconstruction. Useful for limited resourced environments or progressive streaming.

### DownloadOptions

For better customization and performance of the pipeline, some optional configuration can be used:

```js
interface DownloadOptions {
  force?: boolean;
  chunksSavePath?: string;
  useExistingIndex?: boolean;
  fileReconstructionConcurrency?: number;
  inPlaceReconstructionThreshold?: number;

  /**
   * Optional callback to inform progress.
   */
  onProgress?: (
    type: 'download' | 'deleting' | 'reconstructing',
    progress: number,
    diskUsage?: number,
    speed?: number
  ) => void;

  /**
   * Optinal callback for state changes.
   */
  onStateChange?: (state: 'downloading' | 'reconstructing' | 'cleaning' | 'scanning') => void;
}
```

#### `force`

If true, downloads everything. If false, only new and modified chunks will be downloaded. (`boolean`)

#### `chunksSavePath`

Path where chunks will be saved if `DownloadAllFirstToDisk` strategy is set. (`string`)

#### `useExistingIndex`

If true, will search first an existing rd-index in local dir. This option is not recommended, as generating a new rd-index is always the best way to detect changes or corruption. (`boolean`)

#### `fileReconstructionConcurrency`

How many files will be reconstructed concurrently. (Default is 5) (`number`)

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

#### `onProgress`

Optional callback to inform progress.

#### `onStateChange`

Optinal callback for state changes.

---
sidebar_position: 6
---

# Pipelines

Pipelines son una forma opcional pero recomendada de unificar todos los servicios y configuraciones en una pipeline coherente que sigue el protocolo perfectamente.

De esta forma solo necesitas usarlo haciendo `pipeline.execute(...)` y olvidarte de pasos extra.

## Pipeline de subida

La primera pipeline es la de subida, esta sigue el protocolo rac-delta para subir una nueva versión de tu build escaneando el directorio local, generando un rd-index.json, comparando, y parcheando lo cambios. Todo esto usando tu configuración actual.

### Pipeline de subida base

Al igual que el adaptador de almacenamiento, la pipeline de subida también necesita una clase base, ya que tendrá versiones Hash y Url, con distintos parámetros y comportamientos ligeramente diferentes.

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

### Pipeline de subida Hash

Esta pipeline será la que se use para casi todas las implementaciones de almacenamiento (S3, SSH, Azure...) excepto la de URL (urls firmadas)

```ts title="Ejemplo de clase abastracta HashUploadPipeline en TS"
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

### Pipeline de subida URL

Esta pipeline será la que se use para el almacenamiento URL (URLs firmadas)

```ts title="Ejemplo de clase abstracta UrlUploadPipeline en TS"
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

Como puedes ver, los nombres de los métodos y las propiedades son diferentes. En este caso, el usuario debe proporcionar las urls. Da por hecho que la API que proporciona estas URLs ya ha comparado los índices y creado un `DeltaPlan` para conseguir las urls correctas.

### UploadOptions

Para mejor personalización y rendimiento de la pipeline, algunos parámetros opcionales pueden usarse:

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

Si es true, fuerza una subida completa incluso si existe un índice remoto. Si es false, solo los chunks nuevos y modificados se subirán. (`boolean`)

#### `requireRemoteIndex`

Si es true y no hay índice remoto, se aborta la subida. Si es falso (por defecto), sube todo si no se encuentra un índice remoto. (`boolean`)

#### `ignorePatterns`

Archivos o directorios que deben ser ignorados al crear el rd-index.json. (`string[]`)

- Ejemplo: `['*.ts', '/folder/*', 'ignorefile.txt']`

#### `onProgress`

Callback opcional para informar progreso.

#### `onStateChange`

Callback opcional para los cambios de estado.

## Pipeline de descarga

La segunda pipeline es la de descarga, esta es un poco más compleja, ya que la reconstrucción de archivos entra en juego (para esto veremos UpdateStrategy más abajo)

### Pipeline de descarga base

Como la pipeline de subida, esta también se divide en Hash y Url, así que necesita una pipeline base para implementaciones compartidas:

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

### Pipeline de descarga Hash

Esta pipeline será la que usará la mayoría de implementaciones de almacenamiento (S3, SSH, Azure...) excepto la de URL (para URLs firmadas)

```ts title="Ejemplo de clase abstracta HashDownloadPipeline en TS"
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

### Pipeline de descarga URL

Esta pipeline será la usada para el almacenamiento URL (URLs firmadas)

```ts title="Ejemplo de abstracción UrlDownloadPipeline en TS"
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

Para unas pipelines más personalizadas, recomendamos el uso de `UpdateStrategy`, este enum hará disponible distintas formas de descargar y reconstruir los archivos.

```ts
enum UpdateStrategy {
  DownloadAllFirstToMemory = 'download-all-first-to-memory',

  StreamFromNetwork = 'stream-from-network',

  DownloadAllFirstToDisk = 'download-all-first-to-disk',
}
```

#### `DownloadAllFirstToMemory`

Descarga todos los chunks antes de reconstruir y los guarda en memoria.
Perfecto para conexiones rápidas y reconstrucción offline.

**NOTA**: Para actualizaciones grandes esta opción no se recomienda, ya que puede usar mucha memoria.

#### `DownloadAllFirstToDisk`

Descarga todos los chunks antes de reconstruir y los guarda en disco en la ruta especificada. Perfecto para conexiones rápidas, discos rápidos y reconstrucción offline.

#### `StreamFromNetwork`

Descarga chunks bajo demanda mientras reconstruye. Útil para entornos con recursos limitados o streaming progresivo.

### DownloadOptions

Para mejor personalización y rendimiento de la pipeline, se puede usar configuraciones opcionales:

```js
interface DownloadOptions {
  force?: boolean;
  chunksSavePath?: string;
  useExistingIndex?: boolean;
  fileReconstructionConcurrency?: number;
  inPlaceReconstructionThreshold?: number;
  onProgress?: (
    type: 'download' | 'deleting' | 'reconstructing',
    progress: number,
    diskUsage?: number,
    speed?: number
  ) => void;
  onStateChange?: (state: 'downloading' | 'reconstructing' | 'cleaning' | 'scanning') => void;
}
```

#### `force`

Si es true, lo descarga todo. Si es false, solo descargará los chunks nuevos y modificados. (`boolean`)

#### `chunksSavePath`

Ruta donde los chunks se guardarán si la estrategia `DownloadAllFirstToDisk` es seleccionada. (`string`)

#### `useExistingIndex`

Si es true, buscará primero un rd-index existente en el directorio local. Esta opción no es recomendada, ya que generar un nuevo rd-index es siempre la mejor forma de detectar cambios o corrupción. (`boolean`)

#### `fileReconstructionConcurrency`

Cuántos archivos se reconstruirán concurrentemente. (Por defecto es 5) (`number`)

#### `inPlaceReconstructionThreshold`

Tamaño de archivo mínimo (en bytes) necesarios para realizar una **reconstrucción in-place** en lugar de usar un archivo temporal.
Por defecto: `400 * 1024 * 1024` (400 MB).

**Reconstrucción in-place:**
El archivo existente es abierto y actualizado directamente sobreescribiendo solo los chunks modificados o nuevos.

**Reconstrucción .tmp:**
El archivo es completamente reconstruido en un `.tmp` usando todos los chunks (nuevos y existentes), luego reemplaza el archivo original.

**Cuándo usar:**
La reconstrucción in-place se recomienda para **archivos grandes**, ya que evita reescribir el archivo entero y reduce significativamente el uso del espacio del disco.
Sin embargo, puede ser **inseguro para ciertos formatos** (ejemplo, archivos ZIP o bases de datos) que son sensibles a la escritura parcial o la corrupción.
Para deshabilitar la reconstrucción in-place por completo, pon este valor como `0`.

#### `onProgress`

Callback opcional para informar progreso.

#### `onStateChange`

Callback opcional para cambios de estado.

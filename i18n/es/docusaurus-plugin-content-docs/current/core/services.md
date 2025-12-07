---
sidebar_position: 5
---

# Servicios

Para poder organizar y usar rac-delta correctamente, es importante atomizar las responsabilidades del protocolo en distintos servicios.

El core de rac-delta se compone de cuatro servicios principales que conectarán cada operación del protocolo.

## Servicio hasher

Este servicio se encargará de implementar el hashing para crear los hashes de los archivos y los chunks, para verificar la integración y para generar los objetos `FileEntry` y `Chunk` con sus hashes.

Aquí está la abstracción del servicio, lista para ser implementada con la librería que prefieras.

```ts title="Servicio hasher abstracto en TypeScript"
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

## Servicio de validación

El servicio de validación se usa únicamente para validar archivos e índices. Usa el servicio hasher internamente para esto. Tiene métodos básicos que devuelven booleanos.

```ts title="Servicio de validación abstracto en TypeScript"
interface ValidationService {
  validateFile(entry: FileEntry, path: string): Promise<boolean>;

  validateIndex(index: RDIndex, basePath: string): Promise<boolean>;
}
```

## Servicio delta

El servicio delta se encarga principalmente de crear los rd-index.json, compararlos y fusionarlos.

Comparar dos archivos rd-index generarán un [Delta Plan](/core/interfaces#deltaplan) que incluye los cambios a subir o descargar.

```ts title="Servicio delta abstracto en TypeScript"
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

Como puedes ver arriba, `createFileEntryFromStream` usa `AsyncChunkStream`, un objeto que extiende AsyncIterable para una experiencia más personalizada:

```ts
interface AsyncChunkStream extends AsyncIterable<Uint8Array> {
  nextChunk(): Promise<Uint8Array | null>;
  reset?(): Promise<void>;
  close?(): Promise<void>;
}
```

Por cómo los streams se manejan de forma diferente en cada lenguaje, toma esto solo como recomendación y guia, puede diferir bastante de otros lenguajes como Python o Rust.

## Servicio de reconstrucción

El servicio de reconstrucción es un servicio complejo que se encarga de reconstruir los archivos a partir de los chunks.

Puede reconstruir un solo archivo o todos los archivos de un delta plan.

```ts title="Abstracción de ejemplo del servicio de reconstrucción en TypeScript"
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

Solo tiene tres métodos públicos, pero tendrá tantos métodos privados como quieras hacer de complejo el servicio. (Reconstrucción temporal, in-place, umbrales, validación, streaming...)

### ChunkSource

Como puedes ver arriba, cada método necesita un `ChunkSource`, un servicio especial que conecta directamente con tu adaptador de almacenamiento, tu memoria, o tu disco, dependiendo de cómo quieras manejar tus hcunks.

Esta es la abstracción para `ChunkSource`:

```ts title="Abstracción de ChunkSource en TypeScript"
interface ChunkSource {
  getChunk(hash: string): Promise<Buffer>;

  getChunks?(hashes: string[], options?: { concurrency?: number }): Promise<Map<string, Buffer>>;

  streamChunks?(
    hashes: string[],
    options?: { concurrency?: number; preserveOrder?: boolean }
  ): AsyncGenerator<{ hash: string; data: Readable }>;
}
```

Las implementaciones recomendadas son: `StorageChunkSource`, `MemoryChunkSource` y `DiskChunkSource` (La primera descargará los chunks desde el almacenamiento remoto, la segunda desde memoria si los chunks se descargaron primero, y la tercera lo mismo perdo desde el disco)

El uso recomendado para el servicio de reconstruccion es intentar `streamChunks` > `getChunks` > `getChunk` si existen, para mejor rendimiento.

### ReconstructionOptions

Para una mejor experiencia de usuario, personalización y rendimiento, hay algunos parámetros de configuración recomendados para el servicio:

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

Fuerza la reconstrucción incluso si el hash del archivo coincide. (`boolean`)

#### `verifyAfterRebuild`

Verifica el hash del archivo reconstruido tras terminar. Si no coincide, se lanza un error. (`boolean`)

#### `inPlaceReconstructionThreshold`

Tamaño de archivo mínimo (en bytes) necesarios para realizar una **reconstrucción in-place** en lugar de usar un archivo temporal.
Por defecto: `400 * 1024 * 1024` (400 MB).

**Reconstrucción in-place:**
El archivo existente es abierto y actualizado directamente sobreescribiendo solo los chunks modificados o faltantes.

**Reconstrucción .tmp:**
El archivo es completamente reconstruido en un `.tmp` temporal usando todos los chunks (nuevos y existentes), luego se reemplaza sobre el archivo original.

**Cúando usar:**

La reconstrucción in-place se recomienda para **archivos grandes**, ya que evita reescribir el archivo completo y reduce drásticamente el uso del espacio en disco.
Sin embargo, puede ser **inseguro para ciertos formatos** (ejemplo: Archivos zip o bases de datos) que son sensibles a las escrituras parciales o la corrupción.
Para desactivar la reconstrucción in-place por completo, pon este valor como `0`.

#### `fileConcurrency`

Cuántos archivos se reconstruirán concurrentemente (por defecto el valor es 5). (`number`)

#### `onProgress`

Callback que devuelve el uso del disco y una velocidad de red opcional (solo funciona con los chunk sources que usan el almacenamiento y la estrategia de streaming descarga-reconstrucción)

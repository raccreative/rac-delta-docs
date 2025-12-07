---
title: ReconstructionService
description: Servicio encargado de reconstruir archivos desde chunks usando cualquier ChunkSource.
sidebar_position: 4
---

# ReconstructionService

`ReconstructionService` define la interfaz principal responsable de **reconstruir archivos desde sus chunks**, ya sea a disco o stream.
Este servicio se comunica directamente con un [`ChunkSource`](../chunk-sources/chunk-source) para obtener los datos necesarios y reconstruir el archivo.

Sirve como el componente principal del proceso de restauración en rac-delta.

---

## Métodos

| Método                                                      | Devuelve            | Descripción                                                           |
| ----------------------------------------------------------- | ------------------- | --------------------------------------------------------------------- |
| `reconstructFile(entry, outputPath, chunkSource, options?)` | `Promise<void>`     | Reconstruye un único archivo en disco.                                |
| `reconstructAll(plan, outputDir, chunkSource, options?)`    | `Promise<void>`     | Reconstruye todos los archivos de un DeltaPlan en disco.              |
| `reconstructToStream(entry, chunkSource)`                   | `Promise<Readable>` | Reconstruye un archivo en memoria y lo devuelve como Readable stream. |

---

## ReconstructionOptions

Opciones para el proceso de reconstrucción:

```ts
export interface ReconstructionOptions {
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

| Parámetro                        | Tipo      | Descripción                                                                                                                                            |
| -------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `forceRebuild`                   | `boolean` | Forzar la reconstrucción incluso si el hash del archivo coincide.                                                                                      |
| `verifyAfterRebuild`             | `boolean` | Verifica el hash del archivo reconstruido tras terminar. Si el hash no coincide, se lanza un error.                                                    |
| `inPlaceReconstructionThreshold` | `number`  | Tamaño de archivo mínimo (en bytes) necesarios para realizar una **reconstrucción in-place** en lugar de usar un archivo temporal.                     |
| `fileConcurrency`                | `number`  | Cuántos archivos se reconstruirán de forma concurrente (valor por defecto es 5).                                                                       |
| `onProgress`                     | `boolean` | Callback que devuelve el uso de disco y la velocidad de red opcional (solo para chunk sources de almacenamiento vía streaming descarga-reconstrucción) |

---

## Detalles de métodos

### `reconstructFile(entry, outputPath, chunkSource, options?)`

Reconstruye un solo archivo desde un `FileEntry` en disco.

**Parámetros:**

| Nombre        | Tipo                    | Descripción                                                               |
| ------------- | ----------------------- | ------------------------------------------------------------------------- |
| `entry`       | `FileEntry`             | El `FileEntry` que contiene la lista de chunks y la ruta del archivo.     |
| `outputPath`  | `string`                | La ruta donde el archivo será reconstruido.                               |
| `chunkSource` | `ChunkSource`           | La implementación de chunk source desde donde se recolectarán los chunks. |
| `options?`    | `ReconstructionOptions` | Opciones para la reconstrucción.                                          |

**Devuelve:** `Promise<void>`

---

### `reconstructAll(plan, outputDir, chunkSource, options?)`

Reconstruye todos los archivos del DeltaPlan dado en disco.

**Parámetros:**

| Nombre        | Tipo                    | Descripción                                                               |
| ------------- | ----------------------- | ------------------------------------------------------------------------- |
| `plan`        | `DeltaPlan`             | El `DeltaPlan` que contiene los archivos a reconstruir.                   |
| `outputDir`   | `string`                | La ruta donde los archivos serán reconstruidos.                           |
| `chunkSource` | `ChunkSource`           | La implementación de chunk source desde donde se recolectarán los chunks. |
| `options?`    | `ReconstructionOptions` | Opciones para la reconstrucción.                                          |

**Devuelve:** `Promise<void>`

---

### `reconstructToStream(entry, chunkSource)`

Reconstruye un archivo en memoria y lo devuelve como un Readable stream.

**Parámetros:**

| Nombre        | Tipo          | Descripción                                                               |
| ------------- | ------------- | ------------------------------------------------------------------------- |
| `entry`       | `FileEntry`   | El `FileEntry` que contiene la lista de chunks y la ruta del archivo.     |
| `chunkSource` | `ChunkSource` | La implementación de chunk source desde donde se recolectarán los chunks. |

**Devuelve:** `Promise<void>`

---

## Relacionado

- [DeltaPlan](/reference/NodeJS/models/delta-plan)
- [FileEntry](/reference/NodeJS/models/file-entry)
- [ChunkSource](/reference/NodeJS/chunk-sources/chunk-source)

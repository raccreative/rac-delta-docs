---
title: DownloadPipeline
description: Clase abstracta base encargada de administrar el flujo de descarga de archivos.
sidebar_position: 4
---

# DownloadPipeline

`DownloadPipeline` es la clase abstracta base responsable de administrar el flujo de descarga de archivos en rac-delta.
Proporciona la estructura clave para notificar progreso, manejar cambios de estados, y coordinar las descargas, pero no implementa toda la lógica de almacenamiento real.

Esta clase está hecha para ser extendida por las pipelines especializadas como `HashDownloadPipeline` y `UrlDownloadPipeline`.

---

## Métodos

Métodos base compartidos.

| Método                                                                              | Devuelve                                                                               | Descripción                                                                                       |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `updateProgress(value, state, diskUsage?, speed?, options?)`                        | `void`                                                                                 | Callback para el progreso de descarga o reconstrucción de archivos.                               |
| `changeState(state, options?)`                                                      | `void`                                                                                 | Callback para notificar cambios de estado.                                                        |
| `loadLocalIndex(dir)`                                                               | `Promise<RDIndex>`                                                                     | Crea un rd-index.json de un directorio dado.                                                      |
| `findLocalIndex(localDir)`                                                          | `Promise<RDIndex \| null>`                                                             | Buscará un rd-index.json si existe en el directorio dado.                                         |
| `verifyAndDeleteObsoleteChunks(plan, localDir, remoteIndex, chunkSource, options?)` | `Promise<{ deletedFiles: string[]; verifiedFiles: string[]; rebuiltFiles: string[] }>` | Este método comprobará los archivos reconstruidos, verificando sus hashes y los chunks obsoletos. |
| `saveLocalIndex(localDir, index)`                                                   | `Promise<void>`                                                                        | Este método guardará el rd-index.json en el directorio dado.                                      |

---

## DownloadOptions

El objeto `DownloadOptions` permite personalizar el comportamiento de una descarga:

```ts
export interface DownloadOptions {
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

| Propiedad                        | Tipo                                           | Descripción                                                                                                                        |
| -------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `force`                          | `boolean`                                      | Si es true, descarga todo. Si es false, solo los chunks nuevos y modificados se descargarán.                                       |
| `chunksSavePath`                 | `string`                                       | Ruta donde se guardarán los chunks si la estrategia `DownloadAllFirstToDisk` es la seleccionada.                                   |
| `useExistingIndex`               | `boolean`                                      | Si es true, buscará primero un rd-index existente en el directorio local.                                                          |
| `fileReconstructionConcurrency`  | `number`                                       | Cuántos archivos se reconstruirán concurrentemente.                                                                                |
| `inPlaceReconstructionThreshold` | `number`                                       | Tamaño mínimo de archivo (en bytes) necesarios para realizar una **reconstrucción in-place** en lugar de usar un archivo temporal. |
| `onProgress`                     | `(type, progress, diskUsage?, speed?) => void` | Callback opcional para informar progreso.                                                                                          |
| `onStateChange`                  | `(state) => void`                              | Callback opcional para cambios de estado.                                                                                          |

---

## UpdateStrategy

Enum con diferentes estrategias para reconstruir y descargar archivos.

```ts
export enum UpdateStrategy {
  DownloadAllFirstToMemory = 'download-all-first-to-memory',
  StreamFromNetwork = 'stream-from-network',
  DownloadAllFirstToDisk = 'download-all-first-to-disk',
}
```

Para más info, mira: [Uso de la pipeline de descarga](/docs/usage/downloading#update-strategies)

---

## Detalles de métodos

### `updateProgress(value, state, diskUsage?, speed?, options?)`

Usado para llamar a la callback `onProgress` dada dentro de `options`.

**Parámetros**

| Nombre       | Tipo                                     | Descripción                                                                                               |
| ------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `value`      | `number`                                 | Valor del progreso (0 - 100)                                                                              |
| `state`      | `download \| deleting \| reconstructing` | Qué operación está siendo monitorizada.                                                                   |
| `diskUsage?` | `number`                                 | Velocidad en bytes/s (solo para el estado de reconstrucción)                                              |
| `speed?`     | `number`                                 | Velocidad en bytes/s (solo para el estado de descarga)                                                    |
| `options?`   | `DownloadOptions`                        | Objeto de opciones, echa un ojo a DownloadOptions arriba para más info (este método solo usa la callback) |

**Devuelve**

`void`

---

### `changeState(state, options?)`

Usado para llamar a la callback `onStateChange` dada dentro de `options`.

**Parámetros**

| Nombre     | Tipo                                           | Descripción                                                                                               |
| ---------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `state`    | `'download' \| 'deleting' \| 'reconstructing'` | Estado del flujo.                                                                                         |
| `options?` | `DownloadOptions`                              | Objeto de opciones, echa un ojo a DownloadOptions arriba para más info (este método solo usa la callback) |

**Devuelve**

`void`

---

### `loadLocalIndex(dir)`

Este método creará un rd-index.json de un directorio dado, escaneando archivos y generando hashes.

**Parámetros**

| Nombre | Tipo     | Descripción                                 |
| ------ | -------- | ------------------------------------------- |
| `dir`  | `string` | Ruta del directorio para generar el índice. |

**Devuelve**

`Promise<RDIndex>`

---

### `findLocalIndex(localDir)`

Este método buscará un rd-index.json si existe en el directorio dado.

**Parámetros**

| Nombre     | Tipo     | Descripción                                |
| ---------- | -------- | ------------------------------------------ |
| `localDir` | `string` | Ruta del directorio para buscar el índice. |

**Devuelve**

`Promise<RDIndex>`

---

### `verifyAndDeleteObsoleteChunks(plan, localDir, remoteIndex, chunkSource, options?)`

Este método comprobará los archivos reconstruidos, verificando sus hashes y los chunks obsoletos. Si aún quedan chunks obsoletos, se eliminarán y se reconstruirá el archivo de nuevo si es necesario.

**Parámetros**

| Nombre        | Tipo              | Descripción                                                                                                                              |
| ------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `plan`        | `DeltaPlan`       | El `DeltaPlan` generado por delta.compare de los dos rd-index.json para la descarga.                                                     |
| `localDir`    | `string`          | Ruta del directorio para comprobar archivos.                                                                                             |
| `remoteIndex` | `RDIndex`         | El índice remoto para referencia.                                                                                                        |
| `chunkSource` | `ChunkSource`     | `ChunkSource` para descargar chunks en caso de archivos inválidos. Mira [ChunkSource](/docs/reference/NodeJS/chunk-sources/chunk-source) |
| `options?`    | `DownloadOptions` | Objeto de opciones, echa un ojo a DownloadOptions arriba para más info (este método solo usa la callback)                                |

**Devuelve**

`Promise<{ deletedFiles: string[]; verifiedFiles: string[]; rebuiltFiles: string[] }>`

---

### `saveLocalIndex(localDir, index)`

Este método guardará el nuevo índice local en la carpeta dada.

**Parámetros**

| Nombre     | Tipo      | Descripción                                   |
| ---------- | --------- | --------------------------------------------- |
| `localDir` | `string`  | Directorio donde se guardará el nuevo índice. |
| `index`    | `RDIndex` | El objeto RDIndex a guardar.                  |

**Devuelve**

`Promise<void>`

---

## Relacionado

- [HashDownloadPipeline](/docs/reference/NodeJS/pipelines/hash-download-pipeline)
- [UrlDownloadPipeline](/docs/reference/NodeJS/pipelines/url-download-pipeline)
- [ChunkSource](/docs/reference/NodeJS/chunk-sources/chunk-source)
- [RDIndex](/docs/reference/NodeJS/models/rdindex)
- [DeltaPlan](/docs/reference/NodeJS/models/delta-plan)

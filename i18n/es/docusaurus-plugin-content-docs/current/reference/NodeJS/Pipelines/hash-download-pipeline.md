---
title: HashDownloadPipeline
description: Adaptador abstracto de la pipeline de descarga para acceso a chunks basado en hash.
sidebar_position: 5
---

# HashDownloadPipeline

`HashDownloadPipeline` es una extensión abstracta de `DownloadPipeline` diseñada para manejar descargas usando adaptadores de almacenamiento basados en hash (`HashStorageAdapter`).
Orquesta el proceso de escanear directorios, computar deltas con `DeltaService`, descargar chunks faltantes, y reconstruir archivos.

Esta pipeline es comúnmente usada para descargas desde sistemas de almacenamiento donde los chunks se identifican por hash.

---

## Constructor

| Parámetro        | Tipo                    | Descripción                                                                                       |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| `storage`        | `HashStorageAdapter`    | Adaptador de almacenamiento basado en hash que se usará (se crea automáticamente con el cliente). |
| `delta`          | `DeltaService`          | DeltaService usado para generar índices y compararlos.                                            |
| `reconstruction` | `ReconstructionService` | ReconstructionService usado para reconstrucción de archivos locales.                              |
| `validation`     | `ValidationService`     | ValidationService usado para validar archivos tras reconstruirlos.                                |
| `config`         | `RacDeltaConfig`        | Configuración base del cliente.                                                                   |

---

## Métodos

| Método                                                | Devuelve               | Descripción                                                                                                  |
| ----------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `execute(localDir, strategy, remoteIndex?, options?)` | `Promise<void>`        | Realiza un proceso completo de descarga para un directorio.                                                  |
| `downloadAllMissingChunks(plan, target, options?)`    | `Promise<ChunkSource>` | Este método descargará primero todos los chunks necesarios, y los guardará temporalmente en disco o memoria. |

---

## Detalles de métodos

### `execute(localDir, strategy, remoteIndex?, options?)`

Realiza un proceso completo de descarga para un directorio.

**Parámetros**

| Nombre        | Tipo              | Descripción                                                                                                           |
| ------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| `localDir`    | `string`          | Directorio donde se descargará la nueva actualización.                                                                |
| `strategy`    | `UpdateStrategy`  | Estrategia a usar para la descarga y reconstrucción. Mira [UpdateStrategy](/docs/usage/downloading#update-strategies) |
| `remoteIndex` | `RDIndex`         | rd-index remoto opcional. Si no se proporciona ninguno, intentará descargarlo del almacenamiento.                     |
| `options`     | `DownloadOptions` | Opciones para el proceso de descarga. Mira [DownloadOptions](./download-pipeline#downloadoptions)                     |

**Devuelve**

`Promise<void>`

---

### `downloadAllMissingChunks(plan, target, options?)`

Este método descargará primero todos los chunks necesarios, y los guardará temporalmente en disco o memoria.

Devolverá un `ChunkSource`, los ChunkSource serán necesarios para reconstruir archivos, este método SOLO devolverá chunks sources de memoria o disco para reconstrucción offline, si quieres usar almacenamiento como S3, puedes omitir esto y usar directamente un `StorageChunkSource` con `reconstruction.reconstructAll()` si lo prefieres.

(Usar StorageChunkSource descargará los chunks y reconstruirá los archivos al mismo tiempo, concurrentemente)

**Parámetros**

| Nombre    | Tipo                 | Descripción                                                                                       |
| --------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `plan`    | `DeltaPlan`          | El `DeltaPlan` generado por delta.compare de los dos rd-index.json para la descarga.              |
| `target`  | `'memory' \| 'disk'` | Objetivo del ChunkSource resultante.                                                              |
| `options` | `DownloadOptions`    | Opciones para el proceso de descarga. Mira [DownloadOptions](./download-pipeline#downloadoptions) |

**Devuelve**

`Promise<ChunkSource>`

---

## Relacionado

- [DownloadPipeline](/docs/reference/NodeJS/pipelines/download-pipeline)
- [UrlDownloadPipeline](/docs/reference/NodeJS/pipelines/url-download-pipeline)
- [ChunkSource](/docs/reference/NodeJS/chunk-sources/chunk-source)
- [RDIndex](/docs/reference/NodeJS/models/rdindex)
- [DeltaPlan](/docs/reference/NodeJS/models/delta-plan)

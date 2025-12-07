---
title: UrlDownloadPipeline
description: Adaptador de pipeline de descarga abstracto para acceso a chunks basados en url.
sidebar_position: 6
---

# UrlDownloadPipeline

`UrlDownloadPipeline` es una extensión abstracta de `DownloadPipeline` diseñada para manejar subidas usando adaptadores de almacenamiento basados en URLs (`UrlStorageAdapter`).
A diferencia de `HashDownloadPipeline`, esta pipeline da por hecho que el plan delta (qué chunks descargar) es calculado externamente y proporcionado a la pipeline.

Esta pipeline es comúnmente usada para los sistemas de almacenamiento remotos donde los chunks tienen una URL dedicada para la descarga.

---

## Constructor

| Parámetro        | Tipo                    | Descripción                                                                                       |
| ---------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| `storage`        | `UrlStorageAdapter`     | Adaptador de almacenamiento basado en urls que se usará (se crea automáticamente con el cliente). |
| `reconstruction` | `ReconstructionService` | ReconstructionService usado para reconstrucción de archivos locales.                              |
| `validation`     | `ValidationService`     | ValidationService usado para validar archivos tras reconstruirlos.                                |
| `delta`          | `DeltaService`          | DeltaService usado para generar índices y compararlos.                                            |
| `config`         | `RacDeltaConfig`        | Configuración base del cliente.                                                                   |

---

## Métodos

| Método                                                                      | Devuelve               | Descripción                                                                                                  |
| --------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| `execute(localDir, { downloadUrls, indexUrl }, strategy,  plan?, options?)` | `Promise<void>`        | Realiza un proceso completo de descarga para el directorio.                                                  |
| `downloadAllMissingChunks(downloadUrls, target, options?)`                  | `Promise<ChunkSource>` | Este método descargará primero todos los chunks necesarios, y los guardará temporalmente en disco o memoria. |

---

## Detalles de métodos

### `execute(localDir, urls, strategy,  plan?, options?)`

Realiza un proceso completo de descarga para el directorio vía urls.

**Parámetros**

| Nombre              | Tipo                           | Descripción                                                                                                 |
| ------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `localDir`          | `string`                       | Directorio donde se descargará todo.                                                                        |
| `urls.downloadUrls` | `Record<string, ChunkUrlInfo>` | Las urls identificadas por hash para descargar los chunks. Mira ChunkUrlInfo abajo.                         |
| `urls.indexUrl`     | `string`                       | Url para descargar el rd-index.json remoto.                                                                 |
| `strategy`          | `UpdateStrategy`               | Estrategia a usar para descargar y reconstruir. Mira [UpdateStrategy](/usage/downloading#update-strategies) |
| `plan`              | `DeltaPlan`                    | DeltaPlan opcional para referencia, si no se proporciona ninguno, se intentará generar.                     |
| `options`           | `DownloadOptions`              | Opciones para el progreso de descarga. Mira [DownloadOptions](./download-pipeline#downloadoptions)          |

```ts
export interface ChunkUrlInfo {
  url: string;
  offset: number;
  size: number;
  filePath: string;
}
```

Echa un ojo a [ChunkUrlInfo](/reference/NodeJS/models/chunk-url-info)

**Devuelve**

`Promise<void>`

---

### `downloadAllMissingChunks(downloadUrls, target, options?)`

Este método descargará primero todos los chunks necesarios, y los guardará temporalmente en disco o memoria.

Devolverá un `ChunkSource`, los ChunkSource serán necesarios para reconstruir archivos, este método SOLO devolverá chunks sources de memoria o disco para reconstrucción offline, si quieres usar almacenamiento como S3, puedes omitir esto y usar directamente un `StorageChunkSource` con `reconstruction.reconstructAll()` si lo prefieres.

(Usar StorageChunkSource descargará los chunks y reconstruirá los archivos al mismo tiempo, concurrentemente)

**Parámetros**

| Nombre         | Tipo                           | Descripción                                                                                        |
| -------------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `downloadUrls` | `Record<string, ChunkUrlInfo>` | Las urls identificadas por hash para descargar los chunks. Mira ChunkUrlInfo arriba.               |
| `target`       | `'memory' \| 'disk'`           | Objetivo del ChunkSource resultante.                                                               |
| `options`      | `DownloadOptions`              | Opciones para el progreso de descarga. Mira [DownloadOptions](./download-pipeline#downloadoptions) |

**Devuelve**

`Promise<void>`

---

## Relacionado

- [DownloadPipeline](/reference/NodeJS/pipelines/download-pipeline)
- [HashDownloadPipeline](/reference/NodeJS/pipelines/hash-download-pipeline)
- [ChunkSource](/reference/NodeJS/chunk-sources/chunk-source)
- [RDIndex](/reference/NodeJS/models/rdindex)
- [DeltaPlan](/reference/NodeJS/models/delta-plan)

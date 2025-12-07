---
title: UrlUploadPipeline
description: Adaptador de la pipeline de subida abstracto para los accesos a chunks basados en url.
sidebar_position: 3
---

# UrlUploadPipeline

`UrlUploadPipeline` es una extensión abstracta de `UploadPipeline` diseñada para manejar subidas usando adaptadores de almacenamiento basados en URL (`UrlStorageAdapter`).
A diferencia de `HashUploadPipeline`, esta pipeline da por hecho que el plan delta (el cual indica qué subir o borrar) es calculado externamente y proporcionado a la pipeline.

Esta pipeline se usa comúnmente para sistemas de almacenamiento remoto donde cada chunk tiene una URL dedicada para subir, eliminar o descargar.

---

## Constructor

| Parámetro | Tipo                | Descripción                                                                                       |
| --------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| `storage` | `UrlStorageAdapter` | Adaptador de almacenamiento basado en urls que se usará (se crea automáticamente con el cliente). |
| `config`  | `RacDeltaConfig`    | Configuración base del cliente.                                                                   |

---

## Métodos

| Método                                                                 | Devuelve           | Descripción                                                                |
| ---------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------- |
| `execute(localIndex, { uploadUrls, deleteUrls?, indexUrl }, options?)` | `Promise<RDIndex>` | Realiza un proceso de subida completo para las urls dadas.                 |
| `uploadMissingChunks(uploadUrls, options?)`                            | `Promise<void>`    | Sube los chunks definidos en uploadUrls.                                   |
| `uploadIndex(index, uploadUrl)`                                        | `Promise<void>`    | Sube el rd-index.json a la url dada.                                       |
| `deleteObsoleteChunks(deleteUrls, options?)`                           | `Promise<void>`    | Elimina chunks obsoletos del almacenamiento usando las urls especificadas. |

---

## Detalles de métodos

### `execute(localIndex, { uploadUrls, deleteUrls?, indexUrl }, options?)`

Realiza el proceso de subida completo usando las URLs proporcionadas para los chunks y el índice.

**Parámetros**

| Nombre            | Tipo                           | Descripción                                                                                           |
| ----------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `localIndex`      | `RDIndex`                      | El rd-index necesario para sincronizar, necesario ya que el usuario debería haber comparado ya ambos. |
| `urls.uploadUrls` | `Record<string, ChunkUrlInfo>` | Las urls identificadas por hash para subir chunks. Mira ChunkUrlInfo abajo.                           |
| `urls.deleteUrls` | `string[]`                     | Las urls para eliminar los chunks remotos obsoletos.                                                  |
| `urls.indexUrl`   | `string`                       | La url para subir el nuevo rd-index.json.                                                             |
| `options`         | `UploadOptions`                | Opciones para el proceso de subida. Echa un ojo a [UploadOptions](./upload-pipeline#uploadoptions)    |

```ts
export interface ChunkUrlInfo {
  url: string;
  offset: number;
  size: number;
  filePath: string;
}
```

Echa un vistazo a [ChunkUrlInfo](/reference/NodeJS/models/chunk-url-info)

**Devuelve**

`Promise<RDIndex>`

---

### `uploadMissingChunks(uploadUrls, options?)`

Sube todos los chunks faltantes con sus URLs respectivas. Los Chunks se leen desde disco en base a las rutas especificadas en `ChunkUrlInfo`.

**Parámetros**

| Nombre       | Tipo                           | Descripción                                                                                                          |
| ------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `uploadUrls` | `Record<string, ChunkUrlInfo>` | Las urls identificadas por hash para subir los chunks. Mira [ChunkUrlInfo](/reference/NodeJS/models/chunk-url-info). |
| `options`    | `UploadOptions`                | Opciones para el proceso de subida. Echa un ojo a [UploadOptions](./upload-pipeline#uploadoptions)                   |

**Devuelve**

`Promise<void>`

---

### `uploadIndex(index, uploadUrl)`

Sube el archivo RDIndex a la URL especificada.

**Parámetros**

| Nombre      | Tipo      | Descripción               |
| ----------- | --------- | ------------------------- |
| `index`     | `RDIndex` | El objeto índice a subir. |
| `uploadUrl` | `string`  | Url para subir el índice. |

**Devuelve**

`Promise<void>`

---

### `deleteObsoleteChunks(deleteUrls, options?)`

Elimina chunks obsoletos del almacenamiento remoto usando las URLs. Incluye lógica de reintentos y seguimiento de progreso.

**Parámetros**

| Nombre       | Tipo            | Descripción                                                                                        |
| ------------ | --------------- | -------------------------------------------------------------------------------------------------- |
| `deleteUrls` | `string[]`      | La lista de urls para eliminar chunks.                                                             |
| `options`    | `UploadOptions` | Opciones para el proceso de subida. Echa un ojo a [UploadOptions](./upload-pipeline#uploadoptions) |

**Devuelve**

`Promise<void>`

---

## Relacionado

- [UploadPipeline](/reference/NodeJS/pipelines/upload-pipeline)
- [HashUploadPipeline](/reference/NodeJS/pipelines/hash-upload-pipeline)
- [RDIndex](/reference/NodeJS/models/rdindex)

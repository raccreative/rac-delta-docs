---
title: HashUploadPipeline
description: Adaptador abstracto de la pipeline de subida para acceder a chunks por hash para el flujo de subida.
sidebar_position: 2
---

# HashUploadPipeline

`HashUploadPipeline` es una extensión abstracta de `UploadPipeline` diseñada para manejar subidas usando los adaptadores de almacenamiento basados en hash (`HashStorageAdapter`).
Orquesta el proceso de escanear directorios, computar deltas con `DeltaService`, subir chunks nuevos, y limpiar los chunks obsoletos.

Esta pipeline es comúnmente usada cuando las subidas son a sistemas de almacenamiento donde los chunks se identifican por su hash.

---

## Constructor

| Parámetro | Tipo                 | Descripción                                                                                       |
| --------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| `storage` | `HashStorageAdapter` | Adaptador de almacenamiento basado en hash que se usará (se crea automáticamente con el cliente). |
| `delta`   | `DeltaService`       | DeltaService usado para generar índices y compararlos.                                            |
| `config`  | `RacDeltaConfig`     | Configuración base del cliente.                                                                   |

---

## Métodos

| Método                                                | Devuelve           | Descripción                                                                 |
| ----------------------------------------------------- | ------------------ | --------------------------------------------------------------------------- |
| `execute(directory, remoteIndex?, options?)`          | `Promise<RDIndex>` | Realiza un proceso de subida completo para un directorio.                   |
| `scanDirectory(dir, ignorePatterns?)`                 | `Promise<RDIndex>` | Escanea el directorio recursivamente y crea un RDIndex.                     |
| `uploadMissingChunks(plan, baseDir, force, options?)` | `Promise<void>`    | Sube solo los chunks faltantes o actualizados definidos en el DeltaPlan.    |
| `uploadIndex(index)`                                  | `Promise<void>`    | Sube el archivo RDIndex al adaptador de almacenamiento.                     |
| `deleteObsoleteChunks(delta, options?)`               | `Promise<void>`    | Elimina chunks obsoletos del almacenamiento especificados en el delta plan. |

---

## Detalles de métodos

### `execute(directory, remoteIndex?, options?)`

Realiza un proceso de subida completo para un directorio. Devuelve el `RDIndex` resultante tras el proceso.

**Parámetros**

| Nombre        | Tipo            | Descripción                                                                                        |
| ------------- | --------------- | -------------------------------------------------------------------------------------------------- |
| `directory`   | `string`        | Directorio que será comparado y subido.                                                            |
| `remoteIndex` | `RDIndex`       | rd-index remoto opcional. Si no se proporciona ninguno, se intentará descargar del almacenamiento. |
| `options`     | `UploadOptions` | Opciones para el proceso de subida. Echa un ojo a [UploadOptions](./upload-pipeline#uploadoptions) |

**Devuelve**

`Promise<RDIndex>`

---

### `scanDirectory(dir, ignorePatterns?)`

Escanea el directorio recursivamente y crea un RDIndex, ignorando los archivos que coincidan con los patrones proporcionados.

**Parámetros**

| Nombre           | Tipo       | Descripción                                                                     |
| ---------------- | ---------- | ------------------------------------------------------------------------------- |
| `dir`            | `string`   | Directorio a escanear.                                                          |
| `ignorePatterns` | `string[]` | Patrones a ignorar opcionales, estos patrones se ignorarán al crear el RDIndex. |

**Devuelve**

`Promise<RDIndex>`

---

### `uploadMissingChunks(plan, baseDir, force, options?)`

Sube solo los chunks que faltan o han sido actualizados definidos en el DeltaPlan.

**Parámetros**

| Nombre    | Tipo            | Descripción                                                                                        |
| --------- | --------------- | -------------------------------------------------------------------------------------------------- |
| `plan`    | `DeltaPlan`     | El plan delta indicando qué chunks faltan.                                                         |
| `baseDir` | `string`        | El directorio base que contiene los archivos locales.                                              |
| `force`   | `boolean`       | Si es true, forzará la sobreescritura de chunks en el almacenamiento.                              |
| `options` | `UploadOptions` | Opciones para el proceso de subida. Echa un ojo a [UploadOptions](./upload-pipeline#uploadoptions) |

**Devuelve**

`Promise<void>`

---

### `uploadIndex(index)`

Sube el archivo RDIndex al almacenamiento.

**Parámetros**

| Nombre  | Tipo      | Descripción                 |
| ------- | --------- | --------------------------- |
| `index` | `RDIndex` | El objeto rd-index a subir. |

**Devuelve**

`Promise<void>`

---

### `deleteObsoleteChunks(delta, options?)`

Elimina los chunks obsoletos del almacenamiento especificados por el plan delta.

**Parámetros**

| Nombre    | Tipo            | Descripción                                                                                        |
| --------- | --------------- | -------------------------------------------------------------------------------------------------- |
| `delta`   | `DeltaPlan`     | El plan delta que indica los chunks obsoletos.                                                     |
| `options` | `UploadOptions` | Opciones para el proceso de subida. Echa un ojo a [UploadOptions](./upload-pipeline#uploadoptions) |

**Devuelve**

`Promise<void>`

---

## Relacionado

- [UploadPipeline](/docs/reference/NodeJS/pipelines/upload-pipeline)
- [UrlUploadPipeline](/docs/reference/NodeJS/pipelines/url-upload-pipeline)
- [RDIndex](/docs/reference/NodeJS/models/rdindex)

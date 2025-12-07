---
title: DeltaService
description: Servicio para generar RDIndex y computar deltas entre fuentes y objetivos.
sidebar_position: 3
---

# DeltaService

`DeltaService` proporciona métodos para generar objetos `RDIndex` de directorios o streams, compara dos índices, y genera un `DeltaPlan` describiendo qué chunks necesitan subirse, descargarse, o eliminarse.

Internamente, usa `HasherService` para hashear archivos y streams.

---

## Métodos

| Método                                                                         | Devuelve             | Descripción                                                                                  |
| ------------------------------------------------------------------------------ | -------------------- | -------------------------------------------------------------------------------------------- |
| `createIndexFromDirectory(rootPath, chunkSize, concurrency?, ignorePatterns?)` | `Promise<RDIndex>`   | Escanea un directorio, divide los archivos en chunks, los hashea, y devuelve un `RDIndex`.   |
| `createFileEntryFromStream(stream, path)`                                      | `Promise<FileEntry>` | Crea un `FileEntry` desde un stream de chunk asíncrono.                                      |
| `compare(source, target)`                                                      | `DeltaPlan`          | Compara dos rd-index y devuelve un plan delta describiendo los chunks faltantes y obsoletos. |
| `mergePlans(base, updates)`                                                    | `DeltaPlan`          | Fusiona dos DeltaPlan.                                                                       |
| `compareForUpload(localIndex, remoteIndex)`                                    | `Promise<DeltaPlan>` | Prepara un plan delta para cambios de subida.                                                |
| `compareForDownload(localIndex, remoteIndex)`                                  | `Promise<DeltaPlan>` | Prepara un plan delta para cambios de descarga.                                              |

---

## Detalles de métodos

### `createIndexFromDirectory(rootPath, chunkSize, concurrency?, ignorePatterns?)`

Genera un `RDIndex` de un directorio. Divide los archivos en chunks y los hashea.

**Parámetros:**

| Nombre           | Tipo        | Descripción                                      |
| ---------------- | ----------- | ------------------------------------------------ |
| `rootPath`       | `string`    | Directorio a escanear recursivamente.            |
| `chunkSize`      | `number`    | Tamaño del chunk en bytes (se recomienda 1MB).   |
| `concurrency`    | `number?`   | Número máximo opcional de operaciones paralelas. |
| `ignorePatterns` | `string[]?` | Patrones glob opcionales a ignorar.              |

**Devuelve:** `Promise<RDIndex>`

**Nota:** Usa `HasherService.hashStream` internamente.

---

### `createFileEntryFromStream(stream, path)`

Crea un FileEntry a partir de un stream de chunks válido (de un archivo).

**Parámetros:**

| Parámetro | Tipo               | Descripción                            |
| --------- | ------------------ | -------------------------------------- |
| `stream`  | `AsyncChunkStream` | Stream de chunks asíncrono de entrada. |
| `path`    | `string`           | Ruta relativa del archivo.             |

```ts
export interface AsyncChunkStream extends AsyncIterable<Uint8Array> {
  nextChunk(): Promise<Uint8Array | null>;
  reset?(): Promise<void>;
  close?(): Promise<void>;
}
```

**Devuelve:** `Promise<FileEntry>`

**Nota:** Hashea los chunks usando `HasherService` para generar un `FileEntry` compatible.

---

### `compare(source, target)`

Compara dos rd-index para generar un `DeltaPlan`.

**Parámetros:**

| Parámetro | Tipo              | Descripción                       |
| --------- | ----------------- | --------------------------------- |
| `source`  | `RDIndex`         | Índice fuente.                    |
| `target`  | `RDIndex \| null` | Índice objetivo (puede ser null). |

**Devuelve:** `DeltaPlan`

---

### `mergePlans(base, updates)`

Fusiona dos planes en uno.

**Parámetros:**

| Parámetro | Tipo        | Descripción                               |
| --------- | ----------- | ----------------------------------------- |
| `base`    | `DeltaPlan` | Plan delta base a fusionar.               |
| `updates` | `DeltaPlan` | Plan delta de actualizaciones a fusionar. |

**Devuelve:** `DeltaPlan`

---

### `compareForUpload(localIndex, remoteIndex)`

Wrapper para generar un delta plan listo para subir archivos.

**Parámetros:**

| Parámetro     | Tipo              | Descripción      |
| ------------- | ----------------- | ---------------- |
| `localIndex`  | `RDIndex`         | rd-index local.  |
| `remoteIndex` | `RDIndex \| null` | rd-index remoto. |

**Devuelve:** `Promise<DeltaPlan>`

---

### `compareForDownload(localIndex, remoteIndex)`

Wrapper para generar un delta plan listo para descargar archivos.

**Parámetros:**

| Parámetro     | Tipo              | Descripción      |
| ------------- | ----------------- | ---------------- |
| `localIndex`  | `RDIndex \| null` | rd-index local.  |
| `remoteIndex` | `RDIndex`         | rd-index remoto. |

**Devuelve:** `Promise<DeltaPlan>`

---

## Relacionado

- [RDIndex](/docs/reference/NodeJS/models/rdindex)
- [FileEntry](/docs/reference/NodeJS/models/file-entry)
- [DeltaPlan](/docs/reference/NodeJS/models/delta-plan)
- [HasherService](/docs/reference/NodeJS/services/hasher-service)

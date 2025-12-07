---
title: ValidationService
description: Servicio para validar archivos y objetos RDIndex.
sidebar_position: 2
---

# ValidationService

`ValidationService` valida los archivos y los objetos RDIndex.
Internamente usa `HasherService` para verificar hashes de archivo y chunks.

---

## Métodos

| Método                           | Devuelve           | Descripción                                 |
| -------------------------------- | ------------------ | ------------------------------------------- |
| `validateFile(entry, path)`      | `Promise<boolean>` | Valida un único archivo con su `FileEntry`. |
| `validateIndex(index, basePath)` | `Promise<boolean>` | Valida todos los archivos de un `RDIndex`.  |

---

## Detalles de métodos

### `validateFile(entry, path)`

Verifica un archivo.

**Parámetros:**

| Nombre  | Tipo        | Descripción                      |
| ------- | ----------- | -------------------------------- |
| `entry` | `FileEntry` | Metadatos del archivo a validar. |
| `path`  | `string`    | Ruta del archivo en disco.       |

**Devuelve:** `Promise<boolean>` – `true` si el archivo es válido.

**Nota:** Usa `HasherService` internamente para verificar el hash del archivo y sus chunks.

---

### `validateIndex(index, basePath)`

Vefifica todos los archivos de un rd-index.json.

**Parámetros:**

| Nombre     | Tipo      | Descripción                                |
| ---------- | --------- | ------------------------------------------ |
| `index`    | `RDIndex` | Objeto RDIndex con los archivos a validar. |
| `basePath` | `string`  | Directorio contenedor de los archivos.     |

**Devuelve:** `Promise<boolean>` – `true` si todos los archivos son válidos.

**Nota:** Internamente llama a `validateFile` para cada archivo usando `HasherService`.

## Relacionado

- [RDIndex](/docs/reference/NodeJS/models/rdindex)
- [FileEntry](/docs/reference/NodeJS/models/file-entry)
- [HasherService](/docs/reference/NodeJS/services/hasher-service)

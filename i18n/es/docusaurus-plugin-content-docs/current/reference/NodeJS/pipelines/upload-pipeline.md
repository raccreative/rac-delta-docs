---
title: UploadPipeline
description: Clase abstracta base encargada de manejar el flujo de subida de archivos.
sidebar_position: 1
---

# UploadPipeline

`UploadPipeline` es la clase abstracta base encargada de administrar el flujo de subida de archivos en rac-delta.
Proporciona la estructura principal para notificar progreso, manejar cambios de estados, y coordinar las subidas, pero no implementa la lógica real de almacenamiento.

Esta clase está hecha para ser extendida por las pipelines especializadas como `HashUploadPipeline` y `UrlUploadPipeline`.

---

## Métodos

Métodos base compartidos.

| Método                                           | Devuelve | Descripción                                     |
| ------------------------------------------------ | -------- | ----------------------------------------------- |
| `updateProgress(value, state, speed?, options?)` | `void`   | Callback para el progreso de subida o limpieza. |
| `changeState(state, options?)`                   | `void`   | Callback para notificar cambios de estado.      |

---

## UploadOptions

El objeto `UploadOptions` permite personalizar el comportamiento de una subida:

```ts
export interface UploadOptions {
  force?: boolean;
  requireRemoteIndex?: boolean;
  ignorePatterns?: string[];
  onProgress?: (type: 'upload' | 'deleting', progress: number, speed?: number) => void;
  onStateChange?: (state: UploadState) => void;
}
```

| Propiedad            | Tipo                               | Descripción                                                                                                                              |
| -------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `force`              | `boolean`                          | Si es true, fuerza una subida completa incluso si existe un índice remoto. Si es false, solo los chunks nuevos y modificados se subirán. |
| `requireRemoteIndex` | `boolean`                          | Si es true y no hay índice remoto, se aborta la subida. Si es false (por defecto), sube todo si no encuentra índice remoto.              |
| `ignorePatterns`     | `string[]`                         | Archivos y directorios que deben ser ignorados al crear el rd-index.json.                                                                |
| `onProgress`         | `(type, progress, speed?) => void` | Callback opcional para informar del progreso.                                                                                            |
| `onStateChange`      | `(state) => void`                  | Callback opcional para informar cambios de estado.                                                                                       |

---

## UploadState

Tipo de estado que puede devolver la callback `onStateChange`:

```ts
export type UploadState = 'uploading' | 'comparing' | 'cleaning' | 'finalizing' | 'scanning';
```

---

## Detalles de métodos

### `updateProgress(value, state, speed?, options?)`

Usado para llamar a la callback `onProgress` dentro de `options`.

**Parámetros**

| Nombre     | Tipo                 | Descripción                                                  |
| ---------- | -------------------- | ------------------------------------------------------------ |
| `value`    | `number`             | Valor del progreso (0 - 100)                                 |
| `state`    | `upload \| deleting` | Qué operación está siendo monitorizada.                      |
| `speed?`   | `number`             | Velocidad en bytes/s (solo para el estado de subida)         |
| `options?` | `UploadOptions`      | Objeto de opciones, mira UploadOptions arriba para más info. |

**Devuelve**

`void`

---

### `changeState(state, options?)`

Usado para llamar a la callback `onStateChange` dentro de `options`.

**Parámetros**

| Nombre     | Tipo            | Descripción                                                                         |
| ---------- | --------------- | ----------------------------------------------------------------------------------- |
| `state`    | `UploadState`   | Estado del flujo, mira UploadState arriba.                                          |
| `options?` | `UploadOptions` | Objeto de opciones, mira UploadOptions arriba para más info (solo usa la callback). |

**Devuelve**

`void`

---

## Relacionado

- [HashUploadPipeline](/reference/NodeJS/pipelines/hash-upload-pipeline)
- [UrlUploadPipeline](/reference/NodeJS/pipelines/url-upload-pipeline)

---
title: HashUploadPipeline
description: Adaptador abstracto de la pipeline de subida para acceder a chunks por hash para el flujo de subida.
sidebar_position: 1
---

# HashUploadPipeline

`HashUploadPipeline` es una clase abstracta diseñada para manejar subidas usando los adaptadores de almacenamiento basados en hash (`HashStorageAdapter`).
Orquesta el proceso de escanear directorios, computar deltas con `DeltaService`, subir chunks nuevos, y limpiar los chunks obsoletos.

Esta pipeline es comúnmente usada cuando las subidas son a sistemas de almacenamiento donde los chunks se identifican por su hash.

---

## Constructor

| Parámetro | Tipo                          | Descripción                                                                                       |
| --------- | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `storage` | `Arc<dyn HashStorageAdapter>` | Adaptador de almacenamiento basado en hash que se usará (se crea automáticamente con el cliente). |
| `delta`   | `Arc<dyn DeltaService>`       | DeltaService usado para generar índices y compararlos.                                            |
| `config`  | `Arc<RacDeltaConfig>`         | Configuración base del cliente.                                                                   |

---

## Métodos

| Método                                                  | Devuelve                         | Descripción                                                                 |
| ------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| `execute(directory, remote_index, options)`             | `Result<RDIndex, PipelineError>` | Realiza un proceso de subida completo para un directorio.                   |
| `scan_directory(dir, ignore_patterns)`                  | `Result<RDIndex, PipelineError>` | Escanea el directorio recursivamente y crea un RDIndex.                     |
| `upload_missing_chunks(plan, base_dir, force, options)` | `Result<(), PipelineError>`      | Sube solo los chunks faltantes o actualizados definidos en el DeltaPlan.    |
| `upload_index(index)`                                   | `Result<(), PipelineError>`      | Sube el archivo RDIndex al adaptador de almacenamiento.                     |
| `delete_obsolete_chunks(plan, options)`                 | `Result<(), PipelineError>`      | Elimina chunks obsoletos del almacenamiento especificados en el delta plan. |
| `update_progress(value, phase, speed, options)`         | `()`                             | Método opcional que llama a la callback de progreso en opciones.            |
| `change_state(state, options)`                          | `()`                             | Método opcional que llama a la callback change_state en opciones.           |

---

## UploadOptions

El objeto `UploadOptions` permite personalizar el comportamiento de una subida:

```rust
pub struct UploadOptions {
    pub force: Option<bool>,
    pub require_remote_index: Option<bool>,
    pub ignore_patterns: Option<Vec<String>>,
    pub on_progress: Option<Arc<dyn Fn(UploadPhase, f64, Option<f64>) + Send + Sync>>,
    pub on_state_change: Option<Arc<dyn Fn(UploadState) + Send + Sync>>,
}
```

| Propiedad              | Tipo                                                               | Descripción                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `force`                | `Option<bool>`                                                     | Si es true, fuerza una subida completa incluso si existe un índice remoto. Si es false, solo los chunks nuevos y modificados se subirán. |
| `require_remote_index` | `Option<bool>`                                                     | Si es true y no hay índice remoto, se aborta la subida. Si es false (por defecto), sube todo si no encuentra índice remoto.              |
| `ignore_patterns`      | `Option<Vec<String>>`                                              | Archivos y directorios que deben ser ignorados al crear el rd-index.json.                                                                |
| `on_progress`          | `Option<Arc<dyn Fn(UploadPhase, f64, Option<f64>) + Send + Sync>>` | Callback opcional para informar progreso.                                                                                                |
| `on_state_change`      | `Option<Arc<dyn Fn(UploadState) + Send + Sync>>`                   | Callback opcional para informar cambios de estado.                                                                                       |

```rust
pub enum UploadState {
    Uploading,
    Comparing,
    Cleaning,
    Finalizing,
    Scanning,
}

pub enum UploadPhase {
    Upload,
    Deleting,
}
```

---

## PipelineError

Enum de errores personalizado para los resultados de HashUploadPipeline. (Usa `thiserror`)

```rust
pub enum PipelineError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Delta error: {0}")]
    Delta(String),

    #[error("Storage error: {0}")]
    Storage(String),

    #[error("Index error: {0}")]
    Index(String),

    #[error("Invalid argument: {0}")]
    InvalidArgument(String),

    #[error("Operation aborted")]
    Aborted,

    #[error("Other error: {0}")]
    Other(String),
}
```

---

## Detalles de métodos

### `execute(directory, remote_index, options)`

Realiza un proceso de subida completo para un directorio. Devuelve el `RDIndex` resultante tras el proceso.

**Parámetros**

| Nombre         | Tipo                    | Descripción                                                                                        |
| -------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| `directory`    | `&Path`                 | Directorio que será comparado y subido.                                                            |
| `remote_index` | `Option<RDIndex>`       | rd-index remoto opcional. Si no se proporciona ninguno, se intentará descargar del almacenamiento. |
| `options`      | `Option<UploadOptions>` | Opciones para el proceso de subida. Mira UploadOptions arriba.                                     |

**Devuelve**

`Result<RDIndex, PipelineError>`

---

### `scan_directory(dir, ignore_patterns)`

Escanea el directorio recursivamente y crea un RDIndex, ignorando los archivos que coincidan con los patrones proporcionados.

**Parámetros**

| Nombre           | Tipo                  | Descripción                                                                     |
| ---------------- | --------------------- | ------------------------------------------------------------------------------- |
| `dir`            | `&Path`               | Directorio a escanear.                                                          |
| `ignorePatterns` | `Option<Vec<String>>` | Patrones a ignorar opcionales, estos patrones se ignorarán al crear el RDIndex. |

**Devuelve**

`Result<RDIndex, PipelineError>`

---

### `upload_missing_chunks(plan, base_dir, force, options)`

Sube solo los chunks que faltan o han sido actualizados definidos en el DeltaPlan.

**Parámetros**

| Nombre     | Tipo                    | Descripción                                                           |
| ---------- | ----------------------- | --------------------------------------------------------------------- |
| `plan`     | `&DeltaPlan`            | El plan delta indicando qué chunks faltan.                            |
| `base_dir` | `&Path`                 | El directorio base que contiene los archivos locales.                 |
| `force`    | `bool`                  | Si es true, forzará la sobreescritura de chunks en el almacenamiento. |
| `options`  | `Option<UploadOptions>` | Opciones para el proceso de subida. Mira UploadOptions arriba.        |

**Devuelve**

`Result<(), PipelineError>`

---

### `upload_index(index)`

Sube el archivo RDIndex al almacenamiento.

**Parámetros**

| Nombre  | Tipo       | Descripción                 |
| ------- | ---------- | --------------------------- |
| `index` | `&RDIndex` | El objeto rd-index a subir. |

**Devuelve**

`Result<(), PipelineError>`

---

### `delete_obsolete_chunks(plan, options)`

Elimina los chunks obsoletos del almacenamiento especificados por el plan delta.

**Parámetros**

| Nombre    | Tipo                    | Descripción                                                    |
| --------- | ----------------------- | -------------------------------------------------------------- |
| `plan`    | `&DeltaPlan`            | El plan delta que indica los chunks obsoletos.                 |
| `options` | `Option<UploadOptions>` | Opciones para el proceso de subida. Mira UploadOptions arriba. |

**Devuelve**

`Result<(), PipelineError>`

---

### `update_progress(value, phase, speed, options)`

Método que se usará internamente para llamar a la callback dada `on_progress` en opciones.

**Parámetros**

| Nombre    | Tipo                     | Descripción                                          |
| --------- | ------------------------ | ---------------------------------------------------- |
| `value`   | `f64`                    | Valor del progreso.                                  |
| `phase`   | `UploadPhase`            | Fase de subida actual (uploading o deleting).        |
| `speed`   | `Option<f64>`            | Velocidad en bytes/s para el proceso de subida.      |
| `options` | `Option<&UploadOptions>` | Opciones que debe incluir la callback `on_progress`. |

**Devuelve** `()`

---

### `change_state(state, options)`

Método que se usará internamente para llamar a la callback dada `on_state_change` en opciones.

**Parámetros**

| Nombre    | Tipo                     | Descripción                                              |
| --------- | ------------------------ | -------------------------------------------------------- |
| `state`   | `UploadState`            | Estado actual del progreso.                              |
| `options` | `Option<&UploadOptions>` | Opciones que debe incluir la callback `on_state_change`. |

**Devuelve** `()`

---

## Relacionado

- [UrlUploadPipeline](/docs/reference/Rust/pipelines/url-upload-pipeline)
- [RDIndex](/docs/reference/Rust/models/rdindex)

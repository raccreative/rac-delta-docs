---
title: UploadPipeline
description: Base abstract class responsible for managing the file upload flow.
sidebar_position: 1
---

# UploadPipeline

`UploadPipeline` is the base abstract class responsible for managing the file upload flow in rac-delta.
It provides the core structure for notifying progress, handling state changes, and coordinating uploads, but does not implement the actual storage logic.

This class is meant to be extended by specialized pipelines such as `HashUploadPipeline` and `UrlUploadPipeline`.

---

## Methods

Shared base methods.

| Method                                           | Returns | Description                                                |
| ------------------------------------------------ | ------- | ---------------------------------------------------------- |
| `updateProgress(value, state, speed?, options?)` | `void`  | Callback for progress such as uploading or deleting files. |
| `changeState(state, options?)`                   | `void`  | Callback to notify state changes.                          |

---

## UploadOptions

The `UploadOptions` object allows you to customize the behavior of an upload:

```ts
export interface UploadOptions {
  force?: boolean;
  requireRemoteIndex?: boolean;
  ignorePatterns?: string[];
  onProgress?: (type: 'upload' | 'deleting', progress: number, speed?: number) => void;
  onStateChange?: (state: UploadState) => void;
}
```

| Property             | Type                               | Description                                                                                                           |
| -------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `force`              | `boolean`                          | If true, forces complete upload even if remote index exists. If false, only new and modified chunks will be uploaded. |
| `requireRemoteIndex` | `boolean`                          | If true and no remote index found, abort upload. If false (default), uploads everything if no remote index found.     |
| `ignorePatterns`     | `string[]`                         | Files or directories that must be ignored when creating the rd-index.json.                                            |
| `onProgress`         | `(type, progress, speed?) => void` | Optional callback to inform progress.                                                                                 |
| `onStateChange`      | `(state) => void`                  | Optional callback for state changes.                                                                                  |

---

## UploadState

Type of state that can be returned with the `onStateChange` callback:

```ts
export type UploadState = 'uploading' | 'comparing' | 'cleaning' | 'finalizing' | 'scanning';
```

---

## Method details

### `updateProgress(value, state, speed?, options?)`

Used to call given `onProgress` callback inside `options`.

**Parameters**

| Name       | Type                 | Description                                                                            |
| ---------- | -------------------- | -------------------------------------------------------------------------------------- |
| `value`    | `number`             | Progress value (0 - 100)                                                               |
| `state`    | `upload \| deleting` | Which operation is being monitorized                                                   |
| `speed?`   | `number`             | Speed in bytes/s (only for state upload)                                               |
| `options?` | `UploadOptions`      | Options object, see UploadOptions above for more info (this method only uses callback) |

**Returns**

`void`

---

### `changeState(state, options?)`

Used to call given `onStateChange` callback inside `options`.

**Parameters**

| Name       | Type            | Description                                                                            |
| ---------- | --------------- | -------------------------------------------------------------------------------------- |
| `state`    | `UploadState`   | State of the flow, see UploadState above.                                              |
| `options?` | `UploadOptions` | Options object, see UploadOptions above for more info (this method only uses callback) |

**Returns**

`void`

---

## Related

- [HashUploadPipeline](/docs/reference/NodeJS/pipelines/hash-upload-pipeline)
- [UrlUploadPipeline](/docs/reference/NodeJS/pipelines/url-upload-pipeline)

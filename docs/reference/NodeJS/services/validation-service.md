---
title: ValidationService
description: Service for validating files and RDIndex objects.
sidebar_position: 2
---

# ValidationService

`ValidationService` validates files and RDIndex objects.  
Internally, it uses `HasherService` to verify file and chunk hashes.

---

## Methods

| Method                           | Returns            | Description                                      |
| -------------------------------- | ------------------ | ------------------------------------------------ |
| `validateFile(entry, path)`      | `Promise<boolean>` | Validates a single file against its `FileEntry`. |
| `validateIndex(index, basePath)` | `Promise<boolean>` | Validates all files described in an `RDIndex`.   |

---

## Method Details

### `validateFile(entry, path)`

Verifies a file.

**Parameters:**

| Name    | Type        | Description                      |
| ------- | ----------- | -------------------------------- |
| `entry` | `FileEntry` | Metadata of the file to validate |
| `path`  | `string`    | Path to the file on disk         |

**Returns:** `Promise<boolean>` – `true` if the file is valid.

**Notes:** Uses `HasherService` internally to verify the hash of the file and its chunks.

---

### `validateIndex(index, basePath)`

Verifies every file within a rd-index.json.

**Parameters:**

| Name       | Type      | Description                                 |
| ---------- | --------- | ------------------------------------------- |
| `index`    | `RDIndex` | RDIndex object describing files to validate |
| `basePath` | `string`  | Directory containing the files              |

**Returns:** `Promise<boolean>` – `true` if all files are valid.

**Notes:** Internally calls `validateFile` for each file using `HasherService`.

## Related

- [RDIndex](/reference/NodeJS/models/rdindex)
- [FileEntry](/reference/NodeJS/models/file-entry)
- [HasherService](/reference/NodeJS/services/hasher-service)

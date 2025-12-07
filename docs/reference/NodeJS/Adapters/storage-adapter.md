---
title: StorageAdapter
description: Abstract storage adapter.
sidebar_position: 1
---

# StorageAdapter

`StorageAdapter` defines the contract for any storage backend that stores chunks.

It has two extensions, `HashStorageAdapter` and `UrlStorageAdapter`.

---

## Properties

| Name   | Type              | Description                      |
| ------ | ----------------- | -------------------------------- |
| `type` | `"hash" \| "url"` | Identifies the adapter category. |

---

## Methods

| Method      | Returns         | Description                                   |
| ----------- | --------------- | --------------------------------------------- |
| `dispose()` | `Promise<void>` | Disposes the storage connection if supported. |

---

## Related

- [HashStorageAdapter](/docs/reference/NodeJS/adapters/hash-storage-adapter)
- [UrlStorageAdapter](/docs/reference/NodeJS/adapters/url-storage-adapter)

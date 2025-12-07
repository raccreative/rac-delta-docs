---
title: StorageAdapter
description: Adaptador de almacenamiento abstracto.
sidebar_position: 1
---

# StorageAdapter

`StorageAdapter` define el contrato para cualquier backend de almacenamiento que guarde chunks.

Tiene dos extensiones, `HashStorageAdapter` y `UrlStorageAdapter`.

---

## Propiedades

| Nombre | Tipo              | Descripción                            |
| ------ | ----------------- | -------------------------------------- |
| `type` | `"hash" \| "url"` | Identifica la categoría del adaptador. |

---

## Métodos

| Método      | Devuelve        | Descripción                                           |
| ----------- | --------------- | ----------------------------------------------------- |
| `dispose()` | `Promise<void>` | Deshecha la conexión de almacenamiento si se soporta. |

---

## Relacionado

- [HashStorageAdapter](/reference/NodeJS/adapters/hash-storage-adapter)
- [UrlStorageAdapter](/reference/NodeJS/adapters/url-storage-adapter)

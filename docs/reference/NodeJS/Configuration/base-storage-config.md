---
title: BaseStorageConfig
description: Base configuration of the storage configuration to use within the Node.js SDK.
sidebar_position: 2
---

# BaseStorageConfig

`BaseStorageConfig` represents the configuration that will be used per storage within the client usage, this class will be extended for concrete storage.  
It composes of an optional path prefix for the workspace.

Each instance is produced automatically when creating a new rac-delta client.

---

## Structure

```ts
export interface BaseStorageConfig {
  pathPrefix?: string;
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |pathPrefix|`string` |The optional path prefix that will be used for the storage workspace|

## Related

- [RacDeltaConfig](/reference/NodeJS/configuration/rac-delta-config)

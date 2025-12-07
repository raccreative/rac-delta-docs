---
title: LocalStorageConfig
description: Configuration to use local storage support with rac-delta client within the Node.js SDK.
sidebar_position: 3
---

# LocalStorageConfig

`LocalStorageConfig` represents the configuration that will be used if storage type is `local` within the client usage.  
It composes of base path.

Each instance is produced automatically when creating a new rac-delta client with local storage type.

---

## Structure

```ts
export interface LocalStorageConfig extends BaseStorageConfig {
  type: 'local';
  basePath: string;
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |type|`local` |Const string that identifies this configuration as local storage configuration.|
    |basePath|`string`|Base path where all operations of rac-delta storage must be done.|

## Related

- [RacDeltaConfig](/docs/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/NodeJS/configuration/base-storage-config)

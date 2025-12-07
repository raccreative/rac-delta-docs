---
title: URLStorageConfig
description: Configuration to use url storage support with rac-delta client within the Node.js SDK.
sidebar_position: 5
---

# URLStorageConfig

`URLStorageConfig` represents the configuration that will be used if storage type is `url` within the client usage.  
It does not have any configuration, as only needs plain urls to work provided by user.

Each instance is produced automatically when creating a new rac-delta client with url storage type.

---

## Structure

```ts
export interface URLStorageConfig extends BaseStorageConfig {
  type: 'url';
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |type|`url` |Const string that identifies this configuration as url storage configuration.|

## Related

- [RacDeltaConfig](/docs/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/NodeJS/configuration/base-storage-config)

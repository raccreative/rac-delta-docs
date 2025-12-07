---
title: HTTPStorageConfig
description: Configuration to use http storage support with rac-delta client within the Node.js SDK.
sidebar_position: 6
---

# HTTPStorageConfig

`HTTPStorageConfig` represents the configuration that will be used if storage type is `http` within the client usage.  
It composes of endpoint, optional index file path and credentials.

Each instance is produced automatically when creating a new rac-delta client with http storage type.

---

## Structure

```ts
export interface HTTPStorageConfig extends BaseStorageConfig {
  type: 'http';
  endpoint: string;
  indexFilePath?: string;
  credentials?: {
    bearerToken?: string;
    apiKey?: string;
  };
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |type|`http` |Const string that identifies this configuration as http storage configuration.|
    |endpoint|`string`|Base URL that will be used for all http operations.|
    |indexFilePath|`string`|Optional path (relative to `endpoint` and `pathPrefix`) where the remote index file can be found|
    |credentials|`Object`|Optional credentials object composed of bearer token and api key|

## Related

- [RacDeltaConfig](/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/NodeJS/configuration/base-storage-config)

---
title: AzureBlobStorageConfig
description: Configuration to use Azure Blob Storage support with rac-delta client within the Node.js SDK.
sidebar_position: 8
---

# AzureBlobStorageConfig

`AzureBlobStorageConfig` represents the configuration that will be used if storage type is `azure` within the client usage.  
It composes of container, endpoint and credentials.

Each instance is produced automatically when creating a new rac-delta client with azure storage type.

---

## Structure

```ts
export interface AzureBlobStorageConfig extends BaseStorageConfig {
  type: 'azure';
  container: string;
  endpoint: string;
  credentials: {
    accountName?: string;
    accountKey?: string;
    sasToken?: string;
  };
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |type|`azure`|Const string that identifies this configuration as azure storage configuration.|
    |container|`string`|Container name of the storage.|
    |endpoint|`string`|Endpoint to the Azure storage.|
    |credentials|`Object`|Credentials object composed of account name, account key and sas token.|

## Related

- [RacDeltaConfig](/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/NodeJS/configuration/base-storage-config)

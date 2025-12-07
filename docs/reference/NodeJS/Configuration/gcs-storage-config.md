---
title: GCSStorageConfig
description: Configuration to use Google Cloud Storage support with rac-delta client within the Node.js SDK.
sidebar_position: 7
---

# GCSStorageConfig

`GCSStorageConfig` represents the configuration that will be used if storage type is `gcs` within the client usage.  
It composes of bucket, api endpoint and credentials.

Each instance is produced automatically when creating a new rac-delta client with gcs storage type.

---

## Structure

```ts
export interface GCSStorageConfig extends BaseStorageConfig {
  type: 'gcs';
  bucket: string;
  apiEndpoint?: string;
  credentials: {
    projectId: string;
    clientEmail?: string;
    privateKey?: string;
  };
}
```

## Properties

    | Property    | Type      | Description                                                                   |
    | ----------- | --------- | ----------------------------------------------------------------------------- |
    | type        | `gcs`     | Const string that identifies this configuration as gcs storage configuration. |
    | bucket      | `string`  | Bucket name of the storage.                                                   |
    | apiEndpoint | `string`  | Optional endpoint to GCS api.                                                 |
    | credentials | `Object`  | Credentials object composed of project ID, client email and private key.      |

## Related

- [RacDeltaConfig](/docs/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/NodeJS/configuration/base-storage-config)

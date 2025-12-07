---
title: S3StorageConfig
description: Configuration to use S3 support with rac-delta client within the Node.js SDK.
sidebar_position: 9
---

# S3StorageConfig

`S3StorageConfig` represents the configuration that will be used if storage type is `s3` within the client usage.  
It composes of endpoint, region, bucket and credentials.

Each instance is produced automatically when creating a new rac-delta client with s3 storage type.

---

## Structure

```ts
export interface S3StorageConfig extends BaseStorageConfig {
  type: 's3';
  endpoint?: string;
  region?: string;
  bucket: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
    expiration?: Date;
  };
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |type|`s3`|Const string that identifies this configuration as s3 storage configuration.|
    |endpoint|`string`|Optional endpoint to the S3 storage.|
    |region|`string`|Optional region where the S3 is.|
    |bucket|`string`|The bucket name of the S3|
    |credentials|`Object`|Credentials object composed of access key id, secret access key, session token and expiration.|

## Related

- [RacDeltaConfig](/docs/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/NodeJS/configuration/base-storage-config)

---
title: S3StorageConfig
description: Configuration to use S3 support with rac-delta client within the Rust SDK.
sidebar_position: 9
---

# S3StorageConfig

`S3StorageConfig` represents the configuration that will be used if storage type is S3 within the client usage.  
It composes of endpoint, region, bucket and credentials.

Each instance is produced automatically when creating a new rac-delta client with s3 storage type.

---

## Structure

```rust
pub struct S3StorageConfig {
  pub base: BaseStorageConfig,
  pub bucket: String,
  pub endpoint: Option<String>,
  pub region: Option<String>,
  pub credentials: S3Credentials,
}

pub struct S3Credentials {
  pub access_key_id: String,
  pub secret_access_key: String,
  pub session_token: Option<String>,
  pub expiration: Option<u64>,
}
```

## Properties

| Property    | Type                | Description                                                                                    |
| ----------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| base        | `BaseStorageConfig` | Extended base configuration.                                                                   |
| bucket      | `String`            | The bucket name of the S3.                                                                     |
| endpoint    | `Option<String>`    | Optional endpoint to the S3 storage.                                                           |
| region      | `Option<String>`    | Optional region where the S3 is.                                                               |
| credentials | `S3Credentials`     | Credentials object composed of access key id, secret access key, session token and expiration. |

## Related

- [RacDeltaConfig](/docs/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/Rust/configuration/base-storage-config)

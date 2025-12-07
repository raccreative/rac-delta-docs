---
title: GCSStorageConfig
description: Configuration to use Google Cloud Storage support with rac-delta client within the Rust SDK.
sidebar_position: 7
---

# GCSStorageConfig

`GCSStorageConfig` represents the configuration that will be used if storage is GCS within the client usage.  
It composes of bucket, api endpoint and credentials.

Each instance is produced automatically when creating a new rac-delta client with gcs storage type.

---

## Structure

```rust
pub struct GCSStorageConfig {
  pub base: BaseStorageConfig,
  pub bucket: String,
  pub api_endpoint: Option<String>,
  pub credentials: GCSCredentials,
}

pub struct GCSCredentials {
  pub project_id: String,
  pub client_email: String,
  pub private_key: String,
}
```

## Properties

| Property     | Type                | Description                                                              |
| ------------ | ------------------- | ------------------------------------------------------------------------ |
| base         | `BaseStorageConfig` | Extended base configuration.                                             |
| bucket       | `String`            | Bucket name of the storage.                                              |
| api_endpoint | `Option<String>`    | Optional endpoint to GCS api.                                            |
| credentials  | `GCSCredentials`    | Credentials object composed of project ID, client email and private key. |

## Related

- [RacDeltaConfig](/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/Rust/configuration/base-storage-config)

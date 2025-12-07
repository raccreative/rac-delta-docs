---
title: HTTPStorageConfig
description: Configuration to use http storage support with rac-delta client within the Rust SDK.
sidebar_position: 6
---

# HTTPStorageConfig

`HTTPStorageConfig` represents the configuration that will be used if storage is HTTP within the client usage.  
It composes of endpoint, optional index file paht and credentials.

Each instance is produced automatically when creating a new rac-delta client with http storage type.

---

## Structure

```rust
pub struct HTTPStorageConfig {
  pub base: BaseStorageConfig,
  pub endpoint: String,
  pub index_file_path: Option<String>,
  pub credentials: Option<HTTPCredentials>,
}

pub struct HTTPCredentials {
  pub bearer_token: Option<String>,
  pub api_key: Option<String>,
}
```

## Properties

| Property        | Type                      | Description                                                                                        |
| --------------- | ------------------------- | -------------------------------------------------------------------------------------------------- |
| base            | `BaseStorageConfig`       | Extended base configuration.                                                                       |
| endpoint        | `String`                  | Base URL that will be used for all http operations.                                                |
| index_file_path | `Option<String>`          | Optional path (relative to `endpoint` and `path_prefix`) where the remote index file can be found. |
| credentials     | `Option<HTTPCredentials>` | Optional credentials object composed of bearer token and api key.                                  |

## Related

- [RacDeltaConfig](/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/Rust/configuration/base-storage-config)

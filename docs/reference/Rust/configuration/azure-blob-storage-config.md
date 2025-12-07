---
title: AzureBlobStorageConfig
description: Configuration to use Azure Blob Storage support with rac-delta client within the Rust SDK.
sidebar_position: 8
---

# AzureBlobStorageConfig

`AzureBlobStorageConfig` represents the configuration that will be used if storage type is Azure within the client usage.  
It composes of container, endpoint and credentials.

Each instance is produced automatically when creating a new rac-delta client with azure storage type.

User will need to provide Azure auth to configuration to work.

---

## Structure

```rust
pub struct AzureBlobStorageGenericConfig {
  pub base: BaseStorageConfig,
  pub container: String,
  pub endpoint: String,
  pub account_url: String,
  pub credential: Arc<dyn AzureStorageCredential>,
}

pub trait AzureStorageCredential: Any + Debug + Send + Sync {
  fn as_any(&self) -> &dyn Any;
}
```

## Properties

| Property    | Type                              | Description                                                   |
| ----------- | --------------------------------- | ------------------------------------------------------------- |
| base        | `BaseStorageConfig`               | Extended base configuration.                                  |
| container   | `String`                          | Container name of the storage.                                |
| endpoint    | `String`                          | Endpoint to the Azure storage.                                |
| account_url | `String`                          | Account url for auth.                                         |
| credential  | `Arc<dyn AzureStorageCredential>` | Credential to use, must implement azure auth TokenCredential. |

## Related

- [RacDeltaConfig](/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/Rust/configuration/base-storage-config)

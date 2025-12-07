---
title: RacDeltaConfig
description: Base configuration to use with rac-delta client within the Rust SDK.
sidebar_position: 1
---

# RacDeltaConfig

`RacDeltaConfig` represents the configuration that will be globally used within the client usage.  
It composes of chunk size, max concurrency and a concrete storage configuration.

Each instance is produced automatically when creating a new rac-delta client.

---

## Structure

```rust
pub enum StorageConfig {
  S3(S3StorageConfig),
  Azure(AzureBlobStorageGenericConfig),
  GCS(GCSStorageConfig),
  HTTP(HTTPStorageConfig),
  SSH(SSHStorageConfig),
  Local(LocalStorageConfig),
  URL(URLStorageConfig)
}

pub struct RacDeltaConfig {
  pub chunk_size: usize,
  pub max_concurrency: Option<usize>,
  pub storage: StorageConfig,
}
```

## Properties

| Property        | Type            | Description                                                                                     |
| --------------- | --------------- | ----------------------------------------------------------------------------------------------- |
| chunk_size      | `usize`         | The size in bytes that will be used to divide files and creation of chunks (recommended is 1MB) |
| max_concurrency | `Option<usize>` | Max number of concurrent tasks of the client for better performance.                            |
| storage         | `StorageConfig` | Concrete configuration of the selected storage type.                                            |

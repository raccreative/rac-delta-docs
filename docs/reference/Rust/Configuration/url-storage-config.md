---
title: URLStorageConfig
description: Configuration to use url storage support with rac-delta client within the Rust SDK.
sidebar_position: 5
---

# URLStorageConfig

`URLStorageConfig` represents the configuration that will be used if storage type is URL within the client usage.  
It does not have any configuration, as only needs plain urls to work provided by user.

Each instance is produced automatically when creating a new rac-delta client with url storage type.

---

## Structure

```rust
pub struct URLStorageConfig {
  pub base: BaseStorageConfig,
}
```

## Properties

| Property | Type                | Description                  |
| -------- | ------------------- | ---------------------------- |
| base     | `BaseStorageConfig` | Extended base configuration. |

## Related

- [RacDeltaConfig](/docs/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/Rust/configuration/base-storage-config)

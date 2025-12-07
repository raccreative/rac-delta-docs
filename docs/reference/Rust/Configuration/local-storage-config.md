---
title: LocalStorageConfig
description: Configuration to use local storage support with rac-delta client within the Rust SDK.
sidebar_position: 3
---

# LocalStorageConfig

`LocalStorageConfig` represents the configuration that will be used if storage type is `local` within the client usage.  
It composes of base path.

Each instance is produced automatically when creating a new rac-delta client with local storage type.

---

## Structure

```rust
pub struct LocalStorageConfig {
  pub base: BaseStorageConfig,
  pub base_path: PathBuf;
}
```

## Properties

| Property  | Type                | Description                                                       |
| --------- | ------------------- | ----------------------------------------------------------------- |
| base      | `BaseStorageConfig` | Base config extended.                                             |
| base_path | `PathBuf`           | Base path where all operations of rac-delta storage must be done. |

## Related

- [RacDeltaConfig](/docs/reference/Rust/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/Rust/configuration/base-storage-config)

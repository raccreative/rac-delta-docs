---
title: BaseStorageConfig
description: Base configuration of the storage configuration to use within the Rust SDK.
sidebar_position: 2
---

# BaseStorageConfig

`BaseStorageConfig` represents the configuration that will be used per storage within the client usage, this class will be extended for concrete storage.  
It composes of an optional path prefix for the workspace.

Each instance is produced automatically when creating a new rac-delta client.

---

## Structure

```rust
pub struct BaseStorageConfig {
  pub path_prefix: Option<String>,
}
```

## Properties

| Property    | Type             | Description                                                          |
| ----------- | ---------------- | -------------------------------------------------------------------- |
| path_prefix | `Option<String>` | The optional path prefix that will be used for the storage workspace |

## Related

- [RacDeltaConfig](/docs/reference/Rust/configuration/rac-delta-config)

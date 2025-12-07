---
title: RacDeltaConfig
description: Base configuration to use with rac-delta client within the Node.js SDK.
sidebar_position: 1
---

# RacDeltaConfig

`RacDeltaConfig` represents the configuration that will be globally used within the client usage.  
It composes of chunk size, max concurrency and a concrete storage configuration.

Each instance is produced automatically when creating a new rac-delta client.

---

## Structure

```ts
export type StorageConfig =
  | S3StorageConfig
  | AzureBlobStorageConfig
  | GCSStorageConfig
  | HTTPStorageConfig
  | SSHStorageConfig
  | LocalStorageConfig
  | URLStorageConfig;

export interface RacDeltaConfig {
  chunkSize: number;
  maxConcurrency?: number;
  storage: StorageConfig;
}
```

## Properties

| Property       | Type            | Description                                                                                     |
| -------------- | --------------- | ----------------------------------------------------------------------------------------------- |
| chunkSize      | `number`        | The size in bytes that will be used to divide files and creation of chunks (recommended is 1MB) |
| maxConcurrency | `number`        | Max number of concurrent tasks of the client for better performance.                            |
| storage        | `StorageConfig` | Concrete configuration of the selected storage type.                                            |

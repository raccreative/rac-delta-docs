---
title: SSHStorageConfig
description: Configuration to use ssh storage support with rac-delta client within the Node.js SDK.
sidebar_position: 4
---

# SSHStorageConfig

`SSHStorageConfig` represents the configuration that will be used if storage type is `ssh` within the client usage.  
It composes of host, port, and credentials.

Each instance is produced automatically when creating a new rac-delta client with ssh storage type.

---

## Structure

```ts
export interface SSHStorageConfig extends BaseStorageConfig {
  type: 'ssh';
  host: string;
  port?: number;
  credentials: {
    username: string;
    password?: string;
    privateKey?: string;
  };
}
```

## Properties

    |Property            |Type                           |Description                  |
    |----------------|-------------------------------|-----------------------------|
    |type|`ssh` |Const string that identifies this configuration as ssh storage configuration.|
    |host|`string`|Host to connect to ssh.|
    |port|`number`|Optional port to connect to ssh, default is `22`|
    |credentials|`Object`|Credentials to connect to ssh host, username, password and optional private key|

## Related

- [RacDeltaConfig](/docs/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/docs/reference/NodeJS/configuration/base-storage-config)

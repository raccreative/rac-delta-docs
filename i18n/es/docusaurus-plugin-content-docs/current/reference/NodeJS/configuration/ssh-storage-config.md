---
title: SSHStorageConfig
description: Configuración para usar el almacenamiento ssh en el cliente rac-delta en el SDK de Node.js.
sidebar_position: 4
---

# SSHStorageConfig

`SSHStorageConfig` representa la cofiguración que se usará si el tipo de almacenamiento es `ssh` en el cliente.
Se compone de host, puerto y credenciales.

Cada instancia se genera automáticamente al crear un nuevo cliente rac-delta con el tipo de almacenamiento ssh.

---

## Estructura

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

## Propiedades

| Propiedad   | Tipo     | Descripción                                                                                           |
| ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| type        | `ssh`    | String constante que identifica esta configuración como ssh.                                          |
| host        | `string` | Host para conectar al ssh.                                                                            |
| port        | `number` | Puerto opcional para conectarse al ssh, por defecto es `22`.                                          |
| credentials | `Object` | Credenciales para conectarse al host ssh, nombre de usuario, contraseña y una key privada opcionales. |

## Relacionado

- [RacDeltaConfig](/reference/NodeJS/configuration/rac-delta-config)
- [BaseStorageConfig](/reference/NodeJS/configuration/base-storage-config)

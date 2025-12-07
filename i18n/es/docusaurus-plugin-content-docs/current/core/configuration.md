---
sidebar_position: 3
---

# Configuración

Para poder conseguir un correcto funcionamiento de la implementación de rac-delta, las propiedades de configuración son importantes.

La configuración se usará para la creación del cliente rac-delta, la comunicación con el almacenamiento, y la configuración opcional de los servicios. Esto hará que el SDK sea más fácil de usar y más personalizable.

**NOTA**: Las interfaces aquí están escritas en TS, pero son sencillas de migrar a otro lenguaje.

## Configuración base

Configuración base mínima:

```js
interface RacDeltaConfig {
  chunkSize: number;
  maxConcurrency?: number;
  storage: StorageConfig;
}
```

- `chunkSize` será el valor usado en todas las operaciones de rac-delta para los chunks, es importante mantener consistencia con este valor, cualquier cambio entre operaciones llevará a errores.

- `maxConcurrency` se usa solo como un límite de concurrencia máximo recomendado para las operaciones como lectura, escritura o subida. Para mejor rendimiento.

- `storage`: Configuración concreta de tu almacenamiento, más información abajo.

## Configuración de almacenamiento

No es obligatorio implementar todos los almacenamientos, pero se recomienda ya que la filosofía de rac-delta es que sea agnóstico al almacenamiento, así que estar preparado para cualquier backend siempre es recomendado.

Aquí están nuestras interfaces de configuración de almacenamiento.

```js
interface BaseStorageConfig {
  pathPrefix?: string;
}
```

La configuración base que todos los almacenamientos extenderán. Incluye un `pathPrefix` si el directorio deseado está en una subcarpeta.

### Almacenamiento local

Perfecto para testing o para tener almacenamiento local, pero no se recomienda para casos de la vida real.

```js
interface LocalStorageConfig extends BaseStorageConfig {
  type: 'local';
  basePath: string;
}
```

## Almacenamiento SSH

Perfecto para almacenamiento en la misma red o almacenamiento privado.

```js
interface SSHStorageConfig extends BaseStorageConfig {
  type: 'ssh';
  host: string;
  port?: number;
  credentials: {
    username: string,
    password?: string,
    privateKey?: string,
  };
}
```

## Almacenamiento URL

Perfecto para URLs firmadas.

```js
interface URLStorageConfig extends BaseStorageConfig {
  type: 'url';
}
```

Este tipo de almacenamiento no necesita ninguna configuración, pero necesita su propio tipo de StorageAdapter y su propio tipo de Pipeline, ya que los nombres de métodos son diferentes de los almacenamientos normales.
Ejemplo: `uploadChunksByUrl()`

Cómo llamar a las URLs es cosa del usuario, puedes usar cualquier librería o métodos nativos para hacer llamadas HTTP.

Echa un ojo a [pipelines](/core/pipelines) y [adaptadores](/core/adapters)

## Almacenamiento HTTP

Perfecto para APIs personalizadas, este tipo da por hecho que tienes una API conectada a tu almacenamiento mediante endpoints como /chunks/[hash] o GET /rd-index

```js
interface HTTPStorageConfig extends BaseStorageConfig {
  type: 'http';
  endpoint: string;
  indexFilePath?: string;
  credentials?: {
    bearerToken?: string,
    apiKey?: string,
  };
}
```

- `endpoint`: URL base para todas las operaciones de chunks. Cada chunk se accedería como: `{endpoint}/{pathPrefix?}/{chunk-hash}`

  Ejemplo:

  ```js
  endpoint: "https://ducks.com/api"
  pathPrefix: "uploads"

  => https://ducks.com/api/uploads/{chunk-hash}
  ```

- `indexFilePath`: Ruta opcional (relativa a `endpoint` y `pathPrefix`) donde el índice remoto (`rd-index.json`) se puede encontrar.

  Si se omite, el adaptador buscará automáticamente en:

  ```js
  {endpoint}/{pathPrefix?}/rd-index.json
  ```

  Ejemplo:

  ```js
  indexFilePath: "index"
  => https://ducks.com/api/index
  indexFilePath: "metadata/rd-index.json"
  => https://ducks.com/api/metadata/rd-index.json
  ```

- `credentials`: Credenciales opcionales usadas para las peticiones HTTP autenticadas. Soporta tanto Bearer tokens como API keys. El adaptador debe incluir estos headers.

  Ejemplo:

  ```js
  credentials: {
    bearerToken: "eyJhbGciOiJIUzI1...",
    apiKey: "my-secret-key"
  }
  ```

## Google Cloud Storage

Configuración para soporte GCS:

```js
interface GCSStorageConfig extends BaseStorageConfig {
  type: 'gcs';
  bucket: string;
  apiEndpoint?: string;
  credentials: {
    projectId: string,
    clientEmail?: string,
    privateKey?: string,
  };
}
```

## Azure Blob Storage

Configuración para soporte de Azure Blob:

```js
interface AzureBlobStorageConfig extends BaseStorageConfig {
  type: 'azure';
  container: string;
  endpoint: string;
  credentials: {
    accountName?: string,
    accountKey?: string,
    sasToken?: string,
  };
}
```

## Almacenamiento S3

Configuración para soporte S3:

```js
interface S3StorageConfig extends BaseStorageConfig {
  type: 's3';
  endpoint?: string;
  region?: string;
  bucket: string;
  credentials: {
    accessKeyId: string,
    secretAccessKey: string,
    sessionToken?: string,
    expiration?: Date,
  };
}
```

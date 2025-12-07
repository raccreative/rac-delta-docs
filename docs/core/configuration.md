---
sidebar_position: 3
---

# Configuration

In order to achieve a proper working rac-delta implementation, configuration properties are important.

Configuration will be used for the creation of the rac-delta client, the storage communication, and services optional configuration. This will make the SDK easier to use and more customizable.

**NOTE**: Interfaces here are written in TS, but easy to migrate to another language.

## Base Configuration

Minimal base configuration:

```js
interface RacDeltaConfig {
  chunkSize: number;
  maxConcurrency?: number;
  storage: StorageConfig;
}
```

- `chunkSize` will be the value used in all operations of rac-delta for the chunks, it is important to maintain consistency with this value, any changes between operations will lead to errors.

- `maxConcurrency` is only used as a recommended max concurrency limit for operations like reading, writting or uploading. For better performance.

- `storage`: Concrete configuration for your storage, see below.

## Storage Configuration

It is not mandatory to implement all storages, but it is recommended as our philosophy for rac-delta is storage agnosticism, so being prepared for every kind of storage is always recommended.

Here are our configuration interfaces for storage.

```js
interface BaseStorageConfig {
  pathPrefix?: string;
}
```

The base configuration that all storages will extend. It includes a `pathPrefix` if your desired directory is within a subfolder.

### Local Storage

Perfect for testing or to have local storage, but not recommended for real life cases.

```js
interface LocalStorageConfig extends BaseStorageConfig {
  type: 'local';
  basePath: string;
}
```

## SSH Storage

Perfect for same network storage and private storage.

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

## URL Storage

Perfect for signed URLS.

```js
interface URLStorageConfig extends BaseStorageConfig {
  type: 'url';
}
```

This storage type does not need any configuration, but needs its own StorageAdapter type and its own Pipeline type, as method names are different from normal storages.
Example: `uploadChunksByUrl()`

How to call URLs is up to the user, you can use any library or native methods to make HTTP calls.

See [pipelines](/core/pipelines) and [adapters](/core/storage-adapter)

## HTTP Storage

Perfect for custom APIs, this type takes for granted that you have an API connected to your storage with endpoints like /chunks/[hash] or GET /rd-index

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

- `endpoint`: Base URL used for all chunk operations. Each chunk will be accessed as: `{endpoint}/{pathPrefix?}/{chunk-hash}`

  Example:

  ```js
  endpoint: "https://ducks.com/api"
  pathPrefix: "uploads"

  => https://ducks.com/api/uploads/{chunk-hash}
  ```

- `indexFilePath`: Optional path (relative to `endpoint` and `pathPrefix`) where the remote index file (`rd-index.json`) can be found.

  If omitted, the adapter will automatically look for:

  ```js
  {endpoint}/{pathPrefix?}/rd-index.json
  ```

  Example:

  ```js
  indexFilePath: "index"
  => https://ducks.com/api/index
  indexFilePath: "metadata/rd-index.json"
  => https://ducks.com/api/metadata/rd-index.json
  ```

- `credentials`: Optional credentials used for authenticated HTTP requests. Supports both Bearer tokens and API keys. Adapter must include these headers.

  Example:

  ```js
  credentials: {
    bearerToken: "eyJhbGciOiJIUzI1...",
    apiKey: "my-secret-key"
  }
  ```

## Google Cloud Storage

Configuration for GCS support:

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

Configuration for Azure Blob support:

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

## S3 Storage

Configuration for S3 support:

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

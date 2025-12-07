---
sidebar_position: 3
---

# Synchronization Process

In order to synchronize files for upload or download, the protocol describes how it should be done for a better workflow.

## Upload

The steps to sync for upload using rac-delta are redacted here:

### 1. Generate local rd-index

First of all, we should generate the local index of the directory we want to upload and sync with a remote storage. This process can be done using an own delta-service (see core), or using available SDKs delta-service or upload pipeline.

To generate a local rd-index.json simply iterate your directory using file-system and slice files using a chunk size (recommended 1MB), then hash each chunk and create
the [rd-index.json](/protocol/rd-index.json) file.

The recommended hashing algorithm for rac-delta is Blake3.

We also recommend generating the rd-index.json under concurrency, the rac-delta SDKs implement customizable chunk sizes and concurrency limits. In addition, the SDK also implements streaming support for rd-index generation.

### 2. Retrieve remote rd-index

In order to compare indexes, you will need to provide a remote rd-index.json, either manually or using the storage adapter for your storage provider (S3, Azure, GCS...)

If no remote rd-index is provided, everything will be uploaded.

### 3. Comparing rd-index files

Comparing both local rd-index with remote rd-index will result in a Delta Plan, an object that will look like:

```ts
DeltaPlan {
  newAndModifiedFiles: FileEntry[];
  deletedFiles: string[];
  missingChunks: ChunkEntry[];
  obsoleteChunks: ChunkEntry[];
}
```

- **newAndModifiedFiles**: List of files that are new or have been modified, each file is an object that includes the relative path of the file, its hash and a list of its chunks.
- **deletedFiles**: List of the relative paths of files that no longer exists on the target directory and will be deleted.
- **missingChunks**: List of chunks that are new and will be uploaded or downloaded, it includes the parent file and its hash.
- **obsoleteChunks**: List of chunks that no longer are part of existing files. Normally, these chunks are already replaced with new chunks, but they should be verified to avoid file corruption.

With this information, you are ready to go to upload new chunks.

### 4. Upload new chunks

Now simply upload the chunks using the Delta Plan information, this step will be usually done using your preferred storage adapter for your storage (S3, Azure, SSH...).

### 5. Cleaning remote obsolete chunks and files

After uploading chunks, you must ensure that obsolete files and chunks are deleted from the remote directory, usually using your storage adapter.

**Note:** Some chunks could be used in different files, so it is important not to mark them as obsolete if they are used in different files, as storage should only save chunks with deduplication.

### 6. Upload the new rd-index.json

After everything is done, the last step is uploading the new generated rd-index.json to the remote directory, so the index is updated for future operations.

## Download

The steps to sync for download using rac-delta are redacted here:

### 1. Local rd-index.json

For downloads, you can generate a new rd-index.json from your directory, or provide an existing one. rd-index.json will be left inside the directory after the download, so if nothing was changed, you can use it, however, it is recommended to generate a new one to ensure everything is up to date.

If no local rd-index.json is provided, everything will be downloaded.

### 2. Remote rd-index.json

A remote rd-index.json must be provided, as it is the source of the chunks to download. You can provide it manually or download it using your storage adapter.

### 3. Comparing indexes

Compare the two rd-index.json to generate a Delta Plan, see [Comparing rd-index files](#3-comparing-rd-index-files) above.

### 4. Downloading chunks and reconstructing files

The protocol does not force a method for downloading and reconstructing, but we have 3 recommended strategies that are implemented on the available SDKs.

- **Download all chunks first to memory**: This strategy will download first all chunks to memory, and will reconstruct files later. This option is better for slow network speeds and for small directories, will reconstruct faster and concurrency is recommended.
- **Download all chunks first to disk**: This strategy is similar to the memory one, but it downloads all to disk, this option is better for low memory machines, but will require more temporal disk space.
- **Stream chunks and reconstruct**: This strategy will reconstruct while chunks are being downloaded via streaming, this is the recommended option as won't use memory or disk, but could lead to more band width use and could need more CPU usage.

After that, we recommend that users verify the final file using the hash to make sure reconstruction has been succesful.

### 5. Cleaning obsolete files or chunks

After new chunks have been downloaded and reconstructed, we have to make sure that obsolete files are deleted, and obsolete chunks are no longer present on our build to avoid file corruption. You can easily verify file integration with the available SDKs.

### 6. Replacing local rd-index.json

The last step is saving the new rd-index.json to your local directory for future operations.

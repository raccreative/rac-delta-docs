---
sidebar_position: 1
---

# Storage Structure

The protocol does not enforce a strict folder hierarchy. Users can freely organize their builds. However, there is a default recommended structure used in Rust and JavaScript implementations.

```text
/dir/
 ├── chunks/
 │    ├── 0a/0a1b2c3d4e5f6...
 │    ├── 1b/1b4d6e7f8a9b0...
 │    └── ...
 ├── rdindex.json
```

The protocol only needs chunks to work, there is no need for full reconstructed files to work, but if you need chunks and files, you can implement a way for your storage to automatically reconstruct files each time an update is performed (example: AWS Lambda function).

Having only chunks result in a more efficient storage, as chunks that share same information will be reused (two chunks with same hash will only be stored once), reducing the total size of the directory.

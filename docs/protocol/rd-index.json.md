---
sidebar_position: 2
---

# rd-index.json

Central protocol file. Defines all files, their structure, metadata, and the chunks that comprise them.

Two rd-index.json will be compared to generate a Delta Plan, an object that includes which chunks will be uploaded or downloaded.

**Example**:

```json
{
  "version": "1.0",
  "chunk_size": 1048576,
  "created_at": 1762876497106,
  "files": [
    {
      "path": "bin/game.exe",
      "size": 43127654,
      "hash": "8af4c2...",
      "modified_at": 1762876497106,
      "chunks": [
        { "hash": "5af3c9...", "offset": 0, "size": 1048576 },
        { "hash": "a9b12e...", "offset": 1048576, "size": 1048576 }
        //...
      ]
    },
    {
      "path": "data/texture.png",
      "size": 267431,
      "hash": "4bf3d5...",
      "modified_at": 1762876497106,
      "chunks": [{ "hash": "b63ff9...", "offset": 0, "size": 267431 }]
    }
  ]
}
```

## Fields

- **version**: The current version of the protocol (1.0 for now)
- **chunk_size**: The chunk size used to generate this index. The recommended size is 1MB.
- **created_at**: When the index was created.
- **files**: An array of all the files included in the index:
  - **path**: Path of the file, relative to rd-index.json.
  - **size**: Size in bytes of the file.
  - **hash**: The hash of the file.
  - **modified_at**: When the file was modified for last time.
  - **chunks**: An array of all the chunks that makes up the file using the chunk size:
    - **hash**: The hash of the chunk (the hash is also the id of the chunk).
    - **offset**: The offset of the chunk in the file.
    - **size**: The size of the chunk in bytes.

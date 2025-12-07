---
sidebar_position: 2
---

# rd-index.json

El archivo central del protocolo. Define todos los archivos, su estructura, metadatos y los chunks que lo componen.

Dos rd-index.json se compararán para generar un Delta Plan, un objeto que incluye qué chunks serán descargados o subidos.

**Ejemplo**:

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

## Campos

- **version**: La versión actual del protocolo (1.0 por ahora)
- **chunk_size**: El tamaño de chunk usado para generar el índice. El tamaño recomendado es 1MB.
- **created_at**: Cuándo el índice fue creado.
- **files**: Un array de todos los archivos incluidos en el índice:
  - **path**: Ruta del archivo, relativo a la ruta del rd-index.json.
  - **size**: Tamaño en bytes del archivo.
  - **hash**: El hash del archivo.
  - **modified_at**: Cuándo el archivo fue modificado por última vez.
  - **chunks**: Un array de todos los chunks que componen el archivo usando el tamaño de chunk del índice:
    - **hash**: El hash del chunk (el hash es también el identificador del chunk).
    - **offset**: El offset del chunk en el archivo.
    - **size**: El tamaño del chunk en bytes.

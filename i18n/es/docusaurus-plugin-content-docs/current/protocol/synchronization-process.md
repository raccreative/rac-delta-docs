---
sidebar_position: 3
---

# Proceso de sincronización

Para poder sincronizar archivos para subir o descargar, el protocolo describe cómo debería hacerse para un mejor flujo de trabajo.

## Subida

Los pasos para sincronizar una subida usando rac-delta están redactados aquí:

### 1. Generar el rd-index local

Lo primero de todo, debemos generar el índice local del directorio que queremos subir y sincronizar con el almacenamiento remoto. Este proceso se puede hacer usando un servicio delta propio (echa un ojo a core), o usando los SDKs disponibles con su servicio delta y su pipeline de subida.

Para generar un rd-index.json local, simplemente itera sobre tu directorio usando el sistema de archivos y divide los archivos usando un tamaño de chunk (se recomienda 1MB), entonces calcula el hash de cada chunk y crea el archivo [rd-index.json](/docs/protocol/rd-index.json).

El algoritmo de hash recomendado para rac-delta es Blake3.

También recomendamos generar el rd-index.json con concurrencia, los SDKs de rac-delta implementan tamaños de chunk y límites de concurrencia personalizados. Además, los SDKs también implementan soporte para streaming para la generación del rd-index.

### 2. Conseguir el rd-index remoto

Para poder comparar índices, necesitas proporcionar el rd-index.json remoto, ya sea manualmente o usando el adaptador de almacenamiento de tu proveedor (S3, Azure, GCS...)

Si no se proporciona ningún rd-index remoto, todo se subirá.

### 3. Comparando archivos rd-index

Comparar el índice local con el remoto dará como resultado un Delta Plan, un objecto que lucirá como:

```ts
DeltaPlan {
  newAndModifiedFiles: FileEntry[];
  deletedFiles: string[];
  missingChunks: ChunkEntry[];
  obsoleteChunks: ChunkEntry[];
}
```

- **newAndModifiedFiles**: Lista de los archivos que son nuevos o se han modificado, cada archivo es un objeto que incluye la ruta relativa del archivo, su hash y su lista de chunks.
- **deletedFiles**: Lista de las rutas relativas de los archivos que ya no existen en el directorio objetivo y serán eliminados.
- **missingChunks**: Lista de los chunks nuevos que serán subidos o descargados, incluye el archivo padre y su hash.
- **obsoleteChunks**: Lista de chunks que ya no forman parte de archivos existentes. Normalmente estos chunks ya se reemplazan con chunks nuevos, pero deben ser verificados para evitar corrupción.

Con esta información, estás listo para subir nuevos chunks.

### 4. Subir nuevos chunks

Ahora simplemente sube los chunks usando la información del Delta Plan, este paso se hará usando tu adaptador de almacenamiento elegido (S3, Azure, SSH...).

### 5. Limpiar los chunks y archivos remotos obsoletos

Tras subir los chunks, debes asegurarte de que los archivos y chunks obsoletos se han eliminado del directorio remoto, normalmente usando el mismo adaptador de almacenamiento.

**Nota:** Algunos chunks pueden ser usados en distintos archivos, así que es importante no marcarlos como obsoletos si se usan en otros archivos, ya que el almacenamiento debería solo guardar chunks con deduplicación.

### 6. Subir el nuevo rd-index.json

Después de que todo esté terminado, el último paso es subir el nuevo rd-index.json generado al directorio remoto, para que el índice esté actualizado de cara a futuras operaciones.

## Descarga

Los pasos para sincronizar una descarga usando rad-delta se redactan aquí:

### 1. rd-index. local

Para las descargas, puedes generar un nuevo rd-index.json desde tu directorio, o proporcionar uno existente. El rd-index.json se dejará dentro del directorio tras la descarga, así que si nada ha cambiado puedes usarlo, sin embargo, se recomienda generar siempre uno nuevo para asegurar que todo está registrado.

Si no se proporciona un rd-index.json local, todo será descargado.

### 2. rd-index.json remoto

Un rd-index.json remoto debe ser proporcionado, ya que es la fuente de los chunks a descargar. Puedes proporcionar uno manualmente o descargarlo usando tu adaptador de almacenamiento.

### 3. Comparar índices

Compara los dos rd-index.json para generar un Delta Plan, echa un ojo a [Comparar archivos rd-index](#3-comparing-rd-index-files) arriba.

### 4. Descargar chunks y reconstruir archivos

El protocolo no fuerza a un método de descarga y reconstrucción, pero tenemos 3 estrategias recomendadas que se implementan en los SDKs disponibles.

- **Descargar todos los chunks primero en memoria**: Esta estrategia descargará primero todos los chunks en memoria, y reconstruirá los archivos después. Esta opción es mejor para redes lentas y pequeños directorios, reconstruirá más rápido y la concurrencia es recomendable.
- **Descargar todos los chunks primero en disco**: Esta estrategia es similar a la de la memoria, pero lo descarga todo a disco, esta opción es mejor para máquinas con poca memoria, pero requiere más espacio temporal en disco.
- **Streaming de chunks y reconstrucción**: Esta estrategia reconstruirá los archivos mientras se descargan los chunks vía streaming, esta es la opción recomendada ya que no usará memoria ni disco, pero puede consumir más ancho de banda y necesitar más uso de CPU.

Tras eso, recomendamos que los usuarios verifiquen el archivo final usando el hash para asegurarse de que la reconstrucción ha salido bien.

### 5. Limpiar archivos o chunks obsoletos

Después de que los nuevos chunks hayan sido descargados y reconstruidos, tenemos que asegurarnos de que los archivos obsoletos se han eliminado, y los chunks obsoletos ya no están presentes en nuestra build para evitar corrupción de archivos. Puedes verificar la integridad del archivo fácilmente con los SDKs disponibles.

### 6. Reemplazar el rd-index.json local

El último paso es guardar el nuevo rd-index.json en tu directorio local para futuras operaciones.

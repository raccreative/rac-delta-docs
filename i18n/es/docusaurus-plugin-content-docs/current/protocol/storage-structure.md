---
sidebar_position: 1
---

# Estructura de almacenamiento

El protocolo no fuerza una jerarquía estricta de carpetas. Los usuarios pueden organizar libremente sus builds. Sin embargo, hay una estructura recomendada por defecto usada en las implementaciones de Rust y NodeJs.

```text
/dir/
 ├── chunks/
 │    ├── 0a/0a1b2c3d4e5f6...
 │    ├── 1b/1b4d6e7f8a9b0...
 │    └── ...
 ├── rdindex.json
```

El protocolo solo necesita chunks para funcionar, no hay necesidad de guardar archivos completos para el funcionamiento, pero si necesitas chunks y archivos, puedes implementar tu propio método para reconstruir archivos automáticamente cada vez que se ejecuta una actualización (por ejemplo: AWS función Lambda).

Tener solo chunks da como resultado un almacenamiento más eficiente, ya que los chunks que comparten información se reusan (dos chunks con el mismo hash solo se almacena una vez), reduciendo el tamaño total del directorio.

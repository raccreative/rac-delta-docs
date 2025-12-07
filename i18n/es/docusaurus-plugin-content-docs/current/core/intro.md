---
sidebar_position: 1
---

# Introducción

Para poder crear una nueva implementación de rac-delta, se recomienda seguir las features core de rac-delta y sus interfaces, para mantener coherencia y funcionalidad con los SDKs disponibles.

Junto con el core, debes seguir el protocolo para que la implementación sea válida.

El core se compone de:

- **Interfaces**: Modelos e interfaces relacionadas con el protocolo rac-delta.
- **Config**: Parámetros de configuración necesarias para que el SDK implemente correctamente el protocolo.
- **Services**: Interfaces de servicios necesarias y cómo interactúan entre ellas para la correcta implementación de rac-delta.
- **Adapters**: Adaptador de almacenamiento que actuará como interfaz abstracta para la implementación de almacenamiento como S3, Azure Blob, SSH...
- **Pipelines**: Las pipelines que juntan todo, servicios, configuración y adaptadores para crear una forma sencilla de subir o descargar actualizaciones usando rac-delta.

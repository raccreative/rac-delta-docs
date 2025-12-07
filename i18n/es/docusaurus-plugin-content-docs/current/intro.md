---
sidebar_position: 1
slug: /
---

# Introducción

rac-delta es un protocolo diferencial universal diseñado para sincronizar y distribuir builds (como juegos, aplicaciones o directorios) de manera eficiente y **agnóstica al tipo de almacenamiento**.
Permite detectar y transferir únicamente los chunks modificados de los archivos, reduciendo consumo de ancho de banda, tiempos de carga y operaciones en disco.

## Beneficios de usar rac-delta

- **Agnóstico al backend**: no depende de un servicio concreto (S3, Azure, SSH, URLs firmadas, etc.).
- **Modular**: casi cualquier almacenamiento remoto puede utilizarse mediante adaptadores.
- **Sencillo**: un único archivo índice (rdindex.json) centraliza toda la información.
- **Eficiente**: admite streaming, concurrencia y utiliza **Blake3** para un hashing rápido
- **Flexible**: altamente personalizable; tamaño de chunks, límites de concurrencia, estrategias de reconstrucción…

## Filosofía

rac-delta es un **protocolo abierto**, cualquiera puede crear sus propias implementaciones utilizando la sección principal como guía.
Existen implementaciones en **JavaScript** y **Rust**, también de código abierto, que son la forma recomendada para usar rac-delta en esos lenguajes.

## Por qué se llama rac-delta

rac-delta fue creado para **Raccreative Games** (una plataforma de videojuegos indie). Surgió por la necesidad de implementar subidas y descargas diferenciales. Esto llevó al desarrollo de rac-delta y se decidió que sería positivo compartirlo con la comunidad para que cualquiera pudiera usarlo.

**Resumen rápido**: rac viene de raccoon, (¡mapache!), la mascota oficial de Raccreative Games.

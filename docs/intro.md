---
sidebar_position: 1
slug: /
---

# Intro

rac-delta is an universal differential protocol designed to sync and distribute builds (like games, apps or directories) efficiently and **storage agnostic**.
It allows to detect and transfer only modified file fragments, minimizing band width, load times and disk operations.

## Benefits of using rac-delta

- **Backend agnostic**: it does not depend on a concrete service (S3, Azure, SSH, signed URLs, etc.)
- **Modular**: almost any remote storage can be used via adapters
- **Simple**: an unique index archive (rdindex.json) centralices all information.
- **Efficiency**: supports streaming, concurrency, and uses **Blake3** for fast hashing.
- **Flexibility**: highly customizable, chunk size, concurrency limits, reconstruction strategies...

## Philosophy

rac-delta is an **open protocol**, anyone can make their own implementations of the protocol using the core section as a guide.
In any case, there exist **JavaScript** and **Rust** implementations that are also open source and the recommended way to use rac-delta for those languages.

## Why is it called rac-delta

rac-delta was created for **Raccreative Games** (an indie games platform), it was a need for the platform as differential uploads and downloads were about to be implemented. This led to the creation of rac-delta and we thought it would be good for the community to create something everyone could use.

**TL;DR**: rac is for raccoon! The official Raccreative Games mascot.

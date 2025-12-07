---
sidebar_position: 1
---

# Introduction

In order to create a new rac-delta implementation, it is recommended to follow rac-delta core features and interfaces, to maintain coherence and functionallity with every SDK available.

Along with the core, you must follow the protocol to make it a valid implementation.

The core is composed of:

- **Interfaces**: Models and interfaces related to rac-delta protocol
- **Config**: Configuration parameters needed for the SDK to correctly implements the protocol.
- **Services**: Required service interfaces and how they interact with each other for the correct implementation of rac-delta.
- **Adapters**: Storage adapter that will act as abstract interface for storage implementations like S3, Azure Blob, SSH...
- **Pipelines**: The pipelines that glues everything, services, config and adapters to create an easy way to upload or download updates using rac-delta.

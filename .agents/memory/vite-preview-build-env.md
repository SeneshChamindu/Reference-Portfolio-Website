---
name: Vite preview build environment
description: Environment requirement for manually building artifact previews outside their managed workflow.
---

Artifact preview builds may require both `PORT` and `BASE_PATH` environment values even when the managed workflow supplies them automatically.

**Why:** The preview config validates its routing and port inputs during Vite config loading, so a plain package build can fail before transforming source files.

**How to apply:** When verifying a design-system or routed web artifact manually, run its build with the workflow's port and the artifact preview base path.
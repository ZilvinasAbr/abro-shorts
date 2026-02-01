# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev         # Start development with hot reload
pnpm build       # Type-check and build for production
pnpm lint        # Run ESLint
pnpm format      # Run Prettier
pnpm typecheck   # Run TypeScript type-checking only
```

Platform-specific builds:
```bash
pnpm build:mac   # Build for macOS
pnpm build:win   # Build for Windows
pnpm build:linux # Build for Linux
```

## Architecture

This is an Electron desktop application using React, TypeScript, and electron-vite.

### Process Structure

Electron apps have three distinct process contexts:

- **Main process** (`src/main/`) - Node.js environment, manages app lifecycle, creates windows, handles native OS features
- **Preload scripts** (`src/preload/`) - Bridge between main and renderer, exposes safe APIs via `contextBridge`
- **Renderer process** (`src/renderer/`) - Browser environment, React UI

### Path Alias

Use `@renderer/*` to import from `src/renderer/src/*` in renderer code.

### TypeScript Configuration

Two separate tsconfig files:
- `tsconfig.node.json` - For main process and preload (Node.js target)
- `tsconfig.web.json` - For renderer process (browser target)

### IPC Communication

Main process exposes APIs to renderer through preload scripts using `contextBridge.exposeInMainWorld()`. The renderer accesses these via `window.electron` and `window.api`.

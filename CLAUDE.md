# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev         # Start development with hot reload
pnpm build       # Type-check and build for production
pnpm check       # Run Biome (format, lint, organize imports)
pnpm lint        # Run Biome linter only
pnpm format      # Run Biome formatter only
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

## Git Workflow

### Committing Changes

Pre-commit hooks automatically run Biome and TypeScript type-checking.

When working on tasks, commit incremental changes that make logical sense:

- Commit after completing a distinct, working unit of functionality
- Each commit should leave the codebase in a valid state
- Write clear commit messages describing what changed and why
- Prefer smaller, focused commits over large monolithic ones
- Do not include "Co-authored-by" or any similar comment in the commit message or PR description.

**Commit message format** (enforced by commitlint):

```
<type>: <subject>
```

- **Type** (lowercase): `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
- **Subject** (lowercase): brief description, not sentence-case

Examples:
- `fix: add min-h-0 to ScrollArea to enable scrolling`
- `feat: add dark mode toggle`
- `docs: update installation instructions`

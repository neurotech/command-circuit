# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Command Circuit is a Tauri 2 desktop app (Rust backend + React 19 frontend) for personal productivity. Features include clipboard watching for GitHub PRs and Linear issues, a "Good Morning" greeting/notes interface, and configuration management for API credentials.

## Commands

```bash
pnpm dev          # Start Vite dev server + Tauri dev window
pnpm build        # TypeScript compile + Vite bundle + Tauri build
pnpm tauri dev    # Run Tauri in development mode
pnpm tauri build  # Build production Tauri app
```

**Linting/Formatting (Biome):**
```bash
pnpm lint          # Check for issues
pnpm lint:fix      # Auto-fix issues
pnpm format        # Format files
```

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4
- **Desktop:** Tauri 2 (minimal Rust - just plugin initialization)
- **UI:** CVA (class-variance-authority), Lucide icons, Motion animations
- **Code Quality:** Biome (double quotes, sorted Tailwind classes)
- **Storage:** Tauri plugin-store (JSON-based local persistence)

## Architecture

### State Management

Two React contexts manage all app state:
- `ConfigContext` (`src/context/config-context.tsx`): Central state for credentials, clipboard history, UI toggles. Persisted via Tauri store.
- `AlertContext` (`src/context/alert-context.tsx`): Toast notifications with 3-second auto-dismiss.

Both use React 19's `use()` hook for consumption.

### Feature Organization

Features are self-contained in `src/features/`:
- `clipboard-watcher/`: Polls clipboard every 1s for GitHub PR URLs and Linear issue IDs (ENG-*, PAY-*), fetches metadata via APIs
- `good-morning/`: Daily greeting with notes (yesterday/today), markdown rendering
- `config/`: Modal dialog for API keys and debug mode

### Data Persistence

All config goes through `useConfig()` hook → Tauri plugin-store → JSON file. Keys:
- `github-api-key`, `linear-api-key` for credentials
- Clipboard history stored with metadata (branch names, PR names, markdown links)

### UI Components

Reusable components in `src/components/ui/` use CVA for variants:
- Button, Card, TextInput, TextArea, FlatButton, StatusPanel
- Dark theme (zinc-900 background), color variants (indigo, red, yellow, emerald)

### API Integration

- GitHub: REST API with Bearer token (`src/features/clipboard-watcher/utils/github-api.ts`)
- Linear: GraphQL via Tauri HTTP plugin (`src/features/clipboard-watcher/utils/linear-api.ts`)

## Code Style

- Double quotes for strings
- Tailwind classes should be sorted (Biome auto-fixes)
- 2-space indentation
- TypeScript strict mode enabled

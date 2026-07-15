# Command Circuit

Command Circuit is a [Tauri 2](https://tauri.app/) desktop app (Rust backend + React 19 frontend) for personal productivity.

## Features

- **Clipboard Watcher** — polls the clipboard for GitHub PR URLs and Linear issue IDs (`ENG-*`, `PAY-*`, `QA-*`, `DES-*`), fetches their metadata, and lets you copy back markdown links, branch names, and PR names.
- **Waygate** — fetches and manages a list of items from a configurable backend endpoint.
- **Fancy Text** — converts text into Unicode styles (bold, italic, script, monospace, zalgo, and more).
- **Good Morning** — a daily greeting with notes for yesterday/today, rendered as copyable markdown.
- **Configuration** — modal dialog for API credentials, the Waygate URL, and debug mode.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4
- **Desktop:** Tauri 2
- **UI:** CVA (class-variance-authority), Lucide icons, Motion animations
- **Code Quality:** Biome
- **Storage:** Tauri `plugin-store` (JSON-based local persistence)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install) toolchain (for the Tauri backend)
- Platform-specific [Tauri prerequisites](https://tauri.app/start/prerequisites/)

### Install

```bash
pnpm install
```

### Develop

```bash
pnpm tauri dev   # run the Tauri dev window (starts Vite automatically)
pnpm dev         # run only the Vite dev server
```

### Build

```bash
pnpm build              # TypeScript compile + Vite bundle
pnpm tauri build        # build a production Tauri app
pnpm tauri:build:deb    # build a .deb bundle (Linux)
```

## Scripts

```bash
pnpm lint        # check for issues with Biome
pnpm lint:fix    # auto-fix issues
pnpm format      # format files
pnpm test        # run the Vitest test suite
pnpm test:ui     # run Vitest with the UI
```

## Configuration

Open the configuration dialog (⌘ + ,) to set:

- **GitHub API key** — used to fetch PR metadata.
- **Linear API key** — used to fetch issue metadata.
- **Waygate URL** — base URL of the Waygate backend.

Credentials are persisted locally via Tauri `plugin-store` in `config.json`.

## Architecture

- `src/context/` — `ConfigContext` (credentials, clipboard history, UI toggles) and `AlertContext` (toast notifications).
- `src/features/` — self-contained features (`clipboard-watcher`, `waygate`, `text-formatter`, `good-morning`, `config`).
- `src/components/ui/` — reusable CVA-based UI primitives.
- `src/hooks/` — shared hooks (`useConfig`, `useCopyToClipboard`, `useKeyboardShortcut`, `useToggle`).
- `src-tauri/` — Rust backend exposing the Waygate commands and registering Tauri plugins.

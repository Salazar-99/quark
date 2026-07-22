# quark

A macOS desktop application built with [Tauri 2](https://tauri.app). The user
interface is a React + TypeScript + Tailwind CSS single-page app rendered inside
the system WebView, and the native backend is written in Rust.

Tauri bundles a lightweight Rust binary that hosts a native window pointing at
the web UI (served by Vite in development, or from static assets in a release
build). The frontend talks to Rust through Tauri's IPC bridge (`invoke`), so
heavy or privileged work lives in Rust while the presentation layer stays in
React.

The UI has two full-screen views sharing one dark, green-accented theme:

- **Quark Code** — an interactive terminal. It starts blank with a blinking
  cursor and a prompt pinned to the bottom; typed lines bubble up into the
  history above.
- **Quark Chat** — a chat window with a collapsible sidebar of past
  conversations and a message composer.

Press **Ctrl+Tab** to switch between them. (⌘+Tab is also wired up, but macOS
reserves it for the system app switcher, so it never reaches the app — Ctrl+Tab
is the working shortcut.)

## Requirements

- **Node.js** 18+ and **pnpm** 9+ — frontend tooling
- **Rust** (stable) with Cargo — installed via [rustup](https://rustup.rs)
- **Xcode Command Line Tools** — `xcode-select --install` (provides the macOS
  system WebView and linker toolchain)

## Getting started

```bash
pnpm install          # install frontend dependencies
pnpm tauri dev        # launch the desktop app with hot reload
```

`pnpm tauri dev` starts the Vite dev server on port `1420`, compiles the Rust
binary, and opens the native window. Edits to the React code hot-reload
instantly; edits to Rust trigger a recompile and app restart.

## Project structure

```
quark/
├── index.html              # Vite HTML entry point
├── package.json            # Frontend deps and scripts
├── vite.config.ts          # Vite config (React + Tailwind plugins, port 1420)
├── tsconfig.json           # TypeScript config for the frontend
│
├── frontend/               # ── Frontend (React / TypeScript / Tailwind) ──
│   ├── main.tsx            #    React entry; mounts <App> and imports index.css
│   ├── App.tsx             #    Root component; screen switching (Ctrl+Tab)
│   ├── index.css           #    Tailwind entry + blinking-cursor keyframe
│   ├── screens/
│   │   ├── TerminalScreen.tsx  # "Quark Code" — interactive terminal
│   │   └── ChatScreen.tsx      # "Quark Chat" — chat UI with sidebar
│   └── vite-env.d.ts       #    Vite type shims
│
├── public/                 # Static assets served as-is
│
└── backend/                # ── Backend (Rust / Tauri) ──
    ├── Cargo.toml          #    Rust crate manifest and dependencies
    ├── tauri.conf.json     #    Tauri config: window, bundle, identifier, build hooks
    ├── build.rs            #    Tauri build script
    ├── capabilities/       #    Permission definitions for the IPC/plugin surface
    ├── icons/              #    App icons for the bundle (.icns, .png, .ico, …)
    └── src/
        ├── main.rs         #    Binary entry; calls into lib.rs
        └── lib.rs          #    App setup, plugins, and #[tauri::command] handlers
```

> **Note:** `frontend/` and `backend/` are renamed from Tauri's conventional
> `src/` and `src-tauri/`. The Tauri CLI locates the backend by finding
> `tauri.conf.json`, so the directory name is free to change; the frontend
> entry is wired through `index.html` (`/frontend/main.tsx`) and
> `tsconfig.json`.

### How the two halves connect

- **Build wiring** lives in `backend/tauri.conf.json`. `beforeDevCommand`
  (`pnpm dev`) and `devUrl` (`http://localhost:1420`) point Tauri at Vite during
  development; `beforeBuildCommand` (`pnpm build`) and `frontendDist`
  (`../dist`) tell it where the compiled web assets are for a release build.
- **IPC** — Rust functions annotated with `#[tauri::command]` and registered in
  `lib.rs` via `invoke_handler` are callable from the frontend:

  ```ts
  import { invoke } from "@tauri-apps/api/core";
  const msg = await invoke<string>("greet", { name: "quark" });
  ```

  `lib.rs` ships with an example `greet` command you can use as a template (it
  is not yet wired into the UI).

## Styling with Tailwind

This project uses **Tailwind CSS v4**, configured through the
`@tailwindcss/vite` plugin in `vite.config.ts` — there is no `tailwind.config.js`
or PostCSS setup. The single line `@import "tailwindcss";` in `frontend/index.css`
pulls in the framework, and utility classes are used directly in JSX. Customize
the theme (colors, fonts, spacing) with an `@theme { … }` block in `index.css`.

## Available scripts

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `pnpm tauri dev`    | Run the full desktop app (Vite + Rust) with hot reload    |
| `pnpm tauri build`  | Produce a distributable macOS `.app` / `.dmg` bundle      |
| `pnpm dev`          | Run only the Vite dev server (web UI in a browser)        |
| `pnpm build`        | Type-check and build the frontend into `dist/`            |
| `pnpm preview`      | Preview the built frontend in a browser                   |

To type-check the Rust backend without launching the app, run
`cargo check` inside `backend/`.

## Building for release

```bash
pnpm tauri build
```

The bundled `.app` and `.dmg` are written to
`backend/target/release/bundle/`. App metadata (name, version, bundle
identifier `com.gerardosalazar.quark`, window size, icons) is configured in
`backend/tauri.conf.json`.

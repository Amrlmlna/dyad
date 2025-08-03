# Dokumentasi Proyek Dyad

## Ringkasan

Dyad adalah proyek modular berbasis TypeScript dan React, menggunakan Vite sebagai bundler, serta mendukung integrasi database (Drizzle ORM, Supabase) dan testing otomatis (Playwright, Vitest). Struktur folder dirancang untuk skalabilitas dan kemudahan modifikasi.

## Tech Stack

- TypeScript, JavaScript
- React, Vite
- Drizzle ORM, Supabase, SQLite
- Tailwind CSS
- Playwright, Vitest
- ESLint, Prettier, Husky

## Arsitektur

- Monorepo modular
- Komponen UI terpisah
- Mendukung plugin/component tagging
- State management dengan atoms
- Integrasi database dan AI

## Struktur Folder

### High Level

- `assets/` : Aset statis (ikon, logo, supabase)
- `drizzle/` : Migrasi & snapshot database
- `e2e-tests/` : Skrip pengujian end-to-end
- `packages/` : Package mandiri (Next.js/React-Vite component tagger)
- `scaffold/` : Template project
- `scripts/` : Skrip utilitas
- `shared/` : Utilitas lintas modul
- `src/` : Source code utama
- `testing/` : Utilitas testing
- `tools/` : Tools internal
- `userData/` : Data pengguna
- `worker/`, `workers/` : Worker scripts

### Low Level (Contoh src/)

- `app/` : Entry point aplikasi
- `atoms/` : State management
- `components/` : Komponen UI (chat, preview_panel, settings, ui)
- `constants/` : Konstanta global
- `contexts/` : Context React
- `db/` : Skema & utilitas database
- `hooks/` : Custom hooks
- `ipc/` : Inter-process communication
- `lib/` : Library internal
- `main/` : Logika utama
- `pages/` : Halaman aplikasi
- `paths/` : Path utilitas
- `prompts/` : Prompt AI/LLM
- `renderer.tsx` : Entry point renderer
- `routes/` : Routing aplikasi
- `shared/` : Utilitas bersama
- `store/` : State global
- `styles/` : CSS global
- `supabase_admin/` : Integrasi admin Supabase
- `utils/` : Helper functions
- `__tests__/` : Unit test

## File Konfigurasi

- `package.json`, `tsconfig.json`, `vite.*.config.mts`, `vitest.config.ts`
- `README.md`, `CONTRIBUTING.md`

---

# Dyad Project Documentation

## Overview

Dyad is a modular project based on TypeScript and React, using Vite as the bundler, supporting database integration (Drizzle ORM, Supabase) and automated testing (Playwright, Vitest). The folder structure is designed for scalability and easy modification.

## Tech Stack

- TypeScript, JavaScript
- React, Vite
- Drizzle ORM, Supabase, SQLite
- Tailwind CSS
- Playwright, Vitest
- ESLint, Prettier, Husky

## Architecture

- Modular monorepo
- Separated UI components
- Supports plugin/component tagging
- State management with atoms
- Database and AI integration

## Folder Structure

### High Level

- `assets/` : Static assets (icons, logo, supabase)
- `drizzle/` : Database migrations & snapshots
- `e2e-tests/` : End-to-end test scripts
- `packages/` : Standalone packages (Next.js/React-Vite component tagger)
- `scaffold/` : Project templates
- `scripts/` : Utility scripts
- `shared/` : Cross-module utilities
- `src/` : Main source code
- `testing/` : Testing utilities
- `tools/` : Internal tools
- `userData/` : User data
- `worker/`, `workers/` : Worker scripts

### Low Level (Example src/)

- `app/` : Application entry point
- `atoms/` : State management
- `components/` : UI components (chat, preview_panel, settings, ui)
- `constants/` : Global constants
- `contexts/` : React contexts
- `db/` : Database schema & utilities
- `hooks/` : Custom hooks
- `ipc/` : Inter-process communication
- `lib/` : Internal libraries
- `main/` : Main logic
- `pages/` : Application pages
- `paths/` : Path utilities
- `prompts/` : AI/LLM prompts
- `renderer.tsx` : Renderer entry point
- `routes/` : Application routing
- `shared/` : Shared utilities
- `store/` : Global state
- `styles/` : Global CSS
- `supabase_admin/` : Supabase admin integration
- `utils/` : Helper functions
- `__tests__/` : Unit tests

## Config Files

- `package.json`, `tsconfig.json`, `vite.*.config.mts`, `vitest.config.ts`
- `README.md`, `CONTRIBUTING.md`

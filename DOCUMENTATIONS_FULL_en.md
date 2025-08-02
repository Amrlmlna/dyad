# Dyad Project: Full Documentation & Developer Guide

## Table of Contents

1. Introduction
2. Tech Stack Overview
3. Folder & Subfolder Purpose
4. Use Cases & Flows
5. Rules for Modification & Contribution
6. Feature Addition/Modification/Deletion Guide
7. FAQ & Best Practices

---

## 1. Introduction

Dyad is a modular, privacy-focused AI app builder built with Electron, React, and TypeScript. This documentation provides a comprehensive, detailed guide for all contributors, including senior developers, to understand, extend, and maintain the system.

---

## 2. Tech Stack Overview

- **Electron**: Desktop app shell, main/renderer process separation, IPC.
- **React + TypeScript**: UI, state, hooks, components, type safety.
- **Jotai**: State management via atoms.
- **TanStack Router**: Routing and navigation.
- **Drizzle ORM + SQLite**: Local database, migrations, schema.
- **Vitest + Playwright**: Unit and E2E testing.
- **Tailwind CSS + Radix UI**: Styling and UI primitives.
- **PostHog**: Telemetry (opt-in).
- **Supabase**: OAuth, backend integration.
- **Multiple AI Providers**: OpenAI, Anthropic, Google, Ollama, custom engine/gateway.
- **Other**: Monaco Editor, Framer Motion, Lucide Icons, Vercel SDK, isomorphic-git.

---

## 3. Folder & Subfolder Purpose

### Top-Level Folders

- **`src/`**: Main source code for the app.
- **`assets/`**: Static files (icons, logos, branding).
- **`drizzle/`**: Database migration scripts and metadata.
- **`e2e-tests/`**: End-to-end Playwright tests, helpers, fixtures, snapshots.
- **`packages/`**: External/internal packages (e.g., component taggers).
- **`scaffold/`**: Project scaffolding logic.
- **`scripts/`**: Utility scripts (clear logs, verify assets, etc).
- **`shared/`**: Shared server/client logic (e.g., fake LLM server).
- **`testing/`**: Additional testing utilities.
- **`tools/`**: Build and dev tools.
- **`userData/`**: Local user data (SQLite DB, settings).
- **`worker/` & `workers/`**: Worker threads/processes for background tasks.

### `src/` Subfolders

- **`app/`**: Main layout, shell, and global UI (e.g., sidebar, title bar).
- **`atoms/`**: Jotai atoms for state slices (app, chat, models, UI, etc).
- **`components/`**: UI components, grouped by feature:
  - `chat/`: Chat UI (input, message, markdown, dialogs).
  - `preview_panel/`: Code/file preview, editor, problems, publishing.
  - `settings/`: Settings UI (API keys, models, provider settings).
  - `ui/`: Generic UI elements (buttons, dialogs, sidebar, etc).
- **`constants/`**: App-wide constants.
- **`contexts/`**: React context providers (theme, deep link).
- **`db/`**: Database schema and initialization.
- **`hooks/`**: Custom React hooks for app logic (settings, models, chat, etc).
- **`ipc/`**: Electron IPC logic:
  - `handlers/`: Responds to specific IPC events (chat, app, settings, etc).
  - `processors/`: Processes IPC requests (dependency, response, TypeScript).
  - `shared/`: Shared helpers/types for IPC.
  - `utils/`: Utility functions for IPC (env, file, git, LLM, etc).
- **`lib/`**: Utility libraries (assert, chat, schemas, toast, etc).
- **`main/`**: Electron main process logic (window creation, settings, backup manager, deep link handling).
- **`pages/`**: Page-level React components (app details, chat, home, hub, settings).
- **`paths/`**: Path constants/utilities.
- **`prompts/`**: System and inspiration prompts for LLMs.
- **`renderer.tsx`**: Entrypoint for React renderer, sets up providers and telemetry.
- **`router.ts`**: Routing configuration using TanStack Router.
- **`routes/`**: Route definitions, including nested settings/providers.
  - `settings/`: Settings routes.
    - `providers/`: Dynamic provider settings route (`$provider.tsx`).
- **`shared/`**: Shared logic/utilities.
- **`store/`**: Jotai store configuration.
- **`styles/`**: Global CSS.
- **`supabase_admin/`**: Supabase OAuth and management logic.
- **`utils/`**: Utility functions for environment, file, git, LLM, etc.
- **`__tests__/`**: Unit tests and snapshots.

---

## 4. Use Cases & Flows

### Common Use Cases

- **Add a New AI Provider**: Install SDK, add logic in hooks and IPC handlers, UI in settings, document, test.
- **Update Chat UI**: Modify chat components, update hooks, add tests.
- **Database Migration**: Add migration scripts, update schema, test data flows.
- **Add/Modify Feature**: Identify concern (UI, state, IPC, etc), place code in correct folder, document, test.
- **Handle Deep Link**: Update main process logic, add handler, update UI as needed.
- **Telemetry Update**: Modify PostHog integration, ensure privacy compliance.

### Typical Flow for Feature Addition

1. **Design**: Define feature, update documentation.
2. **Implementation**:
   - UI: Add/modify components in `src/components/`.
   - State: Update atoms/hooks in `src/atoms/` or `src/hooks/`.
   - Logic: Add/modify IPC handlers/processors if needed.
   - Database: Update schema/migrations if persistent data required.
3. **Testing**: Add unit/E2E tests in `src/__tests__/` and `e2e-tests/`.
4. **Documentation**: Update `DOCUMENTATIONS_FULL_en.md`, `README.md`, and code comments.
5. **Review**: Submit for code review, ensure compliance with rules.
6. **Merge**: After approval, merge and deploy.

---

## 5. Rules for Modification & Contribution

- **Folder Placement**: Always place code in the correct folder based on its concern.
- **Naming Conventions**: Use clear, descriptive names for files, functions, and components.
- **Documentation**: Update documentation and code comments for every change.
- **Testing**: Add unit/E2E tests for new features and bug fixes.
- **Code Review**: All changes must be reviewed for compliance and quality.
- **Lint & Prettier**: Ensure code style consistency before merging.
- **Error Handling**: Handle all errors gracefully, provide user feedback.
- **API Keys**: Never hardcode; use environment variables or secure storage.
- **Extensibility**: Design features to be modular and easy to extend.

---

## 6. Feature Addition/Modification/Deletion Guide

### Adding a Feature

1. **Identify Concern**: UI, state, IPC, database, etc.
2. **Folder Selection**: Place code in the correct folder.
3. **Implementation**: Follow modular, documented, and tested approach.
4. **Testing**: Add/modify tests.
5. **Documentation**: Update all relevant docs.
6. **Review & Merge**: Submit for review, address feedback, merge.

### Modifying a Feature

- Locate existing code via folder structure and documentation.
- Update logic, UI, state as needed.
- Add/modify tests.
- Update documentation.
- Submit for review.

### Deleting a Feature

- Remove code from all relevant folders.
- Remove related tests.
- Update documentation.
- Ensure no breaking changes.
- Submit for review.

---

## 7. FAQ & Best Practices

### FAQ

- **Where do I add a new feature?**
  - Identify the concern and place code in the corresponding folder.
- **How do I add a new provider?**
  - Follow the instructions in AI Rules and this documentation.
- **How do I run tests?**
  - Use `npm run test` for unit tests and `npm run e2e` for E2E tests.
- **How do I update the database?**
  - Add migration scripts in `drizzle/`, update schema in `src/db/`.

### Best Practices

- Keep code modular and maintainable.
- Separate concerns (UI, state, logic, IPC).
- Always update documentation and tests.
- Use code reviews to maintain quality.
- Handle errors gracefully and provide user feedback.
- Never hardcode secrets or API keys.
- Design for extensibility and scalability.

---

## Final Notes

This documentation is designed to be a living resource. Update it with every major change to ensure all contributors have full context and guidance for consistent, scalable, and maintainable development.

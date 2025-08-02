# AI Rules (English)

## Purpose

This document defines the rules, standards, and best practices for integrating, updating, and maintaining AI-related code and features in the Dyad project. It ensures consistency, scalability, modularity, and maintainability for all team members and AI assistants.

## General Principles

- **Modularity:** All AI logic must be encapsulated in dedicated modules or components.
- **Separation of Concerns:** Keep AI provider logic, UI, and state management separate.
- **Extensibility:** New AI providers or features should be easy to add without breaking existing functionality.
- **Documentation:** Every AI-related function, class, and module must be documented with clear usage, parameters, and expected outputs.
- **Testing:** All AI logic must have unit and integration tests. Use mocks for external APIs.
- **Security:** Never hardcode secrets or API keys. Use environment variables or secure storage.
- **Error Handling:** All AI calls must handle errors gracefully and provide user feedback.
- **Code Review:** All changes must be reviewed for compliance and quality.

## Folder & Subfolder Responsibilities

- **`src/hooks/`**: Custom hooks for AI logic (chat, models, providers, token counting, etc).
- **`src/ipc/handlers/`**: IPC handlers for AI requests between Electron main/renderer. Each handler should be documented and tested.
- **`src/ipc/processors/`**: Request processors for AI operations (dependency management, response parsing, etc).
- **`src/components/`**: UI components for AI features (chat, model picker, provider settings, etc).
  - `chat/`: Chat UI and logic.
  - `settings/`: Provider and model settings UI.
  - `preview_panel/`: Code and output preview for AI results.
- **`src/utils/`**: Utility functions for AI (token counting, model selection, error handling, etc).
- **`src/lib/`**: Shared libraries for AI schemas, chat logic, and reusable code.
- **`src/__tests__/`**: All new AI logic must have corresponding unit and integration tests.

## Integration Rules

- **Provider Addition:**
  - Add new provider SDKs in `package.json` and document in `README.md`.
  - Place provider-specific logic in `src/hooks/` and `src/ipc/handlers/`.
  - UI for provider settings goes in `src/components/settings/`.
  - Add tests and update documentation.
- **API Keys:**
  - Never hardcode API keys. Use environment variables or secure storage.
  - Document required keys in `README.md` and `Documentations.md`.
- **Error Handling:**
  - All AI calls must handle errors gracefully and provide user feedback.
- **Testing:**
  - Add tests in `src/__tests__/` for every new AI feature or provider.
- **Documentation:**
  - Update all relevant documentation and code comments for every change.

## Advanced Use Cases

- **Multi-provider Support:** Design logic so users can switch providers easily. Use modular hooks and settings UI.
- **Custom Model Management:** Allow users to add, edit, and remove custom models. Store model info securely.
- **Streaming Responses:** Support streaming AI responses in chat and preview components.
- **Error Logging:** Log errors for debugging, but never expose sensitive info.
- **Telemetry:** Ensure telemetry is opt-in and privacy-focused.

## Instructions for Updates

- Always update documentation when adding or modifying AI features.
- Follow naming conventions and folder placement rules.
- Run all tests before merging changes.
- Use code reviews to ensure compliance with these rules.
- Ensure backward compatibility when possible.

## Example Workflow

To add a new AI provider:

1. Install SDK and add to `package.json`.
2. Create provider logic in `src/hooks/` and `src/ipc/handlers/`.
3. Add UI in `src/components/settings/`.
4. Document usage in `Documentations.md` and `README.md`.
5. Add tests in `src/__tests__/`.
6. Submit for code review and update documentation.

## Modification Guidelines

- **Adding Features:** Follow modular design, document, and test.
- **Modifying Features:** Locate code via folder structure, update logic, UI, and tests. Update documentation.
- **Deleting Features:** Remove code and tests, update documentation, ensure no breaking changes.

## Best Practices

- Keep code modular and maintainable.
- Separate concerns (UI, state, logic, IPC).
- Always update documentation and tests.
- Use code reviews to maintain quality.
- Handle errors gracefully and provide user feedback.
- Never hardcode secrets or API keys.
- Design for extensibility and scalability.

---

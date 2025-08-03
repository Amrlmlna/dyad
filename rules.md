# Rules & Best Practices untuk Senior Developer

## Bahasa Indonesia

### 1. Memulai Modifikasi

- Baca dokumentasi dan struktur folder pada `dokumentasi.md`.
- Pastikan memahami dependensi utama di `package.json` dan konfigurasi di `tsconfig.json`, `vite.*.config.mts`.
- Gunakan branch baru untuk setiap fitur/modifikasi.

### 2. Penambahan Fitur

- Tempatkan komponen baru di `src/components/` sesuai kategori (chat, ui, settings, dll).
- Tambahkan hooks di `src/hooks/` jika logika reusable.
- Update state management di `src/atoms/` jika perlu state global.
- Untuk integrasi database, tambahkan migrasi di `drizzle/` dan utilitas di `src/db/`.
- Tambahkan prompt AI di `src/prompts/` jika fitur terkait LLM.

### 3. Testing

- Tambahkan unit test di `src/__tests__/`.
- Tambahkan e2e test di `e2e-tests/`.
- Jalankan tes dengan Vitest/Playwright sebelum merge.

### 4. Best Practices

- Ikuti standar linting (`eslint`, `prettier`).
- Dokumentasikan setiap fungsi/komponen baru.
- Gunakan context dan hooks untuk manajemen state dan logika aplikasi.
- Pastikan kompatibilitas dengan arsitektur modular.

---

# Rules & Best Practices for Senior Developer

## English Version

### 1. Getting Started

- Read the documentation and folder structure in `dokumentasi.md`.
- Understand main dependencies in `package.json` and configuration in `tsconfig.json`, `vite.*.config.mts`.
- Use a new branch for each feature/modification.

### 2. Adding Features

- Place new components in `src/components/` according to category (chat, ui, settings, etc).
- Add hooks in `src/hooks/` for reusable logic.
- Update state management in `src/atoms/` if global state is needed.
- For database integration, add migrations in `drizzle/` and utilities in `src/db/`.
- Add AI prompts in `src/prompts/` for LLM-related features.

### 3. Testing

- Add unit tests in `src/__tests__/`.
- Add e2e tests in `e2e-tests/`.
- Run tests with Vitest/Playwright before merging.

### 4. Best Practices

- Follow linting standards (`eslint`, `prettier`).
- Document every new function/component.
- Use context and hooks for state and logic management.
- Ensure compatibility with modular architecture.

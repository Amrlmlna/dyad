# Aturan AI (Bahasa Indonesia)

## Tujuan

Dokumen ini mendefinisikan aturan, standar, dan praktik terbaik untuk integrasi, pembaruan, dan pemeliharaan kode serta fitur AI di proyek Dyad. Tujuannya agar seluruh tim dan asisten AI dapat bekerja secara konsisten, skalabel, modular, dan mudah dipelihara.

## Prinsip Umum

- **Modularitas:** Semua logika AI harus dipisahkan dalam modul atau komponen khusus.
- **Pemisahan Tanggung Jawab:** Logika provider AI, UI, dan manajemen state harus terpisah.
- **Ekstensibilitas:** Penambahan provider atau fitur AI baru harus mudah tanpa merusak fungsionalitas yang ada.
- **Dokumentasi:** Setiap fungsi, kelas, dan modul AI wajib didokumentasikan dengan jelas.
- **Pengujian:** Semua logika AI harus memiliki unit test dan integrasi. Gunakan mock untuk API eksternal.
- **Keamanan:** Jangan pernah hardcode API key atau secret. Gunakan environment variable atau penyimpanan aman.
- **Penanganan Error:** Semua pemanggilan AI harus menangani error dengan baik dan memberikan feedback ke user.
- **Code Review:** Semua perubahan harus direview untuk kepatuhan dan kualitas.

## Tanggung Jawab Folder & Subfolder

- **`src/hooks/`**: Custom hook untuk logika AI (chat, model, provider, token counting, dll).
- **`src/ipc/handlers/`**: Handler IPC untuk permintaan AI antara main/renderer Electron. Setiap handler harus didokumentasikan dan diuji.
- **`src/ipc/processors/`**: Processor permintaan untuk operasi AI (manajemen dependensi, parsing respons, dll).
- **`src/components/`**: Komponen UI untuk fitur AI (chat, model picker, pengaturan provider, dll).
  - `chat/`: UI dan logika chat.
  - `settings/`: UI pengaturan provider dan model.
  - `preview_panel/`: Preview kode dan output hasil AI.
- **`src/utils/`**: Fungsi utilitas AI (penghitungan token, pemilihan model, penanganan error, dll).
- **`src/lib/`**: Library bersama untuk skema AI, logika chat, dan kode reusable.
- **`src/__tests__/`**: Semua logika AI baru harus memiliki unit test dan integrasi.

## Aturan Integrasi

- **Penambahan Provider:**
  - Tambahkan SDK provider baru di `package.json` dan dokumentasikan di `README.md`.
  - Tempatkan logika khusus provider di `src/hooks/` dan `src/ipc/handlers/`.
  - UI pengaturan provider di `src/components/settings/`.
  - Tambahkan test dan update dokumentasi.
- **API Key:**
  - Jangan pernah hardcode API key. Gunakan environment variable atau penyimpanan aman.
  - Dokumentasikan kebutuhan key di `README.md` dan `Documentations.md`.
- **Penanganan Error:**
  - Semua pemanggilan AI harus menangani error dengan baik dan memberikan feedback ke user.
- **Pengujian:**
  - Tambahkan test di `src/__tests__/` untuk setiap fitur atau provider AI baru.
- **Dokumentasi:**
  - Update semua dokumentasi dan komentar kode untuk setiap perubahan.

## Use Case Lanjutan

- **Multi-provider Support:** Desain logika agar user bisa switch provider dengan mudah. Gunakan hook dan UI pengaturan yang modular.
- **Manajemen Model Custom:** Izinkan user menambah, edit, dan hapus model custom. Simpan info model dengan aman.
- **Streaming Response:** Dukung streaming response AI di komponen chat dan preview.
- **Error Logging:** Log error untuk debugging, tapi jangan pernah expose info sensitif.
- **Telemetry:** Pastikan telemetry opt-in dan fokus privasi.

## Instruksi Update

- Selalu update dokumentasi saat menambah atau mengubah fitur AI.
- Ikuti konvensi penamaan dan aturan penempatan folder.
- Jalankan semua test sebelum merge perubahan.
- Lakukan code review untuk memastikan kepatuhan terhadap aturan ini.
- Usahakan backward compatibility jika memungkinkan.

## Contoh Workflow

Menambah provider AI baru:

1. Install SDK dan tambahkan ke `package.json`.
2. Buat logika provider di `src/hooks/` dan `src/ipc/handlers/`.
3. Tambahkan UI di `src/components/settings/`.
4. Dokumentasikan penggunaan di `Documentations.md` dan `README.md`.
5. Tambahkan test di `src/__tests__/`.
6. Submit untuk code review dan update dokumentasi.

## Panduan Modifikasi

- **Menambah Fitur:** Ikuti desain modular, dokumentasi, dan test.
- **Modifikasi Fitur:** Cari kode lewat struktur folder, update logika, UI, dan test. Update dokumentasi.
- **Menghapus Fitur:** Hapus kode dan test, update dokumentasi, pastikan tidak ada breaking change.

## Praktik Terbaik

- Jaga kode tetap modular dan mudah dipelihara.
- Pisahkan concern (UI, state, logika, IPC).
- Selalu update dokumentasi dan test.
- Gunakan code review untuk menjaga kualitas.
- Tangani error dengan baik dan berikan feedback ke user.
- Jangan pernah hardcode secret atau API key.
- Desain agar mudah di-extend dan skalabel.

---

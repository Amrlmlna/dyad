## Langkah Integrasi

1. **UI Embedding (Frontend Ternary App)**

   - Buat `src/components/workflow_panel/n8nEmbed.tsx` untuk embed editor n8n via iframe atau komponen React di aplikasi Ternary (bukan di project yang dihasilkan)
   - Update `src/components/preview_panel/PreviewHeader.tsx` dan `PreviewPanel.tsx` untuk menambah tab "Workflow" di UI Ternary

2. **LLM Tag & Prompt Update (Backend Ternary App)**

   - Tambahkan dukungan tag `<ternary-n8n-workflow>` di `src/ipc/utils/ternary_tag_parser.ts` agar backend Ternary dapat memproses instruksi LLM
   - Update `src/prompts/system_prompt.ts` agar LLM menghasilkan tag baru untuk logika backend pada project yang dihasilkan

3. **Backend Sync (Backend Ternary App & Backend Project yang Dihasilkan)**

   - Update `src/ipc/processors/response_processor.ts` agar backend Ternary dapat memproses tag workflow dan mengirim workflow JSON ke n8n API
   - Backend Ternary bertugas untuk parsing response LLM, membuat struktur file project, dan menyimpan kode serta workflow pada file tree editor
   - Gunakan hook (misal, `src/hooks/useWorkflow.ts`) untuk manajemen state dan sinkronisasi antara backend Ternary dan backend project yang dihasilkan

4. **Database & Metadata (Backend Ternary App)**

   - Opsional update `src/db/schema.ts` untuk menyimpan metadata workflow yang dihasilkan oleh backend Ternary

5. **Integrasi Electron (Frontend Ternary App)**
   - Pastikan panel workflow tampil dengan benar di Electron pada aplikasi Ternary

---

## Contoh Alur Use Case

1. **Prompt User:** "Buat form pendaftaran, dan ketika user submit, kirim email ke admin."
2. **Respon LLM:**
   <ternary-write path="src/components/RegistrationForm.tsx" description="Form pendaftaran">
   // ...kode React...
   </ternary-write>
   <ternary-n8n-workflow name="SendEmailOnFormSubmit">
   { ...n8n workflow JSON... }
   </ternary-n8n-workflow>
3. **Backend (Backend Ternary App & Backend Project yang Dihasilkan):**
   - Backend Ternary mem-parsing response LLM, menulis/mengupdate komponen React pada project yang dihasilkan
   - Backend Ternary mem-parsing dan mengirim workflow ke n8n
   - Backend Ternary mengupdate UI dan backend project yang dihasilkan secara real-time di file tree dan editor

---

## Contoh Alur Use Case Tambahan

### 1. Automation Tool dengan Integrasi Slack & Notion

**Prompt User:** "Buat automation yang ketika ada pesan baru di Slack, otomatis membuat catatan di Notion dan mengirim notifikasi ke email."
**Respon LLM:**
<ternary-n8n-workflow name="SlackToNotionAndEmail">
{
// n8n workflow JSON: trigger pesan Slack, buat halaman Notion, kirim notifikasi Gmail
}
</ternary-n8n-workflow>
**Backend (Backend Ternary App & Backend Project yang Dihasilkan):**

- Backend Ternary mem-parsing response LLM dan mengirim workflow ke n8n
- Backend Ternary mengupdate UI dan backend project yang dihasilkan secara real-time di file tree dan editor

### 2. Integrasi Google Sheets & Google Maps

**Prompt User:** "Setiap kali ada data baru di Google Sheets, ambil lokasi dari Google Maps dan update sheet dengan koordinat."
**Respon LLM:**
<ternary-n8n-workflow name="SheetsToMaps">
{
// n8n workflow JSON: trigger baris baru di Google Sheets, panggil API Google Maps, update sheet
}
</ternary-n8n-workflow>
**Backend (Backend Ternary App & Backend Project yang Dihasilkan):**

- Backend Ternary mem-parsing response LLM dan mengirim workflow ke n8n
- Backend Ternary mengupdate UI dan backend project yang dihasilkan secara real-time di file tree dan editor

### 3. Automation Webhook, Gmail, dan Notion

**Prompt User:** "Buat workflow yang menerima data dari webhook, menyimpan ke Notion, dan mengirim email konfirmasi ke Gmail."
**Respon LLM:**
<ternary-n8n-workflow name="WebhookToNotionAndGmail">
{
// n8n workflow JSON: trigger webhook, buat entry Notion, kirim konfirmasi Gmail
}
</ternary-n8n-workflow>
**Backend (Backend Ternary App & Backend Project yang Dihasilkan):**

- Backend Ternary mem-parsing response LLM dan mengirim workflow ke n8n
- Backend Ternary mengupdate UI dan backend project yang dihasilkan secara real-time di file tree dan editor

### 4. Automation Multi-step dengan Logika Kondisional

**Prompt User:** "Jika ada pesan masuk di Slack berisi kata 'urgent', buat task di Notion dan kirim notifikasi ke Google Sheets."
**Respon LLM:**
<ternary-n8n-workflow name="UrgentSlackToNotionSheets">
{
// n8n workflow JSON: trigger Slack, filter 'urgent', buat task Notion, update Google Sheets
}
</ternary-n8n-workflow>
**Backend (Backend Ternary App & Backend Project yang Dihasilkan):**

- Backend Ternary mem-parsing response LLM dan mengirim workflow ke n8n
- Backend Ternary mengupdate UI dan backend project yang dihasilkan secara real-time di file tree dan editor

---

## Penempatan File/Folder Strategis

- `src/components/workflow_panel/n8nEmbed.tsx` (UI workflow)
- `src/hooks/useWorkflow.ts` (manajemen state workflow)
- `src/ipc/utils/ternary_tag_parser.ts` (parsing tag)
- `src/ipc/processors/response_processor.ts` (logika backend)
- `src/prompts/system_prompt.ts` (prompt LLM)
- `src/components/preview_panel/PreviewHeader.tsx`, `PreviewPanel.tsx` (navbar/panel)
- `src/db/schema.ts` (metadata opsional)

---

## Prinsip Desain Modular

- Fitur ditambahkan sebagai komponen dan hook modular
- Panel workflow terpisah dari panel code/preview
- Parsing tag dan pemrosesan response tetap kompatibel dengan versi sebelumnya
- Prompt sistem membimbing LLM untuk integrasi yang seamless

# Otomasi Workflow: Pola Implementasi ClaraVerse

## Gambaran Umum

Dokumentasi ini merinci rencana integrasi workflow automation n8n ke aplikasi Ternary dengan sepenuhnya mengadopsi pola implementasi ClaraVerse. Semua langkah dan fitur bersifat modular, real-time, dan optimal untuk Electron, tanpa tambahan dokumentasi atau tutorial yang tidak relevan.

---

## Langkah Implementasi Utama

- **Embed n8n Editor**: Gunakan Electron `<webview>` seperti pada ClaraVerse untuk integrasi UI n8n yang robust. Implementasi deteksi URL/mode n8n secara dinamis via Electron IPC. Inject font dan CSS custom agar UI n8n menyatu dengan aplikasi. Tambahkan error handling dan auto-retry pada webview. Integrasi toggle untuk workflow store, quick workflows, webhook tester, dan tool creation.
- **Service Configuration**: Buat hook untuk mengambil konfigurasi/status n8n via Electron IPC, mendukung mode Docker/local/cloud.
- **Real-Time Sync & Logs**: Prefetch workflow dan tampilkan log setup secara real-time via Electron IPC.
- **Custom Nodes & Tools**: Integrasi workflow store, quick workflows, webhook tester, dan UI pembuatan tool untuk otomasi berbasis user.
- **Error Handling**: Implementasi error handling yang robust untuk webview, dengan auto-retry dan feedback ke user.
- **Security & Optimization**: Terapkan best practice security dan optimisasi sesuai pola ClaraVerse.

---

**Ringkasan:**
Dokumentasi ini sepenuhnya mengadopsi pola implementasi ClaraVerse untuk integrasi n8n di Electron, tanpa tambahan tutorial atau dokumentasi umum yang tidak relevan. Semua langkah dan fitur mengikuti arsitektur modular, real-time, dan optimal seperti yang sudah terbukti di ClaraVerse.

---

## Dokumentasi Progress

### Gambaran Umum

Bagian ini mendokumentasikan semua perubahan yang dilakukan untuk mendukung otomasi workflow n8n di aplikasi Ternary, mengikuti pola implementasi ClaraVerse. Termasuk tujuan, cuplikan kode, dan alasan setiap file yang dimodifikasi, serta langkah selanjutnya yang jelas untuk tim.

---

### 1. src/atoms/appAtoms.ts

**Tujuan:** Menambahkan "workflow" ke tipe previewModeAtom agar tab Workflow baru dapat didukung di UI.
**Cuplikan Kode (Baris 8):**

```typescript
export const previewModeAtom = atom<
  "preview" | "code" | "problems" | "configure" | "publish" | "workflow"
>("preview");
```

**Alasan:** Memungkinkan UI beralih ke panel workflow, sehingga editor n8n dapat diakses sebagai fitur utama.

---

### 2. src/components/preview_panel/PreviewHeader.tsx

**Tujuan:** Menambahkan tab "Workflow" ke header preview, sehingga pengguna dapat mengakses panel workflow n8n.
**Cuplikan Kode (Baris 24-34, 79, 143, 201+):**

```tsx
export type PreviewMode =
  | "preview"
  | "code"
  | "problems"
  | "configure"
  | "publish"
  | "workflow";
...
const workflowRef = useRef<HTMLButtonElement>(null);
...
case "workflow":
  targetRef = workflowRef;
  break;
...
{renderButton(
  "workflow",
  workflowRef,
  <Cog size={14} />,
  "Workflow",
  "workflow-mode-button",
)}
```

**Alasan:** Mengintegrasikan editor workflow ke navigasi utama, sesuai prinsip desain modular.

---

### 3. src/components/workflow_panel/n8nEmbed.tsx

**Tujuan:** Membuat komponen baru untuk menampilkan editor workflow n8n melalui iframe (atau <webview> untuk Electron).
**Cuplikan Kode (Seluruh file):**

```tsx
const n8nEmbed: React.FC = () => {
  const n8nUrl = "http://localhost:5678"; // Contoh instance n8n
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <iframe
        src={n8nUrl}
        title="n8n Workflow Editor"
        style={{ width: "100%", height: "100%", border: "none" }}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};
export default n8nEmbed;
```

**Alasan:** Memberikan cara modular dan seamless untuk menampilkan editor n8n di aplikasi Ternary, kompatibel dengan Electron.

---

### 4. src/ipc/utils/ternary_tag_parser.ts

**Tujuan:** Menambahkan parser untuk tag <ternary-n8n-workflow> agar dapat mengekstrak nama workflow dan JSON dari respons LLM.
**Cuplikan Kode (Baris 1-15):**

````typescript
// Extracts <ternary-n8n-workflow> tags from LLM response
export function getTernaryN8nWorkflowTags(fullResponse: string): {
  name: string;
  content: string;
}[] {
  const workflowRegex =
    /<ternary-n8n-workflow name="([^"]+)">([\s\S]*?)<\/ternary-n8n-workflow>/gi;
  let match;
  const tags: { name: string; content: string }[] = [];
  while ((match = workflowRegex.exec(fullResponse)) !== null) {
    const name = match[1];
    let content = match[2].trim();
    // Remove markdown code blocks if present
    const contentLines = content.split("\n");
    if (contentLines[0]?.startsWith("```")) contentLines.shift();
    if (contentLines[contentLines.length - 1]?.startsWith("```"))
      contentLines.pop();
    content = contentLines.join("\n");
    tags.push({ name, content });
  }
  return tags;
}
````

**Alasan:** Memungkinkan otomasi backend dengan parsing instruksi workflow dari respons LLM, siap dikirim ke n8n API.

---

### 5. src/prompts/system_prompt.ts

**Tujuan:** Memperbarui system prompt agar LLM menggunakan tag <ternary-n8n-workflow> untuk otomasi workflow, dengan panduan dan contoh yang jelas.
**Cuplikan Kode (Penempatan strategis setelah definisi role):**

```text
# Workflow Automation (n8n Integration)

Anda mendukung otomasi workflow menggunakan n8n. Ketika pengguna meminta otomasi, Anda harus menghasilkan tag <ternary-n8n-workflow> yang berisi JSON workflow. Tag ini diparsing oleh backend untuk membuat, memperbarui, dan sinkronisasi workflow dengan n8n API. Selalu gunakan tag ini untuk logika otomasi backend, dan pastikan workflow dijelaskan secara lengkap dalam respons.

Contoh penggunaan:
<ternary-n8n-workflow name="SendEmailOnFormSubmit">
{ ...n8n workflow JSON... }
</ternary-n8n-workflow>

Panduan:
- Gunakan <ternary-n8n-workflow> untuk logika otomasi backend yang harus ditangani oleh n8n.
- JSON workflow harus lengkap dan siap dikirim ke n8n API.
- Jika workflow terkait dengan kode yang dihasilkan untuk aplikasi pengguna, pastikan logika tercermin di workflow dan kode backend yang dihasilkan.
- Ikuti pola ClaraVerse untuk embedding, error handling, dan desain modular.
- Referensikan tag ini dalam penjelasan dan contoh jika relevan.
```

**Alasan:** Memastikan LLM secara sistematis memahami dan menghasilkan instruksi otomasi workflow sesuai best practice.

---

## Langkah Selanjutnya

1. Implementasi Sinkronisasi Backend:

   - Update src/ipc/processors/response_processor.ts untuk memproses tag workflow dan mengirim JSON workflow ke n8n API.
   - Pastikan logika backend memperbarui struktur project yang dihasilkan dan sinkron dengan n8n.

2. Manajemen State Workflow:

   - Buat src/hooks/useWorkflow.ts untuk manajemen state modular dan sinkronisasi real-time.

3. Integrasi UI:

   - Render panel workflow di kontainer utama aplikasi saat tab "Workflow" dipilih.
   - Pastikan kompatibilitas Electron dan konfigurasi service dinamis via IPC.

4. Pengujian & Validasi:
   - Uji alur end-to-end, termasuk prompt LLM, parsing workflow, sinkronisasi backend, dan rendering UI.
   - Dokumentasikan hasil dan lakukan iterasi jika diperlukan.

Semua perubahan bersifat modular, terdokumentasi dengan baik, dan mengikuti pola ClaraVerse untuk otomasi workflow n8n. Lanjutkan dengan sinkronisasi backend, manajemen state, dan integrasi UI sesuai langkah di atas.

---

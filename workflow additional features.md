# Workflow Automation: Additional Features & Integration Plan

## Overview

This document outlines the additional features and integration plan for embedding n8n workflow automation into the Ternary app. It is based on a comprehensive scan of the existing architecture and is designed to be modular and compatible with the current system.

---

## Feature Summary

- Embed n8n workflow editor UI in the main app container (next to "code" and "preview" panels)
- Add a "Workflow" tab/button to the navbar for easy access
- Extend LLM system prompt to support `<ternary-n8n-workflow>` tags for backend automation
- Real-time sync between n8n UI, backend code, and LLM responses
- Modular hooks and components for workflow state management
- Electron compatibility for seamless desktop experience

---

## Integration Steps

1. **UI Embedding**

   - Create `src/components/workflow_panel/n8nEmbed.tsx` to embed n8n editor via iframe or React component
   - Update `src/components/preview_panel/PreviewHeader.tsx` and `PreviewPanel.tsx` to add "Workflow" tab

2. **LLM Tag & Prompt Update**

   - Add `<ternary-n8n-workflow>` tag support in `src/ipc/utils/ternary_tag_parser.ts`
   - Update `src/prompts/system_prompt.ts` to instruct LLM to use the new tag for backend logic

3. **Backend Sync**

   - Update `src/ipc/processors/response_processor.ts` to handle workflow tags and POST workflow JSON to n8n API
   - Use hooks (e.g., `src/hooks/useWorkflow.ts`) for state management and sync

4. **Database & Metadata**

   - Optionally update `src/db/schema.ts` to store workflow metadata

5. **Electron Integration**
   - Ensure workflow panel renders correctly in Electron alongside other features

---

## Use Case Flow Example

1. **User Prompt:** "Buat form pendaftaran, dan ketika user submit, kirim email ke admin."
2. **LLM Response:**
   <ternary-write path="src/components/RegistrationForm.tsx" description="Form pendaftaran">
   // ...React code...
   </ternary-write>
   <ternary-n8n-workflow name="SendEmailOnFormSubmit">
   { ...n8n workflow JSON... }
   </ternary-n8n-workflow>
3. **Backend:**
   - Writes/updates the React component
   - Parses and sends the workflow to n8n
   - Updates the UI and backend in real time

---

## Additional Use Case Flow Examples

### 1. Automation Tool with Slack & Notion Integration

**User Prompt:** "Buat automation yang ketika ada pesan baru di Slack, otomatis membuat catatan di Notion dan mengirim notifikasi ke email."
**LLM Response:**
<ternary-n8n-workflow name="SlackToNotionAndEmail">
{
// n8n workflow JSON: trigger on Slack message, create Notion page, send Gmail notification
}
</ternary-n8n-workflow>
**Backend:**

- Parses and sends the workflow to n8n
- Updates the UI and backend in real time

### 2. Google Sheets & Google Maps Integration

**User Prompt:** "Setiap kali ada data baru di Google Sheets, ambil lokasi dari Google Maps dan update sheet dengan koordinat."
**LLM Response:**
<ternary-n8n-workflow name="SheetsToMaps">
{
// n8n workflow JSON: trigger on new row in Google Sheets, call Google Maps API, update sheet
}
</ternary-n8n-workflow>
**Backend:**

- Parses and sends the workflow to n8n
- Updates the UI and backend in real time

### 3. Webhook, Gmail, and Notion Automation

**User Prompt:** "Buat workflow yang menerima data dari webhook, menyimpan ke Notion, dan mengirim email konfirmasi ke Gmail."
**LLM Response:**
<ternary-n8n-workflow name="WebhookToNotionAndGmail">
{
// n8n workflow JSON: trigger on webhook, create Notion entry, send Gmail confirmation
}
</ternary-n8n-workflow>
**Backend:**

- Parses and sends the workflow to n8n
- Updates the UI and backend in real time

### 4. Multi-step Automation with Conditional Logic

**User Prompt:** "Jika ada pesan masuk di Slack berisi kata 'urgent', buat task di Notion dan kirim notifikasi ke Google Sheets."
**LLM Response:**
<ternary-n8n-workflow name="UrgentSlackToNotionSheets">
{
// n8n workflow JSON: trigger on Slack, filter for 'urgent', create Notion task, update Google Sheets
}
</ternary-n8n-workflow>
**Backend:**

- Parses and sends the workflow to n8n
- Updates the UI and backend in real time

---

## Strategic File/Folder Placement

- `src/components/workflow_panel/n8nEmbed.tsx` (workflow UI)
- `src/hooks/useWorkflow.ts` (workflow state management)
- `src/ipc/utils/ternary_tag_parser.ts` (tag parsing)
- `src/ipc/processors/response_processor.ts` (backend logic)
- `src/prompts/system_prompt.ts` (LLM prompt)
- `src/components/preview_panel/PreviewHeader.tsx`, `PreviewPanel.tsx` (navbar/panel)
- `src/db/schema.ts` (optional metadata)

---

## Modular Design Principles

- Features are added as modular components and hooks
- Workflow panel is decoupled from code/preview panels
- Tag parsing and response processing are backward-compatible
- System prompt guides LLM for seamless integration

## Next Steps

## This plan ensures n8n workflow automation is fully integrated, real-time, and compatible with the existing Ternary architecture.

## Deep Research & Implementation Resources

- **Embed n8n Editor**: Gunakan Electron `<webview>` seperti pada ClaraVerse untuk integrasi UI n8n yang robust. Implementasi deteksi URL/mode n8n secara dinamis via Electron IPC. Inject font dan CSS custom agar UI n8n menyatu dengan aplikasi. Tambahkan error handling dan auto-retry pada webview. Integrasi toggle untuk workflow store, quick workflows, webhook tester, dan tool creation.
- **Service Configuration**: Buat hook untuk mengambil konfigurasi/status n8n via Electron IPC, mendukung mode Docker/local/cloud.
- **Real-Time Sync & Logs**: Prefetch workflow dan tampilkan log setup secara real-time via Electron IPC.
- **Custom Nodes & Tools**: Integrasi workflow store, quick workflows, webhook tester, dan UI pembuatan tool untuk otomasi berbasis user.
- **Error Handling**: Implementasi error handling yang robust untuk webview, dengan auto-retry dan feedback ke user.
- **Security & Optimization**: Terapkan best practice security dan optimisasi sesuai pola ClaraVerse.

---

**Summary:**
Dokumentasi ini sepenuhnya mengadopsi pola implementasi ClaraVerse untuk integrasi n8n di Electron, tanpa tambahan tutorial atau dokumentasi umum yang tidak relevan. Semua langkah dan fitur mengikuti arsitektur modular, real-time, dan optimal seperti yang sudah terbukti di ClaraVerse.

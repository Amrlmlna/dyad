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

1. **User Prompt:** "Create a registration form, and when the user submits, send an email to the admin."
2. **LLM Response:**
   <ternary-write path="src/components/RegistrationForm.tsx" description="Registration form">
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

**User Prompt:** "Create an automation that, when a new message arrives in Slack, automatically creates a note in Notion and sends an email notification."
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

**User Prompt:** "Whenever new data is added to Google Sheets, fetch the location from Google Maps and update the sheet with coordinates."
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

**User Prompt:** "Create a workflow that receives data from a webhook, saves it to Notion, and sends a confirmation email to Gmail."
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

**User Prompt:** "If a Slack message contains the word 'urgent', create a task in Notion and send a notification to Google Sheets."
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

# Workflow Automation: ClaraVerse Implementation Pattern

## Overview

This documentation outlines the integration plan for embedding n8n workflow automation into the Ternary app, fully adopting the ClaraVerse implementation pattern. All steps and features are modular, real-time, and optimized for Electron, with no generic or irrelevant documentation included.

---

## Key Implementation Steps

- **Embed n8n Editor**: Use Electron `<webview>` as in ClaraVerse for robust n8n UI integration. Implement dynamic n8n URL/mode detection via Electron IPC. Inject custom fonts and CSS for seamless UI blending. Add error handling and auto-retry for webview. Integrate toggles for workflow store, quick workflows, webhook tester, and tool creation.
- **Service Configuration**: Create a hook to fetch n8n config/status via Electron IPC, supporting Docker/local/cloud modes.
- **Real-Time Sync & Logs**: Prefetch workflows and display setup logs in real-time via Electron IPC.
- **Custom Nodes & Tools**: Integrate workflow store, quick workflows, webhook tester, and tool creation UI for user-driven automation.
- **Error Handling**: Implement robust error handling for webview, with auto-retry and user feedback.
- **Security & Optimization**: Apply best practice security and optimization as in ClaraVerse.

---

**Summary:**
This documentation fully adopts the ClaraVerse implementation pattern for n8n integration in Electron, without any additional tutorials or generic documentation. All steps and features follow a proven modular, real-time, and optimal architecture.

---

## Progress Documentation

### Overview

This section documents all changes made to support n8n workflow automation in the Ternary app, following the ClaraVerse implementation pattern. It covers the purpose, code snippets, and reasoning for each file modified, and provides clear next steps for the team.

---

### 1. src/atoms/appAtoms.ts

**Purpose:** Added "workflow" to the previewModeAtom type to support the new Workflow tab in the UI.
**Code Snippet (Line 8):**

```typescript
export const previewModeAtom = atom<
  "preview" | "code" | "problems" | "configure" | "publish" | "workflow"
>("preview");
```

**Why:** Allows the UI to switch to the workflow panel, making the n8n editor accessible as a first-class feature.

---

### 2. src/components/preview_panel/PreviewHeader.tsx

**Purpose:** Added a "Workflow" tab to the preview header, enabling users to access the n8n workflow panel.
**Code Snippet (Lines 24-34, 79, 143, 201+):**

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

**Why:** Integrates the workflow editor into the main navigation, following modular design principles.

---

### 3. src/components/preview_panel/tsx

**Purpose:** Created a new component to embed the n8n workflow editor UI via iframe (or <webview> for Electron).
**Code Snippet (Full file):**

```tsx
const n8nEmbed: React.FC = () => {
  const n8nUrl = "http://localhost:5678"; // Example n8n instance
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

**Why:** Provides a seamless, modular way to display the n8n editor inside the Ternary app, compatible with Electron.

---

### 4. src/ipc/utils/ternary_tag_parser.ts

**Purpose:** Added a parser for <ternary-n8n-workflow> tags to extract workflow name and JSON from LLM responses.
**Code Snippet (Lines 1-15):**

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

**Why:** Enables backend automation by parsing workflow instructions from LLM responses, ready to POST to n8n API.

---

### 5. src/prompts/system_prompt.ts

**Purpose:** Updated the system prompt to instruct the LLM to use <ternary-n8n-workflow> tags for workflow automation, with clear guidelines and examples.
**Code Snippet (Strategic placement after role definition):**

```text
# Workflow Automation (n8n Integration)

You support workflow automation using n8n. When a user requests automation, you must generate a <ternary-n8n-workflow> tag containing the workflow JSON. This tag is parsed by the backend to create, update, and sync workflows with the n8n API. Always use this tag for backend automation logic, and ensure the workflow is fully described in the response.

Example usage:
<ternary-n8n-workflow name="SendEmailOnFormSubmit">
{ ...n8n workflow JSON... }
</ternary-n8n-workflow>

Guidelines:
- Use <ternary-n8n-workflow> for any backend automation logic that should be handled by n8n.
- The workflow JSON must be complete and ready to POST to the n8n API.
- If the workflow is related to code generated for the user's app, ensure the logic is reflected in both the workflow and the generated backend code.
- Follow the ClaraVerse pattern for embedding, error handling, and modular design.
- Reference this tag in your explanations and examples when relevant.
```

**Why:** Ensures the LLM systematically understands and generates workflow automation instructions, following best practices.

---

## Next Steps

1. Backend Sync Implementation:

   - Update src/ipc/processors/response_processor.ts to process parsed workflow tags and POST workflow JSON to n8n API.
   - Ensure backend logic updates the generated app structure and syncs with n8n.

2. Workflow State Management:

   - Create src/hooks/useWorkflow.ts for modular state management and real-time sync.

3. UI Integration:

   - Render the workflow panel in the main app container when the "Workflow" tab is selected.
   - Ensure Electron compatibility and dynamic service config via IPC.

4. Testing & Validation:
   - Test end-to-end flows, including LLM prompt, workflow parsing, backend sync, and UI rendering.
   - Document results and iterate as needed.

All changes are modular, well-documented, and follow the ClaraVerse pattern for n8n workflow automation. Proceed with backend sync, state management, and UI integration as outlined above.

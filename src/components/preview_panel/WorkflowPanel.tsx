// WorkflowPanel.tsx
// Renders the n8n workflow UI when the Workflow tab is selected
// Strategic placement: src/components/preview_panel/

import React from "react";

// Single-file workflow panel: directly embed n8n UI here
const n8nUrl = "http://localhost:3000"; // Use existing project port

const WorkflowPanel: React.FC = () => {
  return (
    <div className="w-full h-full">
      <iframe
        src={n8nUrl}
        title="n8n Workflow Editor"
        style={{ width: "100%", height: "100%", border: "none" }}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

export default WorkflowPanel;

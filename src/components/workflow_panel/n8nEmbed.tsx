import React from "react";

// n8nEmbed: Embeds the n8n workflow editor UI in the Ternary app (Electron-compatible)
// This component is for the Ternary app frontend, not the generated project
const n8nEmbed: React.FC = () => {
  // TODO: Replace with dynamic URL/config from IPC or settings
  const n8nUrl = "http://localhost:5678"; // Example n8n instance

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Use iframe for web, <webview> for Electron if needed */}
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

import React from "react";

/**
 * Komponen embed n8n editor (iframe)
 * Ganti src sesuai endpoint n8n instance
 */
export const N8NEmbed: React.FC = () => {
  return (
    <iframe
      src="http://localhost:5678"
      title="n8n Workflow Editor"
      style={{ width: "100%", height: "100%", border: "none" }}
      allow="clipboard-write; clipboard-read;"
    />
  );
};

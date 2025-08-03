import React from "react";
import { N8NEmbed } from "../workflow_panel/n8nEmbed";

const WorkflowPanel: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <N8NEmbed />
    </div>
  );
};

export default WorkflowPanel;

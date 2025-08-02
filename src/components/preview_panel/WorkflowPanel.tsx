

import React, { useState, useEffect } from "react";
import { Loader2, Search, ExternalLink, RefreshCcw } from "lucide-react";
// Remove direct Drizzle ORM import; use Electron IPC
import WorkflowCard from "../workflow_panel/WorkflowCard";
import WorkflowModal from "../workflow_panel/WorkflowModal";
import WorkflowFormModal from "../workflow_panel/WorkflowFormModal";

let prebuiltWorkflows: any[] = [];
try {
  prebuiltWorkflows = require("../../assets/n8n_workflows_full.json");
} catch {
  prebuiltWorkflows = [];
}

const n8nUrl = "http://localhost:32100";

const WorkflowPanel: React.FC = () => {
  const [userWorkflows, setUserWorkflows] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkflow, setSelectedWorkflow] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const handleCreateWorkflow = async (workflow: any) => {
    setLoading(true);
    try {
      const created = await (window as any).electronAPI.createWorkflow(workflow);
      setUserWorkflows(prev => [...prev, created]);
      setFormOpen(false);
    } catch (err) {
      setError("Failed to create workflow");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUserWorkflows = async () => {
      setLoading(true);
      try {
        // Use Electron IPC to get workflows from main process
        const workflows = await (window as any).electronAPI.getAllWorkflows();
        setUserWorkflows(workflows);
      } catch (err) {
        setError("Failed to load user workflows");
      } finally {
        setLoading(false);
      }
    };
    loadUserWorkflows();
  }, []);

  const allWorkflows = [
    ...prebuiltWorkflows.map((w: any) => ({ ...w, is_prebuilt: true })),
    ...userWorkflows.map((w: any) => ({ ...w, is_prebuilt: false }))
  ];

  const filteredWorkflows = allWorkflows.filter((workflow) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      workflow.name.toLowerCase().includes(lower) ||
      workflow.description.toLowerCase().includes(lower) ||
      (workflow.tags && workflow.tags.some((tag: string) => tag.toLowerCase().includes(lower)))
    );
  });

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      // Use Electron IPC to delete workflow in main process
      await (window as any).electronAPI.deleteWorkflow(id);
      setUserWorkflows(userWorkflows.filter((w) => w.id !== id));
    } catch (err) {
      setError("Failed to delete workflow");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (workflow: any) => {
    setSelectedWorkflow(workflow);
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelectedWorkflow(null);
    setModalOpen(false);
  };

  const handleCopyLink = async (jsonLink: string) => {
    try {
      await navigator.clipboard.writeText(jsonLink);
    } catch (err) {
      setError("Failed to copy link");
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-2 p-2 border-b bg-gray-50 dark:bg-gray-900">
        <button
          onClick={() => setFormOpen(true)}
          className="px-3 py-1 rounded-lg bg-purple-600 text-white font-bold shadow neuromorphic-btn text-sm mr-2"
        >
          + Create Workflow
        </button>
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search workflows..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-2 pr-4 py-1 w-64 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-white"
        />
        <button onClick={() => window.open(n8nUrl, "_blank")}
          className="ml-2 px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs flex items-center gap-1">
          <ExternalLink className="w-4 h-4" /> Open n8n
        </button>
        <button onClick={() => window.location.reload()}
          className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs flex items-center gap-1">
          <RefreshCcw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            <span className="ml-2 text-gray-500">Loading workflows...</span>
          </div>
        ) : filteredWorkflows.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No workflows found</div>
        ) : (
          filteredWorkflows.map((workflow: any) => (
            <WorkflowCard
              key={workflow.id || workflow.jsonLink}
              workflow={workflow}
              onClick={() => openModal(workflow)}
              onDownload={() => window.open(workflow.jsonLink, "_blank")}
              onCopy={() => handleCopyLink(workflow.jsonLink)}
            />
          ))
        )}
      </div>

      {modalOpen && selectedWorkflow && (
        <WorkflowModal
          workflow={selectedWorkflow}
          onClose={closeModal}
          onDownload={() => window.open(selectedWorkflow.jsonLink, "_blank")}
        />
      )}

      {formOpen && (
        <WorkflowFormModal
          onClose={() => setFormOpen(false)}
          onSubmit={handleCreateWorkflow}
        />
      )}

      <div className="w-full h-[400px] border-t mt-2">
        <iframe
          src={n8nUrl}
          title="n8n Workflow Editor"
          style={{ width: "100%", height: "100%", border: "none" }}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default WorkflowPanel;

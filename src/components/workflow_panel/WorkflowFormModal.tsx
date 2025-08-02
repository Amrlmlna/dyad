import React, { useState } from "react";
import { X, Check } from "lucide-react";

interface WorkflowFormModalProps {
  initial?: Partial<{
    name: string;
    description: string;
    category: string;
    tags: string[];
    nodeCount: number;
    nodeNames: string[];
    jsonLink: string;
    readmeLink: string;
  }>;
  onClose: () => void;
  onSubmit: (workflow: any) => void;
}

const WorkflowFormModal: React.FC<WorkflowFormModalProps> = ({ initial = {}, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: initial.name || "",
    description: initial.description || "",
    category: initial.category || "",
    tags: initial.tags ? initial.tags.join(", ") : "",
    nodeCount: initial.nodeCount || 0,
    nodeNames: initial.nodeNames ? initial.nodeNames.join(", ") : "",
    jsonLink: initial.jsonLink || "",
    readmeLink: initial.readmeLink || "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.category) {
      setError("Name and category are required.");
      return;
    }
    onSubmit({
      name: form.name,
      description: form.description,
      category: form.category,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      nodeCount: Number(form.nodeCount),
      nodeNames: form.nodeNames.split(",").map(n => n.trim()).filter(Boolean),
      jsonLink: form.jsonLink,
      readmeLink: form.readmeLink,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-lg relative neuromorphic-card">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}><X className="w-5 h-5" /></button>
        <h2 className="text-2xl font-bold mb-4 text-purple-600">{initial.name ? "Edit Workflow" : "Create Workflow"}</h2>
        <div className="space-y-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full px-4 py-2 rounded-lg neuromorphic-input" />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="w-full px-4 py-2 rounded-lg neuromorphic-input" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-4 py-2 rounded-lg neuromorphic-input" />
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full px-4 py-2 rounded-lg neuromorphic-input" />
          <input name="nodeCount" type="number" value={form.nodeCount} onChange={handleChange} placeholder="Node Count" className="w-full px-4 py-2 rounded-lg neuromorphic-input" />
          <input name="nodeNames" value={form.nodeNames} onChange={handleChange} placeholder="Node Names (comma separated)" className="w-full px-4 py-2 rounded-lg neuromorphic-input" />
          <input name="jsonLink" value={form.jsonLink} onChange={handleChange} placeholder="JSON Link or Content" className="w-full px-4 py-2 rounded-lg neuromorphic-input" />
          <input name="readmeLink" value={form.readmeLink} onChange={handleChange} placeholder="Readme Link" className="w-full px-4 py-2 rounded-lg neuromorphic-input" />
        </div>
        {error && <div className="mt-3 text-red-500">{error}</div>}
        <button className="mt-6 w-full py-2 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center neuromorphic-btn" onClick={handleSubmit}>
          <Check className="w-5 h-5 mr-2" /> {initial.name ? "Save Changes" : "Create Workflow"}
        </button>
      </div>
    </div>
  );
};

export default WorkflowFormModal;

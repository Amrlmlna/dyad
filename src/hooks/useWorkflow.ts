import { useState, useCallback } from "react";

export interface WorkflowState {
  workflowJson: any;
  isLoading: boolean;
  error: string | null;
}

export function useWorkflow() {
  const [workflowJson, setWorkflowJson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load workflow from JSON (future: from backend/LLM)
  const loadWorkflow = useCallback((json: any) => {
    setIsLoading(true);
    try {
      setWorkflowJson(json);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load workflow");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset workflow
  const resetWorkflow = useCallback(() => {
    setWorkflowJson(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    workflowJson,
    isLoading,
    error,
    loadWorkflow,
    resetWorkflow,
  };
}

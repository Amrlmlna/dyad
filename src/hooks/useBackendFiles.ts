import { useCallback, useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentAppAtom } from "../atoms/appAtoms";
import { IpcClient } from "../ipc/ipc_client";
import {
  backendFilesAtom,
  backendRelationshipsAtom,
  backendAnalysisAtom,
  isBackendScanningAtom,
  backendScanErrorAtom,
  setBackendAnalysisAtom,
  setScanningStateAtom,
  selectedBackendFileAtom,
  fileEditorContentAtom,
  fileEditorHasChangesAtom,
} from "../atoms/backendFileAtoms";
import { BackendFile, BackendFileAnalysis } from "../types/backendFile";

export interface UseBackendFilesOptions {
  autoScan?: boolean;
  watchFiles?: boolean;
}

export function useBackendFiles(projectPath: string | null, options: UseBackendFilesOptions = {}) {
  const { autoScan = true, watchFiles = false } = options;
  
  // State atoms
  const files = useAtomValue(backendFilesAtom);
  const relationships = useAtomValue(backendRelationshipsAtom);
  const analysis = useAtomValue(backendAnalysisAtom);
  const isScanning = useAtomValue(isBackendScanningAtom);
  const scanError = useAtomValue(backendScanErrorAtom);
  
  // Action atoms
  const setAnalysis = useSetAtom(setBackendAnalysisAtom);
  const setScanningState = useSetAtom(setScanningStateAtom);

  /**
   * Scan the project for backend files
   */
  const scanFiles = useCallback(async () => {
    if (!projectPath) {
      console.warn('No project path provided for backend file scanning');
      return;
    }

    setScanningState({ isScanning: true, error: null });

    try {
      const ipcClient = IpcClient.getInstance();
      const analysis = await ipcClient.scanBackendFiles(projectPath);
      
      console.log('Backend scan completed:', analysis.files.length, 'files,', analysis.relationships.length, 'relationships');
      
      setAnalysis(analysis);
    } catch (error) {
      console.error('Error scanning backend files:', error);
      setScanningState({ 
        isScanning: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    }
  }, [projectPath, setAnalysis, setScanningState]);

  /**
   * Refresh the file scan
   */
  const refreshFiles = useCallback(() => {
    return scanFiles();
  }, [scanFiles]);

  /**
   * Clear all backend file data
   */
  const clearFiles = useCallback(() => {
    setAnalysis(null);
    setScanningState({ isScanning: false, error: null });
  }, [setAnalysis, setScanningState]);

  // Auto-scan when project path changes
  useEffect(() => {
    if (autoScan && projectPath) {
      scanFiles();
    } else if (!projectPath) {
      clearFiles();
    }
  }, [projectPath, autoScan, scanFiles, clearFiles]);

  // Note: File watching is not implemented in renderer process
  // File changes will be detected when user manually refreshes

  return {
    // Data
    files,
    relationships,
    analysis,
    
    // State
    isScanning,
    scanError,
    hasFiles: files.length > 0,
    
    // Actions
    scanFiles,
    refreshFiles,
    clearFiles,
    
    // Statistics
    fileCount: files.length,
    relationshipCount: relationships.length,
    lastScanned: analysis?.lastScanned,
  };
}

/**
 * Hook for file editor operations
 */
export function useFileEditor() {
  const [selectedFile, setSelectedFile] = useAtom(selectedBackendFileAtom);
  const [content, setContent] = useAtom(fileEditorContentAtom);
  const [hasChanges, setHasChanges] = useAtom(fileEditorHasChangesAtom);

  /**
   * Save file content back to disk
   */
  const saveFile = useCallback(async () => {
    if (!selectedFile || !hasChanges) {
      return false;
    }

    try {
      const ipcClient = IpcClient.getInstance();
      await ipcClient.saveBackendFile(selectedFile.path, content);
      
      // Update the file content in the atom
      const updatedFile = { ...selectedFile, content };
      setSelectedFile(updatedFile);
      setHasChanges(false);
      
      console.log(`File saved: ${selectedFile.path}`);
      return true;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }, [selectedFile, content, hasChanges, setSelectedFile, setHasChanges]);

  /**
   * Revert changes to original content
   */
  const revertChanges = useCallback(() => {
    if (selectedFile) {
      setContent(selectedFile.content || '');
      setHasChanges(false);
    }
  }, [selectedFile, setContent, setHasChanges]);

  /**
   * Update editor content
   */
  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
    setHasChanges(selectedFile ? newContent !== selectedFile.content : false);
  }, [selectedFile, setContent, setHasChanges]);

  return {
    selectedFile,
    content,
    hasChanges,
    saveFile,
    revertChanges,
    updateContent,
  };
}

/**
 * Hook to get project path from current app
 */
export function useProjectPath() {
  const currentApp = useAtomValue(currentAppAtom);
  return currentApp?.path || null;
}

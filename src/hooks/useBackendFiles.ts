import { useCallback, useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentAppAtom } from "../atoms/appAtoms";
import * as fs from 'fs';
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
import { BackendFileScanner } from "../services/backendFileScanner";
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
      const scanner = new BackendFileScanner(projectPath);
      const result = await scanner.scanProject();
      setAnalysis(result);
      
      console.log(`Backend scan completed: ${result.files.length} files, ${result.relationships.length} relationships`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Backend file scanning failed:', error);
      setScanningState({ isScanning: false, error: errorMessage });
      setAnalysis(null);
    } finally {
      setScanningState({ isScanning: false });
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

  // File watching (if enabled)
  useEffect(() => {
    if (!watchFiles || !projectPath || !analysis) {
      return;
    }

    // Simple debounced file watcher
    let timeoutId: NodeJS.Timeout;
    
    const handleFileChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log('File change detected, refreshing backend files...');
        refreshFiles();
      }, 1000); // Debounce for 1 second
    };

    // Watch for file changes in the project directory
    // Note: This is a simplified implementation
    // In a real app, you might want to use a more sophisticated file watcher
    const watcher = fs.watch(projectPath, { recursive: true }, (eventType, filename) => {
      if (filename && /\.(js|ts|jsx|tsx|py|php|go|rb)$/.test(filename)) {
        handleFileChange();
      }
    });

    return () => {
      clearTimeout(timeoutId);
      watcher.close();
    };
  }, [watchFiles, projectPath, analysis, refreshFiles]);

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
      await fs.promises.writeFile(selectedFile.absolutePath, content, 'utf-8');
      
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
      setContent(selectedFile.content);
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

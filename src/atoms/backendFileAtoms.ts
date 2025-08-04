import { atom } from "jotai";
import { BackendFile, FileRelationship, BackendFileAnalysis, VisualizationSettings } from "../types/backendFile";

// Core backend file data
export const backendFilesAtom = atom<BackendFile[]>([]);
export const backendRelationshipsAtom = atom<FileRelationship[]>([]);
export const backendAnalysisAtom = atom<BackendFileAnalysis | null>(null);

// UI state
export const selectedBackendFileAtom = atom<BackendFile | null>(null);
export const isFileEditorOpenAtom = atom<boolean>(false);
export const isBackendScanningAtom = atom<boolean>(false);
export const backendScanErrorAtom = atom<string | null>(null);

// File editor state
export const fileEditorContentAtom = atom<string>("");
export const fileEditorHasChangesAtom = atom<boolean>(false);

// Visualization settings
export const visualizationSettingsAtom = atom<VisualizationSettings>({
  displayLevel: 'function',
  showThirdPartyOnly: false,
  showCriticalOnly: false,
  groupByType: true,
  autoLayout: true,
});

// Derived atoms
export const backendFileCountAtom = atom((get) => get(backendFilesAtom).length);
export const backendRelationshipCountAtom = atom((get) => get(backendRelationshipsAtom).length);

// File type counts for statistics
export const backendFileTypeCountsAtom = atom((get) => {
  const files = get(backendFilesAtom);
  const counts = {
    controller: 0,
    model: 0,
    route: 0,
    service: 0,
    middleware: 0,
    config: 0,
    unknown: 0,
  };
  
  files.forEach(file => {
    counts[file.type]++;
  });
  
  return counts;
});

// Selected file content atom (read-only)
export const selectedFileContentAtom = atom((get) => {
  const selectedFile = get(selectedBackendFileAtom);
  return selectedFile?.content || "";
});

// Actions atoms (write-only)
export const openFileEditorAtom = atom(
  null,
  (get, set, file: BackendFile) => {
    set(selectedBackendFileAtom, file);
    set(fileEditorContentAtom, file.content || '');
    set(fileEditorHasChangesAtom, false);
    set(isFileEditorOpenAtom, true);
  }
);

export const closeFileEditorAtom = atom(
  null,
  (get, set) => {
    set(isFileEditorOpenAtom, false);
    set(selectedBackendFileAtom, null);
    set(fileEditorContentAtom, "");
    set(fileEditorHasChangesAtom, false);
  }
);

export const updateFileEditorContentAtom = atom(
  null,
  (get, set, content: string) => {
    set(fileEditorContentAtom, content);
    const selectedFile = get(selectedBackendFileAtom);
    set(fileEditorHasChangesAtom, selectedFile ? content !== selectedFile.content : false);
  }
);

export const setBackendAnalysisAtom = atom(
  null,
  (get, set, analysis: BackendFileAnalysis | null) => {
    set(backendAnalysisAtom, analysis);
    if (analysis) {
      set(backendFilesAtom, analysis.files);
      set(backendRelationshipsAtom, analysis.relationships);
      set(backendScanErrorAtom, null);
    } else {
      set(backendFilesAtom, []);
      set(backendRelationshipsAtom, []);
    }
  }
);

export const setScanningStateAtom = atom(
  null,
  (get, set, { isScanning, error }: { isScanning: boolean; error?: string | null }) => {
    set(isBackendScanningAtom, isScanning);
    if (error !== undefined) {
      set(backendScanErrorAtom, error);
    }
  }
);

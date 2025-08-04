import React, { useCallback, useMemo, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
// ReactFlow styles will be handled by the library

import { selectedAppIdAtom, currentAppAtom } from '../../atoms/appAtoms';
import { useBackendFiles } from '../../hooks/useBackendFiles';
import { BackendToolbar } from '../backend_visualizer/BackendToolbar';
import { FileEditor } from '../backend_visualizer/FileEditor';
import { EmptyState } from '../backend_visualizer/EmptyState';
import { nodeTypes } from '../backend_visualizer/nodes/FileNode';
import { BackendFile, FileRelationship } from '../../types/backendFile';

// Convert backend files to ReactFlow nodes
const useFlowNodes = (files: BackendFile[]): Node[] => {
  return useMemo(() => 
    files.map(file => ({
      id: file.id,
      type: 'fileNode',
      position: file.position,
      data: file,
      draggable: true,
    }))
  , [files]);
};

// Convert relationships to ReactFlow edges
const useFlowEdges = (relationships: FileRelationship[]): Edge[] => {
  return useMemo(() =>
    relationships.map(rel => ({
      id: rel.id,
      source: rel.source,
      target: rel.target,
      label: rel.label,
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      labelStyle: { fill: '#64748b', fontSize: 10 },
      labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
    }))
  , [relationships]);
};

// Main visualizer component (wrapped in ReactFlowProvider)
const BackendVisualizerContent: React.FC = () => {
  const selectedAppId = useAtomValue(selectedAppIdAtom);
  const currentApp = useAtomValue(currentAppAtom);
  const { fitView } = useReactFlow();
  
  // Get project path from current app
  const projectPath = currentApp?.path || null;
  
  // Use backend files hook
  const {
    files,
    relationships,
    isScanning,
    scanError,
    hasFiles,
    scanFiles,
    fileCount,
    relationshipCount,
  } = useBackendFiles(projectPath, {
    autoScan: true,
    watchFiles: false, // Disable for now to avoid performance issues
  });

  // Convert to ReactFlow format
  const nodes = useFlowNodes(files);
  const edges = useFlowEdges(relationships);

  // Handle fit view
  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 800 });
  }, [fitView]);

  // Auto fit view when files change
  useEffect(() => {
    if (hasFiles && nodes.length > 0) {
      // Delay to ensure nodes are rendered
      setTimeout(() => {
        handleFitView();
      }, 100);
    }
  }, [hasFiles, nodes.length, handleFitView]);

  // Determine what to render
  const renderContent = () => {
    if (!selectedAppId || !projectPath) {
      return <EmptyState type="no-project" />;
    }

    if (isScanning) {
      return <EmptyState type="scanning" />;
    }

    if (scanError) {
      return (
        <EmptyState 
          type="error" 
          error={scanError} 
          onRefresh={scanFiles}
        />
      );
    }

    if (!hasFiles) {
      return (
        <EmptyState 
          type="no-files" 
          onRefresh={scanFiles}
        />
      );
    }

    return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={2}
        className="neu-bg"
      >
        <Controls className="neu-bg neu-shadow neu-radius" />
        <MiniMap 
          className="neu-bg neu-shadow neu-radius"
          nodeColor={(node) => {
            const file = node.data as BackendFile;
            switch (file.type) {
              case 'controller': return '#3b82f6';
              case 'model': return '#10b981';
              case 'route': return '#8b5cf6';
              case 'service': return '#f59e0b';
              case 'middleware': return '#ef4444';
              case 'config': return '#6b7280';
              default: return '#9ca3af';
            }
          }}
        />
        <Background 
          gap={20} 
          size={1} 
          color="var(--neu-border)"
        />
      </ReactFlow>
    );
  };

  return (
    <div className="flex flex-col h-full neu-bg">
      {/* Toolbar */}
      <BackendToolbar 
        onRefresh={scanFiles}
        onFitView={hasFiles ? handleFitView : undefined}
      />
      
      {/* Main Content */}
      <div className="flex-1 relative">
        {renderContent()}
      </div>
      
      {/* File Editor Modal */}
      <FileEditor />
    </div>
  );
};

// Main component with ReactFlow provider
const BackendPanel: React.FC = () => {
  return (
    <ReactFlowProvider>
      <BackendVisualizerContent />
    </ReactFlowProvider>
  );
};

export default BackendPanel;

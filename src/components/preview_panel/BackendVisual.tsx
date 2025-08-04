import React, { useCallback, useMemo, useEffect, useState } from 'react';
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
import { VisualizationSettings } from '../backend_visualizer/VisualizationSettings';
import { nodeTypes } from '../backend_visualizer/nodes/FileNode';
import { hierarchicalNodeTypes } from '../backend_visualizer/nodes/HierarchicalFileNode';
import { BackendFile, FileRelationship } from '../../types/backendFile';
import { visualizationSettingsAtom } from '../../atoms/backendFileAtoms';

// Convert backend files to ReactFlow nodes with settings support
const useFlowNodes = (files: BackendFile[], settings: any): Node[] => {
  return useMemo(() => {
    let filteredFiles = files;
    
    // Apply filters based on settings
    if (settings.showThirdPartyOnly) {
      filteredFiles = files.filter(file => 
        file.codeBlocks?.some(block => block.type === 'third_party') ||
        file.functions?.some(func => 
          func.codeBlocks?.some(block => block.type === 'third_party')
        )
      );
    }
    
    if (settings.showCriticalOnly) {
      filteredFiles = filteredFiles.filter(file => 
        file.codeBlocks?.some(block => block.importance === 'critical') ||
        file.functions?.some(func => 
          func.codeBlocks?.some(block => block.importance === 'critical')
        )
      );
    }
    
    // Choose node type based on display level
    const nodeType = settings.displayLevel === 'file' ? 'fileNode' : 'hierarchicalFileNode';
    
    return filteredFiles.map((file) => ({
      id: file.id,
      type: nodeType,
      position: file.position || { x: 0, y: 0 },
      data: file,
      draggable: true,
    }));
  }, [files, settings]);
};

// Convert relationships to ReactFlow edges
const useFlowEdges = (relationships: FileRelationship[]): Edge[] => {
  return useMemo(() =>
    relationships.map((rel) => ({
      id: rel.id,
      source: rel.sourceId,
      target: rel.targetId,
      label: rel.label,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#8b5cf6' },
      labelStyle: { fill: '#64748b', fontSize: 10 },
      labelBgStyle: { fill: 'white', fillOpacity: 0.8 },
    }))
  , [relationships]);
};

// Main visualizer component (wrapped in ReactFlowProvider)
const BackendVisualizerContent: React.FC = () => {
  const selectedAppId = useAtomValue(selectedAppIdAtom);
  const currentApp = useAtomValue(currentAppAtom);
  const settings = useAtomValue(visualizationSettingsAtom);
  const [showSettings, setShowSettings] = useState(false);
  const { fitView } = useReactFlow();
  
  // Get relative project path from current app
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

  // Convert to ReactFlow format with settings
  const nodes = useFlowNodes(files, settings);
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
        nodeTypes={{ ...nodeTypes, ...hierarchicalNodeTypes }}
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
        
        {/* Visualization Settings */}
        <VisualizationSettings 
          isOpen={showSettings}
          onToggle={() => setShowSettings(!showSettings)}
        />
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

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useSetAtom } from 'jotai';
import {
  File,
  FileText,
  Database,
  Server,
  Shield,
  Zap,
  ChevronDown,
  ChevronRight,
  Eye,
  Code,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

import { BackendFile, BackendFunction, CodeBlock } from '../../../types/backendFile';
import { selectedBackendFileAtom } from '../../../atoms/backendFileAtoms';

interface HierarchicalFileNodeProps extends NodeProps {
  data: BackendFile;
}

// Icon mapping for file types
const FILE_TYPE_ICONS = {
  controller: Server,
  model: Database,
  route: Zap,
  service: FileText,
  middleware: Shield,
  config: File,
  unknown: File,
};

// Icon mapping for function types
const FUNCTION_TYPE_ICONS = {
  function: Code,
  method: Code,
  endpoint: Server,
  middleware: Shield,
};

// Icon mapping for code block types
const CODE_BLOCK_ICONS = {
  api_call: ExternalLink,
  db_query: Database,
  auth_check: Shield,
  file_operation: File,
  third_party: ExternalLink,
};

// Importance color mapping
const IMPORTANCE_COLORS = {
  low: 'text-gray-500',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  critical: 'text-red-500',
};

export const HierarchicalFileNode: React.FC<HierarchicalFileNodeProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(data.isExpanded || false);
  const [expandedFunctions, setExpandedFunctions] = useState<Set<string>>(new Set());
  const setSelectedFile = useSetAtom(selectedBackendFileAtom);

  const FileIcon = FILE_TYPE_ICONS[data.type] || File;

  const handleFileClick = useCallback(() => {
    setSelectedFile(data);
  }, [data, setSelectedFile]);

  const handleExpandToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleFunctionExpandToggle = useCallback((functionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedFunctions);
    if (newExpanded.has(functionId)) {
      newExpanded.delete(functionId);
    } else {
      newExpanded.add(functionId);
    }
    setExpandedFunctions(newExpanded);
  }, [expandedFunctions]);

  const renderFunction = (func: BackendFunction) => {
    const FunctionIcon = FUNCTION_TYPE_ICONS[func.type] || Code;
    const isExpanded = expandedFunctions.has(func.id);
    const hasCodeBlocks = func.codeBlocks && func.codeBlocks.length > 0;

    return (
      <div key={func.id} className="ml-4 mb-2">
        <div 
          className="flex items-center gap-2 p-2 neu-bg neu-shadow-inset neu-radius cursor-pointer hover:neu-shadow-hover neu-transition"
          onClick={(e) => hasCodeBlocks ? handleFunctionExpandToggle(func.id, e) : undefined}
        >
          {hasCodeBlocks && (
            <button className="p-0.5 hover:neu-bg neu-radius">
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          )}
          
          <FunctionIcon size={14} className="text-primary" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground truncate">
                {func.name}
              </span>
              
              {func.httpMethod && (
                <span className={`px-1.5 py-0.5 text-xs neu-bg neu-shadow-inset neu-radius font-mono ${
                  func.httpMethod === 'GET' ? 'text-green-600' :
                  func.httpMethod === 'POST' ? 'text-blue-600' :
                  func.httpMethod === 'PUT' ? 'text-orange-600' :
                  func.httpMethod === 'DELETE' ? 'text-red-600' :
                  'text-purple-600'
                }`}>
                  {func.httpMethod}
                </span>
              )}
              
              {func.isAsync && (
                <span className="px-1.5 py-0.5 text-xs neu-bg neu-shadow-inset neu-radius text-muted-foreground">
                  async
                </span>
              )}
            </div>
            
            {func.route && (
              <div className="text-xs text-muted-foreground font-mono mt-0.5">
                {func.route}
              </div>
            )}
          </div>
        </div>

        {/* Code Blocks */}
        {isExpanded && func.codeBlocks && func.codeBlocks.length > 0 && (
          <div className="ml-6 mt-2 space-y-1">
            {func.codeBlocks.map(renderCodeBlock)}
          </div>
        )}
      </div>
    );
  };

  const renderCodeBlock = (block: CodeBlock) => {
    const BlockIcon = CODE_BLOCK_ICONS[block.type] || Code;
    const importanceColor = IMPORTANCE_COLORS[block.importance];

    return (
      <div 
        key={block.id}
        className="flex items-center gap-2 p-2 neu-bg neu-shadow-inset neu-radius"
      >
        <BlockIcon size={12} className={importanceColor} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">
              {block.description}
            </span>
            
            {block.provider && (
              <span className="px-1 py-0.5 text-xs neu-bg neu-shadow-inset neu-radius text-muted-foreground">
                {block.provider}
              </span>
            )}
            
            <span className={`w-2 h-2 rounded-full ${
              block.importance === 'critical' ? 'bg-red-500' :
              block.importance === 'high' ? 'bg-orange-500' :
              block.importance === 'medium' ? 'bg-blue-500' :
              'bg-gray-400'
            }`} />
          </div>
          
          <div className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
            Line {block.startLine}: {block.code}
          </div>
        </div>
      </div>
    );
  };

  const hasFunctions = data.functions && data.functions.length > 0;
  const hasClasses = data.classes && data.classes.length > 0;
  const hasCodeBlocks = data.codeBlocks && data.codeBlocks.length > 0;
  const hasHierarchy = hasFunctions || hasClasses || hasCodeBlocks;

  // Calculate total critical/high importance items
  const criticalCount = data.codeBlocks?.filter(b => b.importance === 'critical').length || 0;
  const highCount = data.codeBlocks?.filter(b => b.importance === 'high').length || 0;

  return (
    <div className="min-w-[280px] max-w-[400px]">
      {/* Connection Handles */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 neu-bg neu-shadow" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 neu-bg neu-shadow" />

      {/* Main File Node */}
      <div 
        className="neu-bg neu-shadow neu-radius p-4 cursor-pointer hover:neu-shadow-hover neu-transition"
        onClick={handleFileClick}
      >
        {/* File Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 neu-bg neu-shadow-inset neu-radius ${
            data.type === 'controller' ? 'border-l-4 border-blue-500' :
            data.type === 'model' ? 'border-l-4 border-green-500' :
            data.type === 'route' ? 'border-l-4 border-purple-500' :
            data.type === 'service' ? 'border-l-4 border-orange-500' :
            data.type === 'middleware' ? 'border-l-4 border-red-500' :
            data.type === 'config' ? 'border-l-4 border-gray-500' :
            'border-l-4 border-gray-400'
          }`}>
            <FileIcon size={20} className="text-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground truncate">
                {data.name}
              </h3>
              
              {hasHierarchy && (
                <button 
                  onClick={handleExpandToggle}
                  className="p-1 hover:neu-bg neu-radius neu-transition"
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground truncate">
              {data.relativePath}
            </p>
          </div>

          <button 
            onClick={handleFileClick}
            className="p-2 neu-bg neu-shadow-inset neu-radius hover:neu-shadow-hover neu-transition"
          >
            <Eye size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* File Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Code size={12} />
            <span>{data.functions?.length || 0} functions</span>
          </div>
          <div className="flex items-center gap-1">
            <ExternalLink size={12} />
            <span>{data.imports.length} imports</span>
          </div>
          {criticalCount > 0 && (
            <div className="flex items-center gap-1 text-red-500">
              <AlertTriangle size={12} />
              <span>{criticalCount} critical</span>
            </div>
          )}
          {highCount > 0 && (
            <div className="flex items-center gap-1 text-orange-500">
              <CheckCircle size={12} />
              <span>{highCount} high priority</span>
            </div>
          )}
        </div>

        {/* API Endpoints Preview */}
        {data.endpoints && data.endpoints.length > 0 && (
          <div className="mb-3">
            <div className="text-xs font-medium text-muted-foreground mb-1">Endpoints:</div>
            <div className="space-y-1">
              {data.endpoints.slice(0, 3).map((endpoint, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <span className={`px-1.5 py-0.5 neu-bg neu-shadow-inset neu-radius font-mono ${
                    endpoint.method === 'GET' ? 'text-green-600' :
                    endpoint.method === 'POST' ? 'text-blue-600' :
                    endpoint.method === 'PUT' ? 'text-orange-600' :
                    endpoint.method === 'DELETE' ? 'text-red-600' :
                    'text-purple-600'
                  }`}>
                    {endpoint.method}
                  </span>
                  <span className="text-muted-foreground font-mono truncate">
                    {endpoint.path}
                  </span>
                </div>
              ))}
              {data.endpoints.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{data.endpoints.length - 3} more...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Hierarchical Content */}
      {isExpanded && hasHierarchy && (
        <div className="mt-2 neu-bg neu-shadow neu-radius p-3">
          {/* Functions */}
          {hasFunctions && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Code size={14} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Functions ({data.functions!.length})
                </span>
              </div>
              <div className="space-y-1">
                {data.functions!.map(renderFunction)}
              </div>
            </div>
          )}

          {/* Classes */}
          {hasClasses && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Classes ({data.classes!.length})
                </span>
              </div>
              <div className="space-y-1">
                {data.classes!.map((cls) => (
                  <div key={cls.id} className="ml-4 p-2 neu-bg neu-shadow-inset neu-radius">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {cls.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {cls.type}
                      </span>
                    </div>
                    {cls.methods.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {cls.methods.length} methods
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Code Blocks (not in functions) */}
          {hasCodeBlocks && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink size={14} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Critical Operations ({data.codeBlocks!.length})
                </span>
              </div>
              <div className="space-y-1">
                {data.codeBlocks!.map(renderCodeBlock)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Export node types for ReactFlow
export const hierarchicalNodeTypes = {
  hierarchicalFileNode: HierarchicalFileNode,
};

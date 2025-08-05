import React, { memo, useCallback, useMemo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  FileText, 
  Database, 
  Route, 
  Cog, 
  Shield, 
  Server,
  Code,
  FileCode,
  ExternalLink,
  AlertTriangle,
  Clock,
  GitBranch
} from 'lucide-react';
import { BackendFile } from '../../../types/backendFile';
import { useSetAtom } from 'jotai';
import { openFileEditorAtom } from '../../../atoms/backendFileAtoms';

interface FileNodeData extends BackendFile {}

interface FileNodeProps extends NodeProps {
  data: FileNodeData;
}

const getFileTypeIcon = (type: BackendFile['type']) => {
  switch (type) {
    case 'controller':
      return <Server size={16} className="text-blue-500" />;
    case 'model':
      return <Database size={16} className="text-green-500" />;
    case 'route':
      return <Route size={16} className="text-purple-500" />;
    case 'service':
      return <Cog size={16} className="text-orange-500" />;
    case 'middleware':
      return <Shield size={16} className="text-red-500" />;
    case 'config':
      return <FileCode size={16} className="text-gray-500" />;
    default:
      return <FileText size={16} className="text-gray-400" />;
  }
};

const getFileTypeAccent = (type: BackendFile['type']) => {
  switch (type) {
    case 'controller':
      return 'border-l-4 border-l-blue-500';
    case 'model':
      return 'border-l-4 border-l-green-500';
    case 'route':
      return 'border-l-4 border-l-purple-500';
    case 'service':
      return 'border-l-4 border-l-orange-500';
    case 'middleware':
      return 'border-l-4 border-l-red-500';
    case 'config':
      return 'border-l-4 border-l-gray-500';
    default:
      return 'border-l-4 border-l-gray-400';
  }
};

export const FileNode: React.FC<FileNodeProps> = memo(({ data, selected }) => {
  const openFileEditor = useSetAtom(openFileEditorAtom);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    openFileEditor(data);
  }, [data, openFileEditor]);

  const nodeStyles = useMemo(() => {
    const accentClasses = getFileTypeAccent(data.type);
    const selectedClasses = selected ? 'ring-2 ring-primary ring-opacity-50' : '';
    return `${accentClasses} ${selectedClasses}`;
  }, [data.type, selected]);

  return (
    <>
      <div 
        className={`
          relative min-w-[180px] max-w-[220px] p-3
          neu-bg neu-shadow neu-radius neu-transition neu-shadow-inset
          hover:neu-shadow-hover active:neu-shadow-pressed
          ${nodeStyles}
        `}
        onDoubleClick={handleClick}
      >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 neu-bg neu-shadow-inset"
        style={{ background: 'var(--neu-bg)', border: '1px solid var(--neu-border)' }}
      />

      {/* File Header */}
      <div className="flex items-center gap-2 mb-2">
        {getFileTypeIcon(data.type)}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-foreground truncate">
            {data.name}
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {data.type}
          </div>
        </div>
      </div>

      {/* File Extension */}
      {data.path && (
        <div className="text-xs text-muted-foreground mb-2">
          {data.path.split('.').pop() || 'unknown'}
        </div>
      )}

      {/* Endpoints (for routes/controllers) */}
      {data.endpoints && data.endpoints.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Endpoints:</div>
          <div className="space-y-0.5">
            {data.endpoints.slice(0, 3).map((endpoint, index) => (
              <div 
                key={index}
                className="text-xs neu-bg neu-shadow-inset px-2 py-1 neu-radius text-foreground font-mono"
              >
                <span className="text-blue-400 font-semibold">{endpoint.method}</span>
                <span className="ml-1">{endpoint.path}</span>
              </div>
            ))}
            {data.endpoints.length > 3 && (
              <div className="text-xs text-muted-foreground px-2">
                +{data.endpoints.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exports (for other file types) */}
      {!data.endpoints && data.exports.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Exports:</div>
          <div className="flex flex-wrap gap-1">
            {data.exports.slice(0, 3).map((exportName, index) => (
              <span 
                key={index}
                className="text-xs neu-bg neu-shadow-inset px-1.5 py-0.5 neu-radius text-foreground"
              >
                {exportName}
              </span>
            ))}
            {data.exports.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{data.exports.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Import Count */}
      {data.imports.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          {data.imports.length} import{data.imports.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 neu-bg neu-shadow-inset"
        style={{ background: 'var(--neu-bg)', border: '1px solid var(--neu-border)' }}
      />
      </div>
    </>
  );
});

// Node type registration for ReactFlow
export const nodeTypes = {
  fileNode: FileNode,
};

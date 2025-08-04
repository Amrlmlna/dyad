import React from 'react';
import { 
  FileSearch, 
  RefreshCw, 
  AlertCircle,
  Folder,
  Code
} from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  type: 'no-project' | 'no-files' | 'error' | 'scanning';
  onRefresh?: () => void;
  error?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  onRefresh, 
  error 
}) => {
  const getContent = () => {
    switch (type) {
      case 'no-project':
        return {
          icon: <Folder size={48} className="text-muted-foreground" />,
          title: 'No Project Selected',
          description: 'Select a project from the sidebar to visualize its backend files.',
          showRefresh: false,
        };

      case 'no-files':
        return {
          icon: <FileSearch size={48} className="text-muted-foreground" />,
          title: 'No Backend Files Found',
          description: (
            <div>
              <p className="text-muted-foreground mb-4">
                No backend files were found in this project. The scanner looks for backend code in:
              </p>
              <ul className="text-sm text-muted-foreground mb-6 space-y-1">
                <li>• <strong>Traditional backend files:</strong> .js, .ts, .py, .php, .go</li>
                <li>• <strong>Component files with backend logic:</strong> .tsx, .jsx</li>
                <li>• <strong>Directories scanned:</strong> src/, components/, pages/, api/, routes/</li>
                <li>• <strong>Patterns detected:</strong> Supabase, authentication, database calls</li>
              </ul>
            </div>
          ),
          showRefresh: true,
        };

      case 'error':
        return {
          icon: <AlertCircle size={48} className="text-destructive" />,
          title: 'Scan Failed',
          description: error || 'An error occurred while scanning backend files. Please try again.',
          showRefresh: true,
        };

      case 'scanning':
        return {
          icon: <RefreshCw size={48} className="text-primary animate-spin" />,
          title: 'Scanning Backend Files',
          description: 'Analyzing your project structure and file relationships...',
          showRefresh: false,
        };

      default:
        return {
          icon: <Code size={48} className="text-muted-foreground" />,
          title: 'Backend Visualizer',
          description: 'Visualize your backend file structure and relationships.',
          showRefresh: false,
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="mb-4">
        {content.icon}
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {content.title}
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
        {content.description}
      </p>

      {content.showRefresh && onRefresh && (
        <Button 
          onClick={onRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Try Again
        </Button>
      )}

      {type === 'no-files' && (
        <div className="mt-6 p-4 neu-bg neu-shadow neu-radius neu-transition neu-shadow-inset max-w-md">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Expected File Structure:
          </h4>
          <div className="text-xs text-muted-foreground text-left space-y-1">
            <div>• <code className="text-primary">api/</code> - API endpoints</div>
            <div>• <code className="text-primary">routes/</code> - Route definitions</div>
            <div>• <code className="text-primary">controllers/</code> - Request handlers</div>
            <div>• <code className="text-primary">models/</code> - Data models</div>
            <div>• <code className="text-primary">services/</code> - Business logic</div>
            <div>• <code className="text-primary">middleware/</code> - Middleware functions</div>
          </div>
        </div>
      )}
    </div>
  );
};

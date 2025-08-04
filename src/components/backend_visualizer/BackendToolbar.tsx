import React from 'react';
import { useAtomValue } from 'jotai';
import { 
  RefreshCw, 
  Search, 
  Filter,
  BarChart3,
  Info,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  backendFileCountAtom,
  backendRelationshipCountAtom,
  backendFileTypeCountsAtom,
  isBackendScanningAtom,
  backendScanErrorAtom,
  backendAnalysisAtom
} from '../../atoms/backendFileAtoms';

interface BackendToolbarProps {
  onRefresh: () => void;
  onFitView?: () => void;
}

export const BackendToolbar: React.FC<BackendToolbarProps> = ({ 
  onRefresh, 
  onFitView 
}) => {
  const fileCount = useAtomValue(backendFileCountAtom);
  const relationshipCount = useAtomValue(backendRelationshipCountAtom);
  const fileTypeCounts = useAtomValue(backendFileTypeCountsAtom);
  const isScanning = useAtomValue(isBackendScanningAtom);
  const scanError = useAtomValue(backendScanErrorAtom);
  const analysis = useAtomValue(backendAnalysisAtom);

  const hasFiles = fileCount > 0;
  const lastScanned = analysis?.lastScanned;

  return (
    <div className="flex items-center justify-between p-3 neu-bg border-b border-border">
      {/* Left side - Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isScanning}
          className="flex items-center gap-2"
        >
          {isScanning ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          {isScanning ? 'Scanning...' : 'Refresh'}
        </Button>

        {hasFiles && onFitView && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFitView}
            className="flex items-center gap-2"
          >
            <Search size={16} />
            Fit View
          </Button>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* File Statistics */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">{fileCount}</span>
            <span>files</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">{relationshipCount}</span>
            <span>connections</span>
          </div>
        </div>
      </div>

      {/* Right side - File type breakdown and status */}
      <div className="flex items-center gap-3">
        {/* Error indicator */}
        {scanError && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Info size={12} />
            Error
          </Badge>
        )}

        {/* File type breakdown */}
        {hasFiles && (
          <div className="flex items-center gap-2">
            {Object.entries(fileTypeCounts)
              .filter(([, count]) => count > 0)
              .map(([type, count]) => (
                <Badge 
                  key={type} 
                  variant="secondary" 
                  className="text-xs capitalize"
                >
                  {type}: {count}
                </Badge>
              ))
            }
          </div>
        )}

        {/* Last scanned time */}
        {lastScanned && (
          <div className="text-xs text-muted-foreground">
            Last scanned: {lastScanned.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

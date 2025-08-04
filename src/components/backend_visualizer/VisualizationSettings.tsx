import React from 'react';
import { useAtom } from 'jotai';
import {
  Settings,
  Eye,
  EyeOff,
  Filter,
  Layout,
  Layers,
  Zap,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

import { visualizationSettingsAtom } from '../../atoms/backendFileAtoms';
import { NodeDisplayLevel } from '../../types/backendFile';

interface VisualizationSettingsProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const VisualizationSettings: React.FC<VisualizationSettingsProps> = ({
  isOpen,
  onToggle,
}) => {
  const [settings, setSettings] = useAtom(visualizationSettingsAtom);

  const handleDisplayLevelChange = (level: NodeDisplayLevel) => {
    setSettings(prev => ({ ...prev, displayLevel: level }));
  };

  const handleToggleSetting = (key: keyof typeof settings) => {
    if (key === 'displayLevel') return; // Handle separately
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="absolute top-4 right-4 z-10 p-3 neu-bg neu-shadow neu-radius hover:neu-shadow-hover neu-transition"
        title="Visualization Settings"
      >
        <Settings size={20} className="text-foreground" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10 w-80 neu-bg neu-shadow neu-radius p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Visualization Settings</h3>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:neu-bg neu-radius neu-transition"
        >
          <EyeOff size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Display Level */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Layers size={16} className="text-primary" />
          <span className="font-medium text-foreground">Detail Level</span>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-2 neu-bg neu-shadow-inset neu-radius cursor-pointer hover:neu-shadow-hover neu-transition">
            <input
              type="radio"
              name="displayLevel"
              value="file"
              checked={settings.displayLevel === 'file'}
              onChange={() => handleDisplayLevelChange('file')}
              className="text-primary"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">File Level</div>
              <div className="text-xs text-muted-foreground">
                Show only files and their relationships
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-2 neu-bg neu-shadow-inset neu-radius cursor-pointer hover:neu-shadow-hover neu-transition">
            <input
              type="radio"
              name="displayLevel"
              value="function"
              checked={settings.displayLevel === 'function'}
              onChange={() => handleDisplayLevelChange('function')}
              className="text-primary"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Function Level</div>
              <div className="text-xs text-muted-foreground">
                Show files with expandable functions and classes
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-2 neu-bg neu-shadow-inset neu-radius cursor-pointer hover:neu-shadow-hover neu-transition">
            <input
              type="radio"
              name="displayLevel"
              value="code_block"
              checked={settings.displayLevel === 'code_block'}
              onChange={() => handleDisplayLevelChange('code_block')}
              className="text-primary"
            />
            <div className="flex-1">
              <div className="font-medium text-foreground">Code Block Level</div>
              <div className="text-xs text-muted-foreground">
                Show detailed code analysis with API calls
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-primary" />
          <span className="font-medium text-foreground">Filters</span>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showThirdPartyOnly}
              onChange={() => handleToggleSetting('showThirdPartyOnly')}
              className="text-primary"
            />
            <div className="flex items-center gap-2">
              <ExternalLink size={14} className="text-orange-500" />
              <span className="text-sm text-foreground">Third-party APIs only</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showCriticalOnly}
              onChange={() => handleToggleSetting('showCriticalOnly')}
              className="text-primary"
            />
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500" />
              <span className="text-sm text-foreground">Critical operations only</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.groupByType}
              onChange={() => handleToggleSetting('groupByType')}
              className="text-primary"
            />
            <div className="flex items-center gap-2">
              <Layout size={14} className="text-blue-500" />
              <span className="text-sm text-foreground">Group by file type</span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoLayout}
              onChange={() => handleToggleSetting('autoLayout')}
              className="text-primary"
            />
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-green-500" />
              <span className="text-sm text-foreground">Auto-arrange layout</span>
            </div>
          </label>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 neu-bg neu-shadow-inset neu-radius">
        <div className="text-xs text-muted-foreground">
          <div className="font-medium mb-1">💡 Pro Tips:</div>
          <ul className="space-y-1">
            <li>• Use <strong>Function Level</strong> for balanced detail</li>
            <li>• Enable <strong>Third-party APIs</strong> to focus on integrations</li>
            <li>• <strong>Critical operations</strong> highlights security & payments</li>
            <li>• <strong>Auto-arrange</strong> organizes nodes by importance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

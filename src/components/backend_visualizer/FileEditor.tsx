import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { 
  isFileEditorOpenAtom,
  selectedBackendFileAtom,
  closeFileEditorAtom,
  fileEditorContentAtom,
  fileEditorHasChangesAtom,
  updateFileEditorContentAtom
} from '../../atoms/backendFileAtoms';
import { useFileEditor } from '../../hooks/useBackendFiles';
import { Button } from '../ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from '../ui/sheet';
import { 
  Save, 
  X, 
  RotateCcw, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

export const FileEditor: React.FC = () => {
  const isOpen = useAtomValue(isFileEditorOpenAtom);
  const selectedFile = useAtomValue(selectedBackendFileAtom);
  const content = useAtomValue(fileEditorContentAtom);
  const hasChanges = useAtomValue(fileEditorHasChangesAtom);
  
  const closeEditor = useSetAtom(closeFileEditorAtom);
  const updateContent = useSetAtom(updateFileEditorContentAtom);
  
  const { saveFile, revertChanges } = useFileEditor();
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Handle save
  const handleSave = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      await saveFile();
      // Optionally close editor after save or show success message
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle revert
  const handleRevert = () => {
    revertChanges();
    setSaveError(null);
  };

  // Handle content change
  const handleContentChange = (newContent: string) => {
    updateContent(newContent);
    setSaveError(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      // Ctrl+S or Cmd+S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
      
      // Escape to close
      if (event.key === 'Escape') {
        event.preventDefault();
        closeEditor();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleSave, closeEditor]);

  if (!selectedFile) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeEditor()}>
      <SheetContent className="w-[600px] sm:w-[800px] sm:max-w-[90vw] flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText size={20} />
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-left truncate">
                {selectedFile.name}{selectedFile.extension}
              </SheetTitle>
              <SheetDescription className="text-left">
                {selectedFile.path}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {selectedFile.type}
              </Badge>
              {hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                  Modified
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Error Display */}
        {saveError && (
          <div className="flex items-center gap-2 p-3 neu-bg neu-shadow-inset neu-radius border border-destructive text-destructive mb-4">
            <AlertCircle size={16} />
            <span className="text-sm">{saveError}</span>
          </div>
        )}

        {/* File Content Editor */}
        <div className="flex-1 min-h-0 flex flex-col">
          <ScrollArea className="flex-1">
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-full min-h-[500px] p-4 font-mono text-sm neu-bg neu-shadow-inset neu-radius resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="File content..."
              spellCheck={false}
            />
          </ScrollArea>
        </div>

        {/* File Stats */}
        <div className="flex-shrink-0 mt-4 p-3 neu-bg neu-shadow-inset neu-radius">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Lines:</span> {content.split('\n').length}
            </div>
            <div>
              <span className="font-medium text-foreground">Characters:</span> {content.length}
            </div>
            <div>
              <span className="font-medium text-foreground">Imports:</span> {selectedFile.imports.length}
            </div>
            <div>
              <span className="font-medium text-foreground">Exports:</span> {selectedFile.exports.length}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex items-center justify-between gap-3 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevert}
              disabled={!hasChanges}
              className="flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Revert
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={closeEditor}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Close
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex items-center gap-2"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="flex-shrink-0 mt-2 text-xs text-muted-foreground text-center">
          <kbd className="px-1.5 py-0.5 neu-bg neu-shadow-inset neu-radius">Ctrl+S</kbd> to save • 
          <kbd className="px-1.5 py-0.5 neu-bg neu-shadow-inset neu-radius ml-1">Esc</kbd> to close
        </div>
      </SheetContent>
    </Sheet>
  );
};

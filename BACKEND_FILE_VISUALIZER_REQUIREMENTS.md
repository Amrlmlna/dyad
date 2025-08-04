# Backend File Visualizer - Requirements & Implementation Guide

## 🎯 **ACTUAL USER REQUIREMENT**

The user wants a **simple backend file visualizer and editor** - NOT a complex "backend architecture design system". This is a tool to visualize existing backend code files and their relationships, similar to n8n's visual workflow editor but for backend code files.

### 🔍 **IMPORTANT: What "Backend" Refers To**

**"Backend" in this context refers to the USER'S GENERATED PROJECT FILES, NOT the Ternary application backend itself.**

- **Target**: User's generated project (created by LLM through chat)
- **Location**: The app directory that user is working on (e.g., `d:\Users\Projects\MyTodoApp\`)
- **Files**: Backend files within the user's generated project (routes, controllers, models, etc.)
- **NOT**: Ternary dyad application's own backend files (`d:\Ternary\dyad\src\`)

**Example Scenario:**
1. User asks: "Create a todo list app with Express.js backend"
2. LLM generates project files in user's app directory
3. Backend visualizer scans the GENERATED project's backend files
4. Shows visual representation of the user's todo app backend structure

### 🏗️ **CRITICAL: Architecture Consistency Rules**

**ALL implementations MUST be consistent and adapt ("menyesuaikan") with the existing Ternary project architecture:**

#### **Tech Stack Consistency:**
- **Frontend**: React + TypeScript + Tailwind CSS
- **State Management**: Jotai atoms (follow existing patterns)
- **UI Components**: Use existing UI components from `src/components/ui/`
- **Styling**: Neuromorphism design system (follow existing shadow patterns)
- **Build System**: Vite + Electron
- **File Operations**: Use existing file system patterns from `src/hooks/useApp.ts`

#### **Code Architecture Consistency:**
- **Folder Structure**: Follow existing `src/` structure patterns
- **Naming Conventions**: Follow existing camelCase/PascalCase patterns
- **Import Patterns**: Use existing import styles and barrel exports
- **Error Handling**: Follow existing error handling patterns
- **Logging**: Use existing `electron-log` patterns
- **TypeScript**: Follow existing type definitions and interfaces

#### **Integration Consistency:**
- **App Context**: Use existing `selectedAppIdAtom` and app path resolution
- **File Tree Integration**: Follow existing file tree update patterns
- **Preview Panel**: Integrate with existing preview panel structure
- **IPC Communication**: Only if absolutely necessary, follow existing IPC patterns
- **Database**: NO new database operations (this is file-only feature)

#### **UI/UX Consistency:**
- **Theme Support**: Support both dark and light themes using existing CSS variables
- **Component Structure**: Follow existing component composition patterns
- **Loading States**: Use existing loading component patterns
- **Error States**: Use existing error display patterns
- **Responsive Design**: Follow existing responsive breakpoint patterns

### **What the User ACTUALLY Wants:**
- **File Scanner**: Scan the USER'S GENERATED PROJECT directory for backend files (controllers, models, routes, services, etc.)
- **Visual Representation**: Display each backend file as a node in a visual canvas
- **Relationship Mapping**: Show how files import/require each other as connecting edges
- **Direct File Editing**: Click on a node → open and edit the actual file content in the USER'S PROJECT
- **No Database Storage**: Just read existing USER'S PROJECT files, no additional data persistence needed
- **Real-time Updates**: Reflect changes when USER'S PROJECT files are modified
- **Project Context**: Always work within the context of the currently selected user app/project

### **What the User DOES NOT Want:**
- ❌ Complex "backend architecture" abstraction layers
- ❌ Additional database tables for storing "architecture data"
- ❌ LLM integration for "defining architectures"
- ❌ Architecture design tools or templates
- ❌ Code generation from visual designs
- ❌ Persistence of visual layouts or metadata

---

## 🚨 **CRITICAL MISTAKES TO AVOID**

### **Previous Implementation Errors:**
1. **Over-Engineering**: Built a complex "backend architecture system" instead of a simple file visualizer
2. **Database Overhead**: Added unnecessary `backend_architectures` table and IPC handlers
3. **LLM Integration**: Added system prompt tags and response processing for architecture
4. **Abstraction Layer**: Created services and types for "architecture management"
5. **Misunderstanding**: Treated it as an "architecture design tool" rather than a "file visualization tool"

### **Key Misunderstanding:**
- **Wrong**: "Backend Architecture Designer" - tool for designing backend systems
- **Correct**: "Backend File Visualizer" - tool for visualizing existing backend files

---

## 📋 **EXACT IMPLEMENTATION REQUIREMENTS**

### **Core Functionality:**

#### **1. File Scanner**
```typescript
// Scan project directory for backend files
const scanBackendFiles = async (projectPath: string) => {
  // Find files in common backend directories:
  // - api/, routes/, controllers/, models/, services/
  // - src/api/, src/routes/, src/controllers/, etc.
  // - Filter for .js, .ts, .py, .php, .go files
  // Return array of file paths
};
```

#### **2. File Analyzer**
```typescript
// Analyze each file to extract metadata
const analyzeFile = async (filePath: string) => {
  // Read file content
  // Determine file type (controller, model, route, service, middleware)
  // Extract imports/requires (for relationship mapping)
  // Extract exports (for understanding what file provides)
  // Extract API endpoints (if route/controller file)
  // Return file metadata
};
```

#### **3. Relationship Builder**
```typescript
// Build relationships between files
const buildRelationships = (files: BackendFile[]) => {
  // For each file's imports, find target files
  // Create edges between source and target files
  // Return array of relationships
};
```

#### **4. Visual Renderer**
```typescript
// Render files as nodes and relationships as edges
const BackendFileVisualizer = () => {
  // Use ReactFlow for visual canvas
  // Each file = one node
  // Each import/require = one edge
  // Node types: controller, model, route, service, middleware, config
  // Click node → open file editor
};
```

### **UI Components Needed:**

#### **1. Main Canvas (ReactFlow)**
- **Nodes**: Represent backend files
- **Edges**: Represent import/require relationships
- **Controls**: Zoom, pan, fit view
- **Minimap**: Overview of entire structure

#### **2. Node Types**
- **Controller Node**: API controllers
- **Model Node**: Database models/schemas  
- **Route Node**: API routes
- **Service Node**: Business logic services
- **Middleware Node**: Express middleware
- **Config Node**: Configuration files

#### **3. File Editor Panel**
- **Trigger**: Click on any node
- **Content**: Show actual file content
- **Editing**: Allow direct file modification
- **Save**: Write changes back to actual file

#### **4. File Tree Integration**
- **Sync**: When files change in file tree, update visualizer
- **Highlight**: Show which files are currently visualized

---

## 🔧 **TECHNICAL IMPLEMENTATION PLAN**

### **Phase 1: File Scanning System**

#### **Step 1.1: Create File Scanner**
```typescript
// File: src/services/fileScanner.ts
export interface BackendFile {
  id: string;
  path: string;           // Relative path from project root
  name: string;           // File name without extension
  type: 'controller' | 'model' | 'route' | 'service' | 'middleware' | 'config';
  content: string;        // Actual file content
  imports: string[];      // List of imported file paths
  exports: string[];      // List of exported items
  endpoints?: string[];   // API endpoints (for routes/controllers)
  position: { x: number; y: number }; // Visual position
}

export interface FileRelationship {
  id: string;
  source: string;         // Source file ID
  target: string;         // Target file ID
  type: 'import';         // Relationship type
  label: string;          // Display label
}

export class BackendFileScanner {
  async scanProject(projectPath: string): Promise<{
    files: BackendFile[];
    relationships: FileRelationship[];
  }> {
    // Implementation here
  }
}
```

#### **Step 1.2: File Type Detection**
```typescript
// Detect file type based on path and content
const detectFileType = (filePath: string, content: string): BackendFile['type'] => {
  // Check directory structure
  if (filePath.includes('/controllers/')) return 'controller';
  if (filePath.includes('/models/')) return 'model';
  if (filePath.includes('/routes/')) return 'route';
  if (filePath.includes('/services/')) return 'service';
  if (filePath.includes('/middleware/')) return 'middleware';
  if (filePath.includes('/config/')) return 'config';
  
  // Check content patterns
  if (content.includes('app.get') || content.includes('router.')) return 'route';
  if (content.includes('Schema') || content.includes('model')) return 'model';
  // ... more patterns
};
```

#### **Step 1.3: Import/Export Analysis**
```typescript
// Extract imports and exports from file content
const analyzeImports = (content: string): string[] => {
  const imports = [];
  
  // ES6 imports: import ... from './path'
  const es6Regex = /import.*from ['"`]([^'"`]+)['"`]/g;
  // CommonJS: require('./path')
  const cjsRegex = /require\(['"`]([^'"`]+)['"`]\)/g;
  
  // Extract only local imports (starting with ./ or ../)
  // Return array of import paths
};

const analyzeExports = (content: string): string[] => {
  // Extract export statements
  // Return array of exported items
};
```

### **Phase 2: Visual Components**

#### **Step 2.1: Update Backend Atoms**
```typescript
// File: src/atoms/backendAtoms.ts
export const backendFilesAtom = atom<BackendFile[]>([]);
export const backendRelationshipsAtom = atom<FileRelationship[]>([]);
export const selectedFileAtom = atom<BackendFile | null>(null);
export const isFileEditorOpenAtom = atom<boolean>(false);
```

#### **Step 2.2: Create File Visualizer Hook**
```typescript
// File: src/hooks/useBackendFiles.ts
export const useBackendFiles = (projectPath: string) => {
  const [files, setFiles] = useAtom(backendFilesAtom);
  const [relationships, setRelationships] = useAtom(backendRelationshipsAtom);
  const [isLoading, setIsLoading] = useState(false);
  
  const scanFiles = useCallback(async () => {
    setIsLoading(true);
    const scanner = new BackendFileScanner();
    const result = await scanner.scanProject(projectPath);
    setFiles(result.files);
    setRelationships(result.relationships);
    setIsLoading(false);
  }, [projectPath]);
  
  return { files, relationships, isLoading, scanFiles };
};
```

#### **Step 2.3: Create Custom Node Components**
```typescript
// File: src/components/backend_visualizer/nodes/FileNode.tsx
export const FileNode = ({ data }: { data: BackendFile }) => {
  const handleClick = () => {
    // Open file editor with this file's content
    setSelectedFile(data);
    setIsFileEditorOpen(true);
  };
  
  return (
    <div 
      className="file-node file-node--{data.type}"
      onClick={handleClick}
    >
      <div className="file-node__icon">
        {getIconForFileType(data.type)}
      </div>
      <div className="file-node__label">{data.name}</div>
      {data.endpoints && (
        <div className="file-node__endpoints">
          {data.endpoints.map(endpoint => (
            <span key={endpoint}>{endpoint}</span>
          ))}
        </div>
      )}
    </div>
  );
};
```

#### **Step 2.4: Update Main Visualizer Component**
```typescript
// File: src/components/preview_panel/BackendVisual.tsx
export const BackendVisualizer = () => {
  const selectedAppId = useAtomValue(selectedAppIdAtom);
  const { files, relationships, isLoading, scanFiles } = useBackendFiles(appPath);
  
  // Convert files to ReactFlow nodes
  const nodes = useMemo(() => 
    files.map(file => ({
      id: file.id,
      type: 'fileNode',
      position: file.position,
      data: file,
    }))
  , [files]);
  
  // Convert relationships to ReactFlow edges
  const edges = useMemo(() =>
    relationships.map(rel => ({
      id: rel.id,
      source: rel.source,
      target: rel.target,
      label: rel.label,
    }))
  , [relationships]);
  
  // Scan files when app changes
  useEffect(() => {
    if (selectedAppId && appPath) {
      scanFiles();
    }
  }, [selectedAppId, appPath, scanFiles]);
  
  return (
    <div className="backend-visualizer">
      <div className="backend-visualizer__toolbar">
        <button onClick={scanFiles}>Refresh Files</button>
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ fileNode: FileNode }}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
      
      <FileEditor />
    </div>
  );
};
```

#### **Step 2.5: Create File Editor Component**
```typescript
// File: src/components/backend_visualizer/FileEditor.tsx
export const FileEditor = () => {
  const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
  const [isOpen, setIsOpen] = useAtom(isFileEditorOpenAtom);
  const [content, setContent] = useState('');
  
  const handleSave = async () => {
    if (selectedFile) {
      // Write content back to actual file
      await fs.writeFile(selectedFile.path, content);
      // Refresh file scanner to reflect changes
      scanFiles();
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit {selectedFile?.name}</SheetTitle>
        </SheetHeader>
        
        <div className="file-editor">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="file-editor__textarea"
          />
          
          <div className="file-editor__actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
```

### **Phase 3: Integration**

#### **Step 3.1: No IPC Changes Needed**
- **Important**: This feature does NOT need new IPC handlers
- **Important**: This feature does NOT need database changes
- **Important**: This feature does NOT need system prompt changes

#### **Step 3.2: File Tree Integration**
```typescript
// When files change in file tree, refresh visualizer
useEffect(() => {
  const handleFileChange = () => {
    if (isBackendVisualizerOpen) {
      scanFiles();
    }
  };
  
  // Listen to file system changes
  fileWatcher.on('change', handleFileChange);
  
  return () => fileWatcher.off('change', handleFileChange);
}, [isBackendVisualizerOpen, scanFiles]);
```

---

## 🎨 **UI/UX REQUIREMENTS**

### **Visual Design:**
- **Neuromorphism Styling**: Consistent with existing app branding
- **Node Colors**: Different colors for different file types
- **Edge Styles**: Dotted lines for imports, solid for strong dependencies
- **Layout**: Auto-layout with manual positioning override
- **Responsive**: Works in preview panel sidebar

### **User Experience:**
- **Loading State**: Show spinner while scanning files
- **Empty State**: Show message when no backend files found
- **Error Handling**: Show errors if file scanning fails
- **Performance**: Handle large codebases (100+ files) smoothly

### **Interactions:**
- **Click Node**: Open file editor
- **Hover Node**: Show file details tooltip
- **Drag Nodes**: Reposition for better layout
- **Zoom/Pan**: Navigate large file structures

---

## ✅ **SUCCESS CRITERIA**

### **Functional Requirements:**
1. ✅ Scans project directory for backend files
2. ✅ Displays files as visual nodes
3. ✅ Shows import relationships as edges
4. ✅ Allows direct file editing through node clicks
5. ✅ Updates automatically when files change
6. ✅ Integrates with existing preview panel

### **Technical Requirements:**
1. ✅ No additional database tables
2. ✅ No IPC handler changes
3. ✅ No system prompt modifications
4. ✅ Uses existing ReactFlow infrastructure
5. ✅ Follows existing code patterns
6. ✅ Maintains neuromorphism styling

### **Performance Requirements:**
1. ✅ Scans 100+ files in under 2 seconds
2. ✅ Renders 50+ nodes smoothly
3. ✅ File editor opens instantly
4. ✅ Auto-refresh doesn't block UI

---

## 🚀 **IMPLEMENTATION CHECKLIST**

### **Phase 1: Core Scanning (Day 1)**
- [ ] Create `BackendFileScanner` class
- [ ] Implement file type detection
- [ ] Implement import/export analysis
- [ ] Test with sample backend project

### **Phase 2: Visual Components (Day 2)**
- [ ] Update backend atoms for file data
- [ ] Create `useBackendFiles` hook
- [ ] Create custom `FileNode` component
- [ ] Update main `BackendVisualizer` component

### **Phase 3: File Editor (Day 3)**
- [ ] Create `FileEditor` component
- [ ] Implement file save functionality
- [ ] Add file editor integration
- [ ] Test end-to-end workflow

### **Phase 4: Polish & Integration (Day 4)**
- [ ] Add neuromorphism styling
- [ ] Implement loading/empty states
- [ ] Add file tree integration
- [ ] Performance optimization
- [ ] Error handling

---

## 📚 **REFERENCE MATERIALS**

### **Existing Project Structure to Study:**

**BEFORE starting implementation, the next AI MUST study these existing patterns:**

#### **App Context & Path Resolution:**
- `src/hooks/useApp.ts` - How to get user's app path from `selectedAppIdAtom`
- `src/atoms/appAtoms.ts` - App selection and state management
- `src/types/app.ts` - App type definitions

#### **File System Operations:**
- `src/components/file_tree/FileTree.tsx` - How file operations are handled
- `src/hooks/useFileTree.ts` - File system watching and updates
- `src/services/fileService.ts` - File read/write operations (if exists)

#### **UI Component Patterns:**
- `src/components/ui/` - All available UI components
- `src/components/preview_panel/` - Preview panel structure and integration
- `src/components/chat/` - How panels are integrated with main layout

#### **State Management Patterns:**
- `src/atoms/` - All existing Jotai atoms and their usage patterns
- `src/hooks/` - Custom hooks and their integration with atoms
- `src/types/` - TypeScript type definitions

#### **Styling Patterns:**
- `src/index.css` - CSS variables for themes and neuromorphism
- `tailwind.config.js` - Tailwind configuration and custom classes
- Existing components - How neuromorphism shadows are applied

### **Reference Materials:**
- `src/components/preview_panel/BackendVisual.tsx` - Current component structure (needs complete rewrite)
- `src/atoms/backendAtoms.ts` - State management patterns (needs modification for files)
- `src/components/file_tree/` - File system integration patterns
- `src/hooks/useApp.ts` - App context usage and path resolution

### **Libraries to Use:**
- **ReactFlow**: For visual node editor
- **Jotai**: For state management
- **fs/path**: For file system operations
- **Existing UI Components**: For consistent styling

### **DO NOT Use:**
- ❌ Database operations (Drizzle ORM)
- ❌ IPC handlers for persistence
- ❌ LLM integration or system prompts
- ❌ Complex service layers

---

## 🎯 **FINAL REMINDER**

This is a **FILE VISUALIZER**, not an **ARCHITECTURE DESIGNER**. 

The goal is to help users understand their existing backend code structure by showing files and their relationships visually. Think of it as a "file explorer with visual relationships" rather than a "design tool".

Keep it simple, focused, and directly connected to the actual files in the user's project.

// Types for backend file visualization
export interface BackendFile {
  id: string;
  path: string;           // Relative path from project root
  absolutePath: string;   // Absolute path to file
  name: string;           // File name without extension
  extension: string;      // File extension (.js, .ts, etc.)
  type: 'controller' | 'model' | 'route' | 'service' | 'middleware' | 'config' | 'unknown';
  content: string;        // Actual file content
  imports: string[];      // List of imported file paths
  exports: string[];      // List of exported items
  endpoints?: string[];   // API endpoints (for routes/controllers)
  position: { x: number; y: number }; // Visual position
  size?: { width: number; height: number }; // Node size
}

export interface FileRelationship {
  id: string;
  source: string;         // Source file ID
  target: string;         // Target file ID
  type: 'import' | 'require';
  label: string;          // Display label
  importName?: string;    // Specific import name
}

export interface BackendFileAnalysis {
  files: BackendFile[];
  relationships: FileRelationship[];
  projectPath: string;
  lastScanned: Date;
}

// File type detection patterns
export const FILE_TYPE_PATTERNS = {
  controller: [
    /\/controllers?\//i,
    /\/api\/.*controller/i,
    /controller\.(js|ts)$/i,
    /\.controller\.(js|ts)$/i,
  ],
  model: [
    /\/models?\//i,
    /\/schemas?\//i,
    /model\.(js|ts)$/i,
    /\.model\.(js|ts)$/i,
    /schema\.(js|ts)$/i,
    /\.schema\.(js|ts)$/i,
  ],
  route: [
    /\/routes?\//i,
    /\/api\/routes/i,
    /route\.(js|ts)$/i,
    /\.route\.(js|ts)$/i,
    /routes\.(js|ts)$/i,
  ],
  service: [
    /\/services?\//i,
    /service\.(js|ts)$/i,
    /\.service\.(js|ts)$/i,
  ],
  middleware: [
    /\/middleware\//i,
    /middleware\.(js|ts)$/i,
    /\.middleware\.(js|ts)$/i,
  ],
  config: [
    /\/config\//i,
    /config\.(js|ts)$/i,
    /\.config\.(js|ts)$/i,
    /\.env/i,
  ],
} as const;

// Content patterns for file type detection
export const CONTENT_TYPE_PATTERNS = {
  controller: [
    /app\.(get|post|put|delete|patch)/i,
    /router\.(get|post|put|delete|patch)/i,
    /express\.Router/i,
    /@Controller/i,
    /@Get|@Post|@Put|@Delete/i,
  ],
  model: [
    /Schema/i,
    /model\s*=/i,
    /mongoose\.model/i,
    /sequelize\.define/i,
    /@Entity/i,
    /@Table/i,
  ],
  route: [
    /router\./i,
    /app\.(use|get|post)/i,
    /express\.Router/i,
    /Route\./i,
  ],
  service: [
    /class.*Service/i,
    /export.*Service/i,
    /service/i,
  ],
  middleware: [
    /next\(\)/i,
    /middleware/i,
    /\(req,\s*res,\s*next\)/i,
  ],
} as const;

// Supported backend file extensions
export const BACKEND_FILE_EXTENSIONS = [
  '.js', '.ts', '.jsx', '.tsx',
  '.py', '.php', '.go', '.rb',
  '.java', '.cs', '.cpp', '.c',
] as const;

export type BackendFileExtension = typeof BACKEND_FILE_EXTENSIONS[number];
export type BackendFileType = keyof typeof FILE_TYPE_PATTERNS | 'unknown';

// Types for backend file visualization
export type BackendFileType = 'controller' | 'model' | 'route' | 'service' | 'middleware' | 'config' | 'unknown';

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  functionName: string;
  line: number;
  parameters?: string[];
  description?: string;
}

export interface BackendFile {
  id: string;
  name: string;
  path: string;
  relativePath: string;
  type: BackendFileType;
  size: number;
  lastModified: Date;
  content?: string;
  imports: string[];
  exports: string[];
  endpoints?: ApiEndpoint[];
  dependencies: string[];
  // Hierarchical structure
  functions?: BackendFunction[];
  classes?: BackendClass[];
  codeBlocks?: CodeBlock[];
  isExpanded?: boolean;
  // ReactFlow node properties
  position?: { x: number; y: number };
}

export interface FileRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'import' | 'export' | 'dependency' | 'function_call' | 'api_call';
  label?: string;
  // For hierarchical relationships
  sourceFunction?: string;
  targetFunction?: string;
}

// New hierarchical types
export interface BackendFunction {
  id: string;
  name: string;
  type: 'function' | 'method' | 'endpoint' | 'middleware';
  startLine: number;
  endLine: number;
  parameters: string[];
  returnType?: string;
  isAsync: boolean;
  isExported: boolean;
  httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  route?: string;
  codeBlocks?: CodeBlock[];
  calls?: FunctionCall[];
}

export interface BackendClass {
  id: string;
  name: string;
  type: 'class' | 'interface' | 'type';
  startLine: number;
  endLine: number;
  methods: BackendFunction[];
  properties: string[];
  extends?: string;
  implements?: string[];
  isExported: boolean;
}

export interface CodeBlock {
  id: string;
  type: 'api_call' | 'db_query' | 'auth_check' | 'file_operation' | 'third_party';
  provider?: ThirdPartyProvider;
  startLine: number;
  endLine: number;
  code: string;
  description: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export interface FunctionCall {
  id: string;
  functionName: string;
  filePath?: string;
  line: number;
  isExternal: boolean;
  isThirdParty: boolean;
  provider?: ThirdPartyProvider;
}

export type ThirdPartyProvider = 
  | 'supabase' | 'openai' | 'anthropic' | 'slack' | 'discord'
  | 'google' | 'github' | 'stripe' | 'twilio' | 'sendgrid'
  | 'aws' | 'azure' | 'gcp' | 'firebase' | 'mongodb'
  | 'postgresql' | 'mysql' | 'redis' | 'prisma' | 'drizzle'
  | 'express' | 'fastify' | 'koa' | 'nestjs' | 'unknown';

// Node display types
export type NodeDisplayLevel = 'file' | 'function' | 'code_block';

export interface VisualizationSettings {
  displayLevel: NodeDisplayLevel;
  showThirdPartyOnly: boolean;
  showCriticalOnly: boolean;
  groupByType: boolean;
  autoLayout: boolean;
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

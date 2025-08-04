import * as fs from 'fs';

// Browser-compatible path utilities
const path = {
  join: (...segments: string[]) => {
    return segments
      .filter(segment => segment && segment !== '.')
      .join('/')
      .replace(/\/+/g, '/'); // Remove duplicate slashes
  },
  relative: (from: string, to: string) => {
    // Simple relative path calculation
    const fromParts = from.split('/').filter(Boolean);
    const toParts = to.split('/').filter(Boolean);
    
    // Find common base
    let commonLength = 0;
    for (let i = 0; i < Math.min(fromParts.length, toParts.length); i++) {
      if (fromParts[i] === toParts[i]) {
        commonLength++;
      } else {
        break;
      }
    }
    
    // Build relative path
    const upLevels = fromParts.length - commonLength;
    const downPath = toParts.slice(commonLength);
    
    const result = '../'.repeat(upLevels) + downPath.join('/');
    return result || '.';
  },
  basename: (filePath: string, ext?: string) => {
    const name = filePath.split('/').pop() || filePath;
    if (ext && name.endsWith(ext)) {
      return name.slice(0, -ext.length);
    }
    return name;
  },
  extname: (filePath: string) => {
    const name = filePath.split('/').pop() || filePath;
    const lastDot = name.lastIndexOf('.');
    return lastDot > 0 ? name.slice(lastDot) : '';
  },
  dirname: (filePath: string) => {
    const parts = filePath.split('/');
    return parts.slice(0, -1).join('/') || '.';
  },
  resolve: (...segments: string[]) => {
    return path.join(...segments);
  }
};
import { 
  BackendFile, 
  FileRelationship, 
  BackendFileAnalysis,
  FILE_TYPE_PATTERNS,
  CONTENT_TYPE_PATTERNS,
  BACKEND_FILE_EXTENSIONS,
  BackendFileType
} from '../types/backendFile';

export class BackendFileScanner {
  private projectPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  /**
   * Scan the project directory for backend files
   */
  async scanProject(): Promise<BackendFileAnalysis> {
    try {
      const files = await this.findBackendFiles();
      const analyzedFiles = await Promise.all(
        files.map(filePath => this.analyzeFile(filePath))
      );
      
      const validFiles = analyzedFiles.filter(Boolean) as BackendFile[];
      const relationships = this.buildRelationships(validFiles);
      
      // Auto-layout files
      this.applyAutoLayout(validFiles);

      return {
        files: validFiles,
        relationships,
        projectPath: this.projectPath,
        lastScanned: new Date(),
      };
    } catch (error) {
      console.error('Error scanning backend files:', error);
      throw error;
    }
  }

  /**
   * Find all backend files in the project directory
   */
  private async findBackendFiles(): Promise<string[]> {
    const backendFiles: string[] = [];
    
    // Common backend directories to scan
    const backendDirs = [
      'api', 'src/api', 'app/api',
      'routes', 'src/routes', 'app/routes',
      'controllers', 'src/controllers', 'app/controllers',
      'models', 'src/models', 'app/models',
      'services', 'src/services', 'app/services',
      'middleware', 'src/middleware', 'app/middleware',
      'config', 'src/config', 'app/config',
      'server', 'src/server',
      'backend', 'src/backend',
    ];

    // Also scan root directory for common files
    const rootFiles = ['server.js', 'server.ts', 'app.js', 'app.ts', 'index.js', 'index.ts'];

    // Scan backend directories
    for (const dir of backendDirs) {
      const fullPath = path.join(this.projectPath, dir);
      if (await this.pathExists(fullPath)) {
        const files = await this.scanDirectory(fullPath);
        backendFiles.push(...files);
      }
    }

    // Scan root files
    for (const file of rootFiles) {
      const fullPath = path.join(this.projectPath, file);
      if (await this.pathExists(fullPath)) {
        backendFiles.push(fullPath);
      }
    }

    return backendFiles;
  }

  /**
   * Recursively scan directory for backend files
   */
  private async scanDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // Skip node_modules and other irrelevant directories
          if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
            const subFiles = await this.scanDirectory(fullPath);
            files.push(...subFiles);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (BACKEND_FILE_EXTENSIONS.includes(ext as any)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`Error scanning directory ${dirPath}:`, error);
    }
    
    return files;
  }

  /**
   * Analyze a single file to extract metadata
   */
  private async analyzeFile(filePath: string): Promise<BackendFile | null> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const relativePath = path.relative(this.projectPath, filePath);
      const fileName = path.basename(filePath, path.extname(filePath));
      const extension = path.extname(filePath);
      
      const fileType = this.detectFileType(relativePath, content);
      const imports = this.extractImports(content);
      const exports = this.extractExports(content);
      const endpoints = this.extractEndpoints(content, fileType);

      return {
        id: this.generateFileId(relativePath),
        path: relativePath,
        absolutePath: filePath,
        name: fileName,
        extension,
        type: fileType,
        content,
        imports,
        exports,
        endpoints,
        position: { x: 0, y: 0 }, // Will be set by auto-layout
        size: { width: 200, height: 100 },
      };
    } catch (error) {
      console.warn(`Error analyzing file ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Detect file type based on path and content
   */
  private detectFileType(filePath: string, content: string): BackendFileType | 'unknown' {
    // Check path patterns first
    for (const [type, patterns] of Object.entries(FILE_TYPE_PATTERNS)) {
      if (patterns.some(pattern => pattern.test(filePath))) {
        return type as BackendFileType;
      }
    }

    // Check content patterns
    for (const [type, patterns] of Object.entries(CONTENT_TYPE_PATTERNS)) {
      if (patterns.some(pattern => pattern.test(content))) {
        return type as BackendFileType;
      }
    }

    return 'unknown';
  }

  /**
   * Extract import statements from file content
   */
  private extractImports(content: string): string[] {
    const imports: string[] = [];
    
    // ES6 imports: import ... from './path'
    const es6ImportRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = es6ImportRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (this.isLocalImport(importPath)) {
        imports.push(importPath);
      }
    }

    // CommonJS: require('./path')
    const cjsRequireRegex = /require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
    while ((match = cjsRequireRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (this.isLocalImport(importPath)) {
        imports.push(importPath);
      }
    }

    return [...new Set(imports)]; // Remove duplicates
  }

  /**
   * Extract export statements from file content
   */
  private extractExports(content: string): string[] {
    const exports: string[] = [];
    
    // Named exports: export { name }
    const namedExportRegex = /export\s*{\s*([^}]+)\s*}/g;
    let match;
    while ((match = namedExportRegex.exec(content)) !== null) {
      const exportNames = match[1].split(',').map(name => name.trim());
      exports.push(...exportNames);
    }

    // Direct exports: export const/function/class name
    const directExportRegex = /export\s+(?:const|let|var|function|class|async\s+function)\s+(\w+)/g;
    while ((match = directExportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }

    // Default export
    if (/export\s+default/.test(content)) {
      exports.push('default');
    }

    return [...new Set(exports)]; // Remove duplicates
  }

  /**
   * Extract API endpoints from route/controller files
   */
  private extractEndpoints(content: string, fileType: BackendFileType): string[] | undefined {
    if (fileType !== 'route' && fileType !== 'controller') {
      return undefined;
    }

    const endpoints: string[] = [];
    
    // Express.js style: app.get('/path', handler)
    const expressRegex = /(?:app|router)\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let match;
    while ((match = expressRegex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];
      endpoints.push(`${method} ${path}`);
    }

    // Decorator style: @Get('/path')
    const decoratorRegex = /@(Get|Post|Put|Delete|Patch)\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
    while ((match = decoratorRegex.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];
      endpoints.push(`${method} ${path}`);
    }

    return endpoints.length > 0 ? endpoints : undefined;
  }

  /**
   * Build relationships between files based on imports
   */
  private buildRelationships(files: BackendFile[]): FileRelationship[] {
    const relationships: FileRelationship[] = [];
    const fileMap = new Map(files.map(file => [file.path, file]));

    for (const file of files) {
      for (const importPath of file.imports) {
        const resolvedPath = this.resolveImportPath(importPath, file.path);
        const targetFile = this.findFileByPath(resolvedPath, fileMap);
        
        if (targetFile) {
          relationships.push({
            id: `${file.id}->${targetFile.id}`,
            source: file.id,
            target: targetFile.id,
            type: 'import',
            label: path.basename(importPath),
            importName: importPath,
          });
        }
      }
    }

    return relationships;
  }

  /**
   * Apply auto-layout to position files visually
   */
  private applyAutoLayout(files: BackendFile[]): void {
    // Simple grid layout for now
    const cols = Math.ceil(Math.sqrt(files.length));
    const nodeWidth = 220;
    const nodeHeight = 120;
    const spacing = 50;

    files.forEach((file, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      file.position = {
        x: col * (nodeWidth + spacing),
        y: row * (nodeHeight + spacing),
      };
    });
  }

  // Helper methods
  private generateFileId(filePath: string): string {
    return filePath.replace(/[/\\]/g, '_').replace(/\./g, '_');
  }

  private isLocalImport(importPath: string): boolean {
    return importPath.startsWith('./') || importPath.startsWith('../');
  }

  private resolveImportPath(importPath: string, fromFile: string): string {
    const fromDir = path.dirname(fromFile);
    const resolved = path.resolve(fromDir, importPath);
    return path.relative(this.projectPath, resolved);
  }

  private findFileByPath(targetPath: string, fileMap: Map<string, BackendFile>): BackendFile | undefined {
    // Try exact match first
    if (fileMap.has(targetPath)) {
      return fileMap.get(targetPath);
    }

    // Try with common extensions
    for (const ext of BACKEND_FILE_EXTENSIONS) {
      const pathWithExt = targetPath + ext;
      if (fileMap.has(pathWithExt)) {
        return fileMap.get(pathWithExt);
      }
    }

    // Try index files
    for (const ext of BACKEND_FILE_EXTENSIONS) {
      const indexPath = path.join(targetPath, 'index' + ext);
      if (fileMap.has(indexPath)) {
        return fileMap.get(indexPath);
      }
    }

    return undefined;
  }

  private async pathExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

import * as fs from 'fs';
import * as path from 'path';
import { 
  BackendFile, 
  FileRelationship, 
  BackendFileAnalysis,
  FILE_TYPE_PATTERNS,
  CONTENT_TYPE_PATTERNS,
  BACKEND_FILE_EXTENSIONS,
  BackendFileType
} from '../types/backendFile';
import { AdvancedCodeAnalyzer } from './advancedCodeAnalyzer';

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
      // Build relationships (including enhanced ones)
      const relationships = AdvancedCodeAnalyzer.generateEnhancedRelationships(validFiles);
      
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
    console.log('🔍 Starting backend file scan in:', this.projectPath);
    
    // Expanded directories to scan (including component directories)
    const scanDirs = [
      // Traditional backend directories
      'api', 'src/api', 'app/api',
      'routes', 'src/routes', 'app/routes',
      'controllers', 'src/controllers', 'app/controllers',
      'models', 'src/models', 'app/models',
      'services', 'src/services', 'app/services',
      'middleware', 'src/middleware', 'app/middleware',
      'config', 'src/config', 'app/config',
      'server', 'src/server',
      'backend', 'src/backend',
      // Frontend directories that might contain backend logic
      'src', 'app', 'pages', 'components',
      'src/components', 'app/components',
      'src/pages', 'app/pages',
      'src/lib', 'lib', 'utils', 'src/utils',
      // Root directory
      '.',
    ];

    // Also scan root directory for common files
    const rootFiles = ['server.js', 'server.ts', 'app.js', 'app.ts', 'index.js', 'index.ts'];

    // Scan directories for backend files
    for (const dir of scanDirs) {
      const fullPath = path.join(this.projectPath, dir);
      if (await this.pathExists(fullPath)) {
        console.log(`📁 Scanning directory: ${dir} (${fullPath})`);
        const files = await this.scanDirectory(fullPath);
        console.log(`  Found ${files.length} files in ${dir}`);
        backendFiles.push(...files);
      } else {
        console.log(`❌ Directory not found: ${dir} (${fullPath})`);
      }
    }

    // Scan root files
    for (const file of rootFiles) {
      const fullPath = path.join(this.projectPath, file);
      if (await this.pathExists(fullPath)) {
        backendFiles.push(fullPath);
      }
    }

    console.log(`✅ Total backend files found: ${backendFiles.length}`);
    if (backendFiles.length > 0) {
      console.log('📋 Found files:', backendFiles.map(f => path.relative(this.projectPath, f)));
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

      const backendFile: BackendFile = {
        id: this.generateFileId(relativePath),
        name: fileName,
        path: relativePath,
        relativePath,
        type: fileType,
        size: content.length,
        lastModified: new Date(), // In real implementation, get from fs.stat
        content,
        imports,
        exports,
        endpoints: (endpoints || []).map((endpoint, index) => ({
          id: `${relativePath}-endpoint-${index}`,
          method: 'GET' as const, // Default, will be enhanced by AdvancedCodeAnalyzer
          path: endpoint,
          functionName: 'unknown',
          line: 0,
        })),
        dependencies: imports, // Use imports as dependencies for now
        position: undefined, // Will be set during layout
      };

      // Apply advanced code analysis
      console.log(`🔍 Analyzing file: ${fileName}`);
      const enhancedFile = AdvancedCodeAnalyzer.analyzeFile(backendFile);
      
      // Log analysis results
      const functionCount = enhancedFile.functions?.length || 0;
      const codeBlockCount = enhancedFile.codeBlocks?.length || 0;
      console.log(`  → Functions: ${functionCount}, Code blocks: ${codeBlockCount}`);
      
      if (codeBlockCount > 0) {
        const criticalBlocks = enhancedFile.codeBlocks?.filter(b => b.importance === 'critical').length || 0;
        const thirdPartyBlocks = enhancedFile.codeBlocks?.filter(b => b.type === 'third_party').length || 0;
        console.log(`  → Critical: ${criticalBlocks}, Third-party: ${thirdPartyBlocks}`);
      }

      return enhancedFile;
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
            sourceId: file.id,
            targetId: targetFile.id,
            type: 'import',
            label: path.basename(importPath),
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

import { 
  BackendFile, 
  BackendFunction, 
  BackendClass, 
  CodeBlock, 
  FunctionCall,
  ThirdPartyProvider,
  FileRelationship 
} from '../types/backendFile';

/**
 * Advanced Code Analyzer - Multi-layer hierarchical analysis
 * 
 * This service provides intelligent code analysis that goes beyond file-level
 * scanning to detect functions, classes, API calls, and third-party integrations
 * while maintaining UX-friendly hierarchical organization.
 */
export class AdvancedCodeAnalyzer {
  private static readonly THIRD_PARTY_PATTERNS: Record<ThirdPartyProvider, RegExp[]> = {
    supabase: [
      /supabase\.from\(/i,
      /createClient.*supabase/i,
      /@supabase/i,
      /supabaseUrl|supabaseKey/i,
      /\.insert\(|\.select\(|\.update\(|\.delete\(/i, // Common Supabase operations
      /\.auth\.signIn|\.auth\.signUp|\.auth\.signOut/i, // Supabase auth
      /SUPABASE_URL|SUPABASE_ANON_KEY/i // Environment variables
    ],
    openai: [
      /openai\./i,
      /new OpenAI/i,
      /chat\.completions\.create/i,
      /gpt-|text-davinci/i
    ],
    anthropic: [
      /anthropic\./i,
      /new Anthropic/i,
      /claude-/i,
      /@anthropic-ai/i
    ],
    slack: [
      /slack.*api/i,
      /WebClient.*slack/i,
      /slack.*webhook/i,
      /xoxb-|xoxp-/i
    ],
    discord: [
      /discord\.js/i,
      /new Client.*discord/i,
      /\.send\(.*embed/i,
      /discord.*webhook/i
    ],
    google: [
      /googleapis/i,
      /google\.auth/i,
      /sheets\.spreadsheets/i,
      /drive\.files/i
    ],
    github: [
      /octokit/i,
      /github.*api/i,
      /repos\.get/i,
      /\.git.*api/i
    ],
    stripe: [
      /stripe\./i,
      /new Stripe/i,
      /paymentIntents/i,
      /sk_test_|sk_live_/i
    ],
    twilio: [
      /twilio\./i,
      /new Twilio/i,
      /messages\.create/i,
      /AC[a-z0-9]{32}/i
    ],
    sendgrid: [
      /sendgrid/i,
      /@sendgrid\/mail/i,
      /sgMail\.send/i,
      /SG\.[A-Za-z0-9_-]{69}/i
    ],
    aws: [
      /aws-sdk/i,
      /new AWS\./i,
      /\.s3\./i,
      /\.lambda\./i,
      /AKIA[0-9A-Z]{16}/i
    ],
    azure: [
      /@azure/i,
      /azure.*client/i,
      /\.azure\./i,
      /DefaultAzureCredential/i
    ],
    gcp: [
      /google-cloud/i,
      /\.googleapis\.com/i,
      /gcloud/i,
      /service-account/i
    ],
    firebase: [
      /firebase/i,
      /initializeApp/i,
      /firestore/i,
      /\.collection\(/i
    ],
    mongodb: [
      /mongodb/i,
      /mongoose/i,
      /\.connect.*mongo/i,
      /new MongoClient/i
    ],
    postgresql: [
      /pg\.|postgres/i,
      /new Pool.*postgres/i,
      /\.query\(/i,
      /SELECT.*FROM/i
    ],
    mysql: [
      /mysql/i,
      /createConnection.*mysql/i,
      /\.query.*SELECT/i,
      /mysql:\/\//i
    ],
    redis: [
      /redis/i,
      /createClient.*redis/i,
      /\.get\(|\.set\(/i,
      /redis:\/\//i
    ],
    prisma: [
      /@prisma\/client/i,
      /new PrismaClient/i,
      /prisma\./i,
      /\.findMany\(|\.create\(/i
    ],
    drizzle: [
      /drizzle-orm/i,
      /drizzle\(/i,
      /\.select\(\)\.from\(/i,
      /eq\(|like\(|gt\(/i
    ],
    express: [
      /express\(\)/i,
      /app\.get\(|app\.post\(/i,
      /req\.|res\./i,
      /middleware/i
    ],
    fastify: [
      /fastify\(/i,
      /\.register\(/i,
      /reply\.send/i,
      /fastify.*plugin/i
    ],
    koa: [
      /new Koa/i,
      /ctx\./i,
      /koa.*router/i,
      /\.use\(.*koa/i
    ],
    nestjs: [
      /@nestjs/i,
      /@Controller\(|@Get\(|@Post\(/i,
      /@Injectable\(/i,
      /NestFactory\.create/i
    ],
    unknown: [/.*/] // Fallback
  };

  /**
   * Analyze a backend file to extract hierarchical structure
   */
  public static analyzeFile(file: BackendFile): BackendFile {
    if (!file.content) {
      return file;
    }

    const functions = this.extractFunctions(file.content, file.path);
    const classes = this.extractClasses(file.content, file.path);
    const codeBlocks = this.extractCriticalCodeBlocks(file.content, file.path);

    return {
      ...file,
      functions,
      classes,
      codeBlocks,
      isExpanded: false, // Start collapsed for better UX
    };
  }

  /**
   * Extract functions and methods from code
   */
  private static extractFunctions(content: string, filePath: string): BackendFunction[] {
    const functions: BackendFunction[] = [];
    const lines = content.split('\n');
    
    // Patterns for different function types
    const patterns = {
      // JavaScript/TypeScript functions
      jsFunction: /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g,
      jsArrowFunction: /(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/g,
      jsMethod: /(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*[{:]/g,
      
      // Express.js routes
      expressRoute: /app\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
      routerRoute: /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g,
      
      // Python functions
      pythonFunction: /def\s+(\w+)\s*\(([^)]*)\):/g,
      pythonAsync: /async\s+def\s+(\w+)\s*\(([^)]*)\):/g,
      
      // PHP functions
      phpFunction: /function\s+(\w+)\s*\(([^)]*)\)/g,
      
      // Go functions
      goFunction: /func\s+(\w+)\s*\(([^)]*)\)/g,
    };

    let functionId = 0;

    // Extract JavaScript/TypeScript functions
    for (const [patternName, pattern] of Object.entries(patterns)) {
      let match;
      pattern.lastIndex = 0; // Reset regex
      
      while ((match = pattern.exec(content)) !== null) {
        const [fullMatch, name, params] = match;
        const startLine = content.substring(0, match.index).split('\n').length;
        
        // Estimate end line (simple heuristic)
        const endLine = this.findFunctionEndLine(content, match.index, startLine);
        
        const func: BackendFunction = {
          id: `${filePath}-func-${functionId++}`,
          name,
          type: this.determineFunctionType(patternName, fullMatch),
          startLine,
          endLine,
          parameters: params ? params.split(',').map(p => p.trim()) : [],
          isAsync: fullMatch.includes('async'),
          isExported: fullMatch.includes('export'),
          httpMethod: this.extractHttpMethod(patternName, match),
          route: this.extractRoute(patternName, match),
          codeBlocks: [],
          calls: [],
        };

        functions.push(func);
      }
    }

    return functions;
  }

  /**
   * Extract classes and interfaces
   */
  private static extractClasses(content: string, filePath: string): BackendClass[] {
    const classes: BackendClass[] = [];
    const patterns = {
      jsClass: /(?:export\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([^{]+))?\s*{/g,
      interface: /(?:export\s+)?interface\s+(\w+)(?:\s+extends\s+([^{]+))?\s*{/g,
      type: /(?:export\s+)?type\s+(\w+)\s*=/g,
    };

    let classId = 0;

    for (const [patternName, pattern] of Object.entries(patterns)) {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(content)) !== null) {
        const [fullMatch, name, extendsClause, implementsClause] = match;
        const startLine = content.substring(0, match.index).split('\n').length;
        const endLine = this.findClassEndLine(content, match.index, startLine);
        
        const cls: BackendClass = {
          id: `${filePath}-class-${classId++}`,
          name,
          type: patternName === 'interface' ? 'interface' : patternName === 'type' ? 'type' : 'class',
          startLine,
          endLine,
          methods: [],
          properties: [],
          extends: extendsClause,
          implements: implementsClause ? implementsClause.split(',').map(i => i.trim()) : [],
          isExported: fullMatch.includes('export'),
        };

        classes.push(cls);
      }
    }

    return classes;
  }

  /**
   * Extract critical code blocks (API calls, DB operations, etc.)
   */
  private static extractCriticalCodeBlocks(content: string, filePath: string): CodeBlock[] {
    const codeBlocks: CodeBlock[] = [];
    const lines = content.split('\n');
    let blockId = 0;

    // Analyze each line for critical operations
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('*')) {
        return; // Skip empty lines and comments
      }

      // Check for third-party API calls
      for (const [provider, patterns] of Object.entries(this.THIRD_PARTY_PATTERNS)) {
        if (provider === 'unknown') continue;
        
        for (const pattern of patterns) {
          if (pattern.test(trimmedLine)) {
            const block: CodeBlock = {
              id: `${filePath}-block-${blockId++}`,
              type: 'third_party',
              provider: provider as ThirdPartyProvider,
              startLine: lineNumber,
              endLine: lineNumber,
              code: trimmedLine,
              description: `${provider} integration`,
              importance: this.determineImportance(provider as ThirdPartyProvider, trimmedLine),
            };
            
            codeBlocks.push(block);
            break; // Only match first pattern per line
          }
        }
      }

      // Check for database operations
      if (this.isDatabaseOperation(trimmedLine)) {
        const block: CodeBlock = {
          id: `${filePath}-block-${blockId++}`,
          type: 'db_query',
          startLine: lineNumber,
          endLine: lineNumber,
          code: trimmedLine,
          description: 'Database operation',
          importance: 'high',
        };
        codeBlocks.push(block);
      }

      // Check for authentication operations
      if (this.isAuthOperation(trimmedLine)) {
        const block: CodeBlock = {
          id: `${filePath}-block-${blockId++}`,
          type: 'auth_check',
          startLine: lineNumber,
          endLine: lineNumber,
          code: trimmedLine,
          description: 'Authentication check',
          importance: 'critical',
        };
        codeBlocks.push(block);
      }

      // Check for file operations
      if (this.isFileOperation(trimmedLine)) {
        const block: CodeBlock = {
          id: `${filePath}-block-${blockId++}`,
          type: 'file_operation',
          startLine: lineNumber,
          endLine: lineNumber,
          code: trimmedLine,
          description: 'File system operation',
          importance: 'medium',
        };
        codeBlocks.push(block);
      }
    });

    return codeBlocks;
  }

  /**
   * Generate enhanced relationships including function calls
   */
  public static generateEnhancedRelationships(files: BackendFile[]): FileRelationship[] {
    const relationships: FileRelationship[] = [];
    let relId = 0;

    for (const file of files) {
      // File-level import relationships (existing)
      for (const importPath of file.imports) {
        const targetFile = files.find(f => 
          f.path.includes(importPath) || f.name === importPath
        );
        
        if (targetFile) {
          relationships.push({
            id: `rel-${relId++}`,
            sourceId: file.id,
            targetId: targetFile.id,
            type: 'import',
            label: 'imports',
          });
        }
      }

      // Function-level relationships
      if (file.functions) {
        for (const func of file.functions) {
          if (func.calls) {
            for (const call of func.calls) {
              if (call.isExternal && call.filePath) {
                const targetFile = files.find(f => f.path === call.filePath);
                if (targetFile) {
                  relationships.push({
                    id: `rel-${relId++}`,
                    sourceId: file.id,
                    targetId: targetFile.id,
                    type: 'function_call',
                    label: `calls ${call.functionName}`,
                    sourceFunction: func.name,
                    targetFunction: call.functionName,
                  });
                }
              }
            }
          }
        }
      }

      // API call relationships
      if (file.codeBlocks) {
        for (const block of file.codeBlocks) {
          if (block.type === 'third_party' && block.provider) {
            // Create virtual relationship to represent external API dependency
            relationships.push({
              id: `rel-${relId++}`,
              sourceId: file.id,
              targetId: `external-${block.provider}`,
              type: 'api_call',
              label: `uses ${block.provider}`,
            });
          }
        }
      }
    }

    return relationships;
  }

  // Helper methods
  private static findFunctionEndLine(content: string, startIndex: number, startLine: number): number {
    // Simple heuristic: find matching braces
    let braceCount = 0;
    let inFunction = false;
    
    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];
      
      if (char === '{') {
        braceCount++;
        inFunction = true;
      } else if (char === '}') {
        braceCount--;
        if (inFunction && braceCount === 0) {
          return content.substring(0, i).split('\n').length;
        }
      }
    }
    
    return startLine + 10; // Fallback
  }

  private static findClassEndLine(content: string, startIndex: number, startLine: number): number {
    return this.findFunctionEndLine(content, startIndex, startLine);
  }

  private static determineFunctionType(patternName: string, fullMatch: string): BackendFunction['type'] {
    if (patternName.includes('Route') || patternName.includes('express')) {
      return 'endpoint';
    }
    if (fullMatch.includes('middleware')) {
      return 'middleware';
    }
    if (fullMatch.includes('method')) {
      return 'method';
    }
    return 'function';
  }

  private static extractHttpMethod(patternName: string, match: RegExpExecArray): BackendFunction['httpMethod'] {
    if (patternName.includes('Route') || patternName.includes('express')) {
      const method = match[1]?.toUpperCase();
      if (['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        return method as BackendFunction['httpMethod'];
      }
    }
    return undefined;
  }

  private static extractRoute(patternName: string, match: RegExpExecArray): string | undefined {
    if (patternName.includes('Route') || patternName.includes('express')) {
      return match[2]; // Route path
    }
    return undefined;
  }

  private static determineImportance(provider: ThirdPartyProvider, code: string): CodeBlock['importance'] {
    // Critical: Authentication, payment, security
    if (['stripe', 'auth', 'jwt', 'passport'].some(keyword => 
      code.toLowerCase().includes(keyword))) {
      return 'critical';
    }
    
    // High: Database, core APIs
    if (['supabase', 'mongodb', 'postgresql', 'mysql', 'prisma', 'drizzle'].includes(provider)) {
      return 'high';
    }
    
    // Medium: Communication, storage
    if (['slack', 'discord', 'sendgrid', 'twilio', 'aws', 'gcp'].includes(provider)) {
      return 'medium';
    }
    
    return 'low';
  }

  private static isDatabaseOperation(line: string): boolean {
    const dbPatterns = [
      /SELECT.*FROM/i,
      /INSERT.*INTO/i,
      /UPDATE.*SET/i,
      /DELETE.*FROM/i,
      /\.find\(|\.findOne\(|\.findMany\(/i,
      /\.create\(|\.update\(|\.delete\(/i,
      /\.query\(/i,
      /\.exec\(\)/i,
    ];
    
    return dbPatterns.some(pattern => pattern.test(line));
  }

  private static isAuthOperation(line: string): boolean {
    const authPatterns = [
      /jwt\.|jsonwebtoken/i,
      /passport\./i,
      /auth|authenticate|authorize/i,
      /verify.*token/i,
      /login|logout|signin|signup/i,
      /bcrypt|hash.*password/i,
    ];
    
    return authPatterns.some(pattern => pattern.test(line));
  }

  private static isFileOperation(line: string): boolean {
    const filePatterns = [
      /fs\.|filesystem/i,
      /readFile|writeFile|createFile/i,
      /\.read\(|\.write\(|\.create\(/i,
      /multer|upload/i,
      /path\.join|path\.resolve/i,
    ];
    
    return filePatterns.some(pattern => pattern.test(line));
  }
}

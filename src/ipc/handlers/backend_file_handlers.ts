import { ipcMain } from 'electron';
import { getTernaryAppPath } from '../../paths/paths';
import { BackendFileScanner } from '../../services/backendFileScanner';
import { BackendFileAnalysis } from '../../types/backendFile';

/**
 * IPC handlers for backend file operations
 */

export function registerBackendFileHandlers() {
  // Scan backend files in a project
  ipcMain.handle('backend-files:scan', async (event, appPath: string): Promise<BackendFileAnalysis> => {
    try {
      console.log('🔍 IPC: Scanning backend files for app:', appPath);
      
      // Convert app path to full local storage path
      const fullPath = getTernaryAppPath(appPath);
      console.log('📁 IPC: Full project path:', fullPath);
      
      // Create scanner and scan files
      const scanner = new BackendFileScanner(fullPath);
      const analysis = await scanner.scanProject();
      
      console.log(`✅ IPC: Scan completed - ${analysis.files.length} files, ${analysis.relationships.length} relationships`);
      
      return analysis;
    } catch (error) {
      console.error('❌ IPC: Error scanning backend files:', error);
      throw error;
    }
  });

  // Save a backend file
  ipcMain.handle('backend-files:save', async (event, filePath: string, content: string): Promise<void> => {
    try {
      const fs = await import('fs');
      await fs.promises.writeFile(filePath, content, 'utf-8');
      console.log('💾 IPC: File saved:', filePath);
    } catch (error) {
      console.error('❌ IPC: Error saving file:', error);
      throw error;
    }
  });

  // Read a backend file
  ipcMain.handle('backend-files:read', async (event, filePath: string): Promise<string> => {
    try {
      const fs = await import('fs');
      const content = await fs.promises.readFile(filePath, 'utf-8');
      console.log('📖 IPC: File read:', filePath);
      return content;
    } catch (error) {
      console.error('❌ IPC: Error reading file:', error);
      throw error;
    }
  });
}

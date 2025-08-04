import { BackendFileScanner } from '../../services/backendFileScanner';
import { getTernaryAppPath } from '../../paths/paths';
import { BackendFileAnalysis } from '../../types/backendFile';
import log from "electron-log";
import * as fs from 'fs';

const logger = log.scope("backend_file_utils");

/**
 * Scan backend files in a project directory
 */
export async function scanBackendFiles(appPath: string): Promise<BackendFileAnalysis> {
  logger.log(`Scanning backend files for app: ${appPath}`);
  
  const fullPath = getTernaryAppPath(appPath);
  logger.log(`Full path resolved to: ${fullPath}`);
  
  const scanner = new BackendFileScanner(fullPath);
  const analysis = await scanner.scanProject();
  
  logger.log(`Scan completed - ${analysis.files.length} files, ${analysis.relationships.length} relationships`);
  
  return analysis;
}

/**
 * Save content to a backend file
 */
export async function saveBackendFile(filePath: string, content: string): Promise<void> {
  logger.log(`Saving file: ${filePath}`);
  
  await fs.promises.writeFile(filePath, content, 'utf-8');
  
  logger.log(`File saved successfully: ${filePath}`);
}

/**
 * Read content from a backend file
 */
export async function readBackendFile(filePath: string): Promise<string> {
  logger.log(`Reading file: ${filePath}`);
  
  const content = await fs.promises.readFile(filePath, 'utf-8');
  
  logger.log(`File read successfully: ${filePath}`);
  
  return content;
}

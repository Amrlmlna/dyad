import { createLoggedHandler } from "./safe_handle";
import log from "electron-log";
import { 
  scanBackendFiles, 
  saveBackendFile, 
  readBackendFile 
} from "../utils/backend_file_utils";
import { BackendFileAnalysis } from '../../types/backendFile';

const logger = log.scope("backend_file_handlers");
const handle = createLoggedHandler(logger);

export function registerBackendFileHandlers() {
  handle("backend-test", async (): Promise<{ success: boolean; message: string }> => {
    return { success: true, message: 'Backend handlers are working!' };
  });

  handle("backend-files:scan", async (event, appPath: string): Promise<BackendFileAnalysis> => {
    return await scanBackendFiles(appPath);
  });

  handle("backend-files:save", async (event, filePath: string, content: string): Promise<void> => {
    return await saveBackendFile(filePath, content);
  });

  handle("backend-files:read", async (event, filePath: string): Promise<string> => {
    return await readBackendFile(filePath);
  });
}

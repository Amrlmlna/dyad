  ipcMain.handle("createWorkflow", async (event, workflow: any) => {
    const db = initializeDatabase();
    const [created] = await db.insert(workflows).values(workflow).returning();
    return created;
  });

  ipcMain.handle("updateWorkflow", async (event, id: number, updates: any) => {
    const db = initializeDatabase();
    const [updated] = await db.update(workflows).set(updates).where(eq(workflows.id, id)).returning();
    return updated;
  });
import { ipcMain } from "electron";
import { workflows } from "../../db/schema";
import { initializeDatabase } from "../../db";
import { eq } from "drizzle-orm";

// Handler: Get all workflows
export function registerWorkflowHandlers() {
  ipcMain.handle("getAllWorkflows", async () => {
    const db = initializeDatabase();
    // Get all workflows from DB
    const rows = await db.select().from(workflows);
    // Return as array
    return rows;
  });

  ipcMain.handle("deleteWorkflow", async (event, id: number) => {
    const db = initializeDatabase();
    await db.delete(workflows).where(eq(workflows.id, id));
    return { success: true };
  });
}

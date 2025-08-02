// workflowStorage.ts
// Implements workflow CRUD, versioning, and metadata logic using drizzle ORM and SQLite
import { workflows } from "../db/schema";
import { sql } from "drizzle-orm";
import { db } from "../db/index";

export class WorkflowStorage {
  async getAllWorkflows(): Promise<any[]> {
    return db.select().from(workflows).all();
  }

  async getWorkflow(id: number): Promise<any | null> {
    // Use SQL template for where clause
    const result = db
      .select()
      .from(workflows)
      .where(sql`id = ${id}`)
      .get();
    return result || null;
  }

  async saveWorkflow(workflow: any): Promise<any> {
    const now = new Date();
    if (workflow.id) {
      await db
        .update(workflows)
        .set({
          name: workflow.name,
          description: workflow.description,
          data: workflow.data,
          updatedAt: now,
          tags: workflow.tags,
          metadata: workflow.metadata,
        })
        .where(sql`id = ${workflow.id}`)
        .run();
      return workflow.id;
    } else {
      const inserted = await db
        .insert(workflows)
        .values({
          name: workflow.name,
          description: workflow.description || "",
          data: workflow.data || "{}",
          createdAt: now,
          updatedAt: now,
          tags: workflow.tags || "[]",
          metadata: workflow.metadata || "{}",
        })
        .run();
      return inserted.lastInsertRowid;
    }
  }

  async deleteWorkflow(id: number): Promise<void> {
    await db
      .delete(workflows)
      .where(sql`id = ${id}`)
      .run();
  }

  async updateWorkflow(id: number, updates: any): Promise<void> {
    await db
      .update(workflows)
      .set(updates)
      .where(sql`id = ${id}`)
      .run();
  }
}

export const workflowStorage = new WorkflowStorage();
// This class provides methods to interact with the workflows table in the database,

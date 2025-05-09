import { projects, type Project, type InsertProject } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private currentId: number;

  constructor() {
    this.projects = new Map();
    this.currentId = 1;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }
}

// Export a singleton instance
export const storage = new MemStorage();

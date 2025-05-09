import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { projectConfigSchema } from "@shared/schema";
import { generateSpringBootProject } from "./projectGenerator";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to generate spring boot project
  app.post("/api/projects/generate", async (req, res) => {
    try {
      // Validate the project configuration
      const projectConfig = projectConfigSchema.parse(req.body);
      
      // Save the project configuration (optional, for future reference)
      const savedProject = await storage.createProject({
        ...projectConfig,
        createdAt: new Date().toISOString()
      });
      
      // Generate the Spring Boot project as a zip file
      const zipBuffer = await generateSpringBootProject(projectConfig);
      
      // Set appropriate headers for file download
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename=${projectConfig.artifactId}.zip`);
      
      // Send the zip file
      res.send(zipBuffer);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid project configuration", 
          errors: error.errors 
        });
      }
      
      console.error("Error generating project:", error);
      res.status(500).json({ 
        message: "Failed to generate project", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Endpoint to get saved project by ID (for future implementations)
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ 
        message: "Failed to fetch project", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Project configuration model
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  groupId: text("group_id").notNull(),
  artifactId: text("artifact_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  javaVersion: text("java_version").notNull(),
  springBootVersion: text("spring_boot_version").notNull(),
  packageType: text("package_type").notNull(),
  dependencies: jsonb("dependencies").notNull(),
  database: jsonb("database").notNull(),
  entities: jsonb("entities").notNull(),
  relationships: jsonb("relationships").notNull(),
  generationOptions: jsonb("generation_options").notNull(),
  createdAt: text("created_at").notNull()
});

// Project insert schema
export const insertProjectSchema = createInsertSchema(projects).pick({
  groupId: true,
  artifactId: true,
  name: true,
  description: true,
  javaVersion: true,
  springBootVersion: true,
  packageType: true,
  dependencies: true,
  database: true,
  entities: true,
  relationships: true,
  generationOptions: true,
  createdAt: true
});

// Define type for project configuration
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Define the expected project configuration received from client
export const projectConfigSchema = z.object({
  groupId: z.string(),
  artifactId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  javaVersion: z.enum(["18", "20", "21"]),
  springBootVersion: z.enum(["2.7.17", "3.0.12", "3.1.5"]),
  packageType: z.enum(["jar", "war"]),
  dependencies: z.array(z.object({
    id: z.string(),
    name: z.string(),
    selected: z.boolean()
  })),
  database: z.object({
    type: z.enum(["postgresql", "mysql", "mongodb", "h2", "oracle", "mssql"]).nullable(),
    options: z.object({
      url: z.string(),
      name: z.string(),
      username: z.string(),
      password: z.string(),
      generateDdl: z.boolean(),
      showSql: z.boolean(),
      connectionPool: z.boolean()
    })
  }),
  entities: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    fields: z.array(z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(["Long", "Integer", "String", "Boolean", "LocalDate", "LocalDateTime", "BigDecimal", "Double"]),
      constraints: z.array(z.string())
    }))
  })),
  relationships: z.array(z.object({
    id: z.string(),
    sourceEntityId: z.string(),
    targetEntityId: z.string(), 
    type: z.enum(["@OneToOne", "@OneToMany", "@ManyToOne", "@ManyToMany"]),
    fieldName: z.string()
  })),
  generationOptions: z.object({
    controllers: z.boolean(),
    services: z.boolean(),
    repositories: z.boolean(),
    dtos: z.boolean(),
    docker: z.boolean(),
    dockerCompose: z.boolean(),
    readme: z.boolean(),
    gitignore: z.boolean(),
    documentation: z.enum(["none", "swagger", "springdoc"])
  }),
  currentStep: z.number().optional()
});

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

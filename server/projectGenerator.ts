import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import AdmZip from 'adm-zip';
import { ProjectConfig } from '@shared/schema';
import {
  compileTemplate,
  generatePackageName,
  generateApplicationClassName,
  getEntityIdType,
  processRelationshipsForEntity,
  hasLombok,
  camelCase,
  hasTimestamps,
  generateReadmeContent,
  generateGitignoreContent,
  generateDockerfileContent,
  generateDockerComposeContent
} from './templateEngine';

export async function generateSpringBootProject(projectConfig: ProjectConfig): Promise<Buffer> {
  // Create temp directory
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'spring-boot-project-'));
  const zip = new AdmZip();
  
  try {
    // Create base project structure
    const packageName = generatePackageName(projectConfig);
    const applicationClassName = generateApplicationClassName(projectConfig);
    const packagePath = packageName.replace(/\./g, '/');
    
    // Create directory structure
    await fs.mkdir(path.join(tempDir, 'src', 'main', 'java', packagePath), { recursive: true });
    await fs.mkdir(path.join(tempDir, 'src', 'main', 'resources'), { recursive: true });
    await fs.mkdir(path.join(tempDir, 'src', 'test', 'java', packagePath), { recursive: true });
    
    // If controllers, services, repositories, or entities are needed
    if (projectConfig.generationOptions.controllers) {
      await fs.mkdir(path.join(tempDir, 'src', 'main', 'java', packagePath, 'controller'), { recursive: true });
    }
    if (projectConfig.generationOptions.services) {
      await fs.mkdir(path.join(tempDir, 'src', 'main', 'java', packagePath, 'service'), { recursive: true });
    }
    if (projectConfig.generationOptions.repositories) {
      await fs.mkdir(path.join(tempDir, 'src', 'main', 'java', packagePath, 'repository'), { recursive: true });
    }
    await fs.mkdir(path.join(tempDir, 'src', 'main', 'java', packagePath, 'entity'), { recursive: true });
    
    if (projectConfig.generationOptions.dtos) {
      await fs.mkdir(path.join(tempDir, 'src', 'main', 'java', packagePath, 'dto'), { recursive: true });
    }

    // Generate pom.xml
    const pomXml = compileTemplate('pom.xml', {
      ...projectConfig,
      hasLombok: hasLombok(projectConfig)
    });
    await fs.writeFile(path.join(tempDir, 'pom.xml'), pomXml);
    
    // Generate application.properties
    const applicationProps = compileTemplate('application.properties', projectConfig);
    await fs.writeFile(path.join(tempDir, 'src', 'main', 'resources', 'application.properties'), applicationProps);
    
    // Generate main application class
    const applicationClass = compileTemplate('application', {
      packageName,
      applicationClassName,
      generationOptions: projectConfig.generationOptions
    });
    await fs.writeFile(
      path.join(tempDir, 'src', 'main', 'java', packagePath, `${applicationClassName}.java`),
      applicationClass
    );
    
    // Generate entities, repositories, services, controllers
    for (const entity of projectConfig.entities) {
      const entityNameLower = camelCase(entity.name);
      const isMongoDb = projectConfig.database.type === 'mongodb';
      const idType = getEntityIdType(entity);
      const entityRelationships = processRelationshipsForEntity(
        entity, 
        projectConfig.relationships, 
        projectConfig.entities
      );
      const useTimestamps = hasTimestamps(entity);
      
      // Generate entity class
      const entityClass = compileTemplate('entity', {
        packageName,
        entityName: entity.name,
        fields: entity.fields,
        isMongoDb,
        collectionName: entityNameLower + 's',
        tableName: entityNameLower + 's',
        hasLombok: hasLombok(projectConfig),
        hasTimestamps: useTimestamps,
        relationships: entityRelationships
      });
      await fs.writeFile(
        path.join(tempDir, 'src', 'main', 'java', packagePath, 'entity', `${entity.name}.java`),
        entityClass
      );
      
      // Generate repository
      if (projectConfig.generationOptions.repositories) {
        const repositoryClass = compileTemplate('repository', {
          packageName,
          entityName: entity.name,
          isMongoDb,
          idType
        });
        await fs.writeFile(
          path.join(tempDir, 'src', 'main', 'java', packagePath, 'repository', `${entity.name}Repository.java`),
          repositoryClass
        );
      }
      
      // Generate service
      if (projectConfig.generationOptions.services) {
        const serviceClass = compileTemplate('service', {
          packageName,
          entityName: entity.name,
          entityNameLower,
          idType,
          hasDtos: projectConfig.generationOptions.dtos
        });
        await fs.writeFile(
          path.join(tempDir, 'src', 'main', 'java', packagePath, 'service', `${entity.name}Service.java`),
          serviceClass
        );
      }
      
      // Generate controller
      if (projectConfig.generationOptions.controllers) {
        const controllerClass = compileTemplate('controller', {
          packageName,
          entityName: entity.name,
          entityNameLower,
          idType,
          hasDtos: projectConfig.generationOptions.dtos
        });
        await fs.writeFile(
          path.join(tempDir, 'src', 'main', 'java', packagePath, 'controller', `${entity.name}Controller.java`),
          controllerClass
        );
      }
    }
    
    // Generate README.md if requested
    if (projectConfig.generationOptions.readme) {
      const readmeContent = generateReadmeContent(projectConfig);
      await fs.writeFile(path.join(tempDir, 'README.md'), readmeContent);
    }
    
    // Generate .gitignore if requested
    if (projectConfig.generationOptions.gitignore) {
      const gitignoreContent = generateGitignoreContent();
      await fs.writeFile(path.join(tempDir, '.gitignore'), gitignoreContent);
    }
    
    // Generate Dockerfile if requested
    if (projectConfig.generationOptions.docker) {
      const dockerfileContent = generateDockerfileContent(projectConfig);
      await fs.writeFile(path.join(tempDir, 'Dockerfile'), dockerfileContent);
    }
    
    // Generate docker-compose.yml if requested
    if (projectConfig.generationOptions.dockerCompose) {
      const dockerComposeContent = generateDockerComposeContent(projectConfig);
      await fs.writeFile(path.join(tempDir, 'docker-compose.yml'), dockerComposeContent);
    }
    
    // Add Maven wrapper files
    await fs.writeFile(path.join(tempDir, 'mvnw'), '#!/bin/sh\n# Maven wrapper script');
    await fs.writeFile(path.join(tempDir, 'mvnw.cmd'), '@REM Maven wrapper script for Windows');
    await fs.mkdir(path.join(tempDir, '.mvn', 'wrapper'), { recursive: true });
    await fs.writeFile(path.join(tempDir, '.mvn', 'wrapper', 'maven-wrapper.jar'), 'Binary JAR content placeholder');
    await fs.writeFile(path.join(tempDir, '.mvn', 'wrapper', 'maven-wrapper.properties'), 'distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.8.6/apache-maven-3.8.6-bin.zip');
    
    // Add everything to zip
    await addDirectoryToZip(zip, tempDir, '');
    
    return zip.toBuffer();
  } finally {
    // Clean up temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Failed to clean up temp directory:', error);
    }
  }
}

// Helper function to recursively add directory contents to zip
async function addDirectoryToZip(zip: AdmZip, dirPath: string, zipPath: string): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const zipEntryPath = path.join(zipPath, entry.name);
    
    if (entry.isDirectory()) {
      await addDirectoryToZip(zip, fullPath, zipEntryPath);
    } else {
      const content = await fs.readFile(fullPath);
      zip.addFile(zipEntryPath, content);
    }
  }
}

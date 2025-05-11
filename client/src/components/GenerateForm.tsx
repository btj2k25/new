import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { apiRequest } from '@/lib/queryClient';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { MaterialIcon } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GenerateForm: React.FC = () => {
  const { project, updateProjectField } = useProject();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const handleGenerationOptionChange = (field: string, value: any) => {
    updateProjectField('generationOptions', {
      ...project.generationOptions,
      [field]: value
    });
  };

  const generateProject = async () => {
    setIsGenerating(true);
    
    try {
      const response = await apiRequest('POST', '/api/projects/generate', project);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.artifactId}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        
        toast({
          title: "Project Generated Successfully",
          description: "Your Spring Boot project has been downloaded.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPreview = () => {
    switch (activeTab) {
      case 'entity':
        return project.entities.map(entity => (
          <div key={entity.id} className="mb-6">
            <h4 className="text-lg font-medium mb-2">{entity.name}.java</h4>
            <pre className="preview-code">
              {`@Entity
public class ${entity.name} {
    ${entity.fields.map(field => 
      `${field.constraints.join('\n    ')}
    private ${field.type} ${field.name};`
    ).join('\n\n    ')}
}`}
            </pre>
          </div>
        ));
      
      case 'config':
        return (
          <div>
            <h4 className="text-lg font-medium mb-2">application.properties</h4>
            <pre className="preview-code">
              {`spring.application.name=${project.artifactId}
server.port=8080
${project.database.type ? `
# Database Configuration
spring.datasource.url=${project.database.options.url}
spring.datasource.username=${project.database.options.username}
spring.datasource.password=********` : ''}
${project.generationOptions.documentation !== 'none' ? `
# API Documentation
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html` : ''}`}
            </pre>
          </div>
        );
      
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Project Details</h4>
              <div className="mt-2 space-y-1">
                <p className="text-sm"><span className="text-muted-foreground">Group ID:</span> <span>{project.groupId}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Artifact ID:</span> <span>{project.artifactId}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Java Version:</span> <span>Java {project.javaVersion}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Spring Boot:</span> <span>{project.springBootVersion}</span></p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Database</h4>
              <div className="mt-2 space-y-1">
                <p className="text-sm"><span className="text-muted-foreground">Type:</span> <span>{project.database.type ?? 'None'}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Name:</span> <span>{project.database.options.name || 'N/A'}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Entities:</span> <span>{project.entities.length}</span></p>
                <p className="text-sm"><span className="text-muted-foreground">Relationships:</span> <span>{project.relationships.length}</span></p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div data-step="4" className="block">
      <h2 className="text-xl font-medium mb-6 text-foreground">Generate & Download</h2>
      
      <Tabs defaultValue="summary" className="mb-6">
        <TabsList>
          <TabsTrigger value="summary">Project Summary</TabsTrigger>
          <TabsTrigger value="entity">Entity Preview</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="preview-container">
          {renderPreview()}
        </TabsContent>
        
        <TabsContent value="entity" className="preview-container">
          {renderPreview()}
        </TabsContent>
        
        <TabsContent value="config" className="preview-container">
          {renderPreview()}
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card p-4 border rounded-lg">
          <h4 className="text-sm font-medium mb-2">Project Structure</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox 
                id="genController" 
                checked={project.generationOptions.controllers}
                onCheckedChange={(checked) => handleGenerationOptionChange('controllers', checked as boolean)}
              />
              <Label htmlFor="genController" className="ml-2 text-sm">Generate Controllers</Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="genService" 
                checked={project.generationOptions.services}
                onCheckedChange={(checked) => handleGenerationOptionChange('services', checked as boolean)}
              />
              <Label htmlFor="genService" className="ml-2 text-sm">Generate Services</Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="genRepository" 
                checked={project.generationOptions.repositories}
                onCheckedChange={(checked) => handleGenerationOptionChange('repositories', checked as boolean)}
              />
              <Label htmlFor="genRepository" className="ml-2 text-sm">Generate Repositories</Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="genDto" 
                checked={project.generationOptions.dtos}
                onCheckedChange={(checked) => handleGenerationOptionChange('dtos', checked as boolean)}
              />
              <Label htmlFor="genDto" className="ml-2 text-sm">Generate DTOs</Label>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 border rounded-lg">
          <h4 className="text-sm font-medium mb-2">Additional Files</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <Checkbox 
                id="genDocker" 
                checked={project.generationOptions.docker}
                onCheckedChange={(checked) => handleGenerationOptionChange('docker', checked as boolean)}
              />
              <Label htmlFor="genDocker" className="ml-2 text-sm">Include Dockerfile</Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="genDockerCompose" 
                checked={project.generationOptions.dockerCompose}
                onCheckedChange={(checked) => handleGenerationOptionChange('dockerCompose', checked as boolean)}
              />
              <Label htmlFor="genDockerCompose" className="ml-2 text-sm">Include Docker Compose</Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="genReadme" 
                checked={project.generationOptions.readme}
                onCheckedChange={(checked) => handleGenerationOptionChange('readme', checked as boolean)}
              />
              <Label htmlFor="genReadme" className="ml-2 text-sm">Generate README.md</Label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="genGitignore" 
                checked={project.generationOptions.gitignore}
                onCheckedChange={(checked) => handleGenerationOptionChange('gitignore', checked as boolean)}
              />
              <Label htmlFor="genGitignore" className="ml-2 text-sm">Include .gitignore</Label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card p-4 border rounded-lg mb-8">
        <h4 className="text-sm font-medium mb-2">API Documentation</h4>
        <RadioGroup 
          value={project.generationOptions.documentation} 
          onValueChange={(value) => handleGenerationOptionChange('documentation', value)}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center">
            <RadioGroupItem value="none" id="docNone" />
            <Label htmlFor="docNone" className="ml-2 text-sm">None</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="swagger" id="docSwagger" />
            <Label htmlFor="docSwagger" className="ml-2 text-sm">Swagger/OpenAPI</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="springdoc" id="docSpringdoc" />
            <Label htmlFor="docSpringdoc" className="ml-2 text-sm">SpringDoc</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="bg-primary/5 rounded-lg p-6 border border-primary/20 text-center">
        <h3 className="font-medium text-lg mb-2">Ready to Generate Your Project</h3>
        <p className="text-muted-foreground mb-6">Your Spring Boot application will be generated based on the configurations you've set.</p>
        
        <Button
          onClick={generateProject}
          disabled={isGenerating}
          className="px-8 py-3 bg-primary text-primary-foreground text-base font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md transition-all duration-200 flex items-center mx-auto"
        >
          {isGenerating ? (
            <>
              <MaterialIcon name="autorenew" className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <MaterialIcon name="downloading" className="w-5 h-5 mr-2" />
              Generate & Download
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GenerateForm;
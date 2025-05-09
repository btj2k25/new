import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { apiRequest } from '@/lib/queryClient';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { MaterialIcon } from '@/lib/icons';
import { useToast } from '@/hooks/use-toast';

const GenerateForm: React.FC = () => {
  const { project, updateProjectField } = useProject();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

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
      
      // Start download if generation was successful
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

  return (
    <div data-step="4" className="block">
      <h2 className="text-xl font-medium mb-6 text-[#212121]">Generate & Download</h2>
      
      {/* Project Summary Section */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-medium mb-4">Project Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <h4 className="text-sm font-medium text-[#757575]">Project Details</h4>
            <div className="mt-2 space-y-1">
              <p className="text-sm"><span className="text-[#757575]">Group ID:</span> <span>{project.groupId}</span></p>
              <p className="text-sm"><span className="text-[#757575]">Artifact ID:</span> <span>{project.artifactId}</span></p>
              <p className="text-sm"><span className="text-[#757575]">Java Version:</span> <span>Java {project.javaVersion}</span></p>
              <p className="text-sm"><span className="text-[#757575]">Spring Boot:</span> <span>{project.springBootVersion}</span></p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-[#757575]">Database</h4>
            <div className="mt-2 space-y-1">
              <p className="text-sm"><span className="text-[#757575]">Type:</span> <span>{project.database.type ?? 'None'}</span></p>
              <p className="text-sm"><span className="text-[#757575]">Name:</span> <span>{project.database.options.name || 'N/A'}</span></p>
              <p className="text-sm"><span className="text-[#757575]">Entities:</span> <span>{project.entities.length}</span></p>
              <p className="text-sm"><span className="text-[#757575]">Relationships:</span> <span>{project.relationships.length}</span></p>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-sm font-medium text-[#757575]">Dependencies</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {project.dependencies
                .filter(dep => dep.selected)
                .map(dep => (
                  <span key={dep.id} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-primary">
                    {dep.name}
                  </span>
                ))}
              {project.database.type && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-primary">
                  {project.database.type} Driver
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Generation Options */}
      <div className="mb-6">
        <h3 className="font-medium mb-4">Generation Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 border rounded-lg">
            <h4 className="text-sm font-medium mb-2">Project Structure</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="genController" 
                  checked={project.generationOptions.controllers}
                  onCheckedChange={(checked) => handleGenerationOptionChange('controllers', checked as boolean)}
                />
                <Label htmlFor="genController" className="ml-2 text-sm text-[#212121]">Generate Controllers</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="genService" 
                  checked={project.generationOptions.services}
                  onCheckedChange={(checked) => handleGenerationOptionChange('services', checked as boolean)}
                />
                <Label htmlFor="genService" className="ml-2 text-sm text-[#212121]">Generate Services</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="genRepository" 
                  checked={project.generationOptions.repositories}
                  onCheckedChange={(checked) => handleGenerationOptionChange('repositories', checked as boolean)}
                />
                <Label htmlFor="genRepository" className="ml-2 text-sm text-[#212121]">Generate Repositories</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="genDto" 
                  checked={project.generationOptions.dtos}
                  onCheckedChange={(checked) => handleGenerationOptionChange('dtos', checked as boolean)}
                />
                <Label htmlFor="genDto" className="ml-2 text-sm text-[#212121]">Generate DTOs</Label>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 border rounded-lg">
            <h4 className="text-sm font-medium mb-2">Additional Files</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="genDocker" 
                  checked={project.generationOptions.docker}
                  onCheckedChange={(checked) => handleGenerationOptionChange('docker', checked as boolean)}
                />
                <Label htmlFor="genDocker" className="ml-2 text-sm text-[#212121]">Include Dockerfile</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="genDockerCompose" 
                  checked={project.generationOptions.dockerCompose}
                  onCheckedChange={(checked) => handleGenerationOptionChange('dockerCompose', checked as boolean)}
                />
                <Label htmlFor="genDockerCompose" className="ml-2 text-sm text-[#212121]">Include Docker Compose</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="genReadme" 
                  checked={project.generationOptions.readme}
                  onCheckedChange={(checked) => handleGenerationOptionChange('readme', checked as boolean)}
                />
                <Label htmlFor="genReadme" className="ml-2 text-sm text-[#212121]">Generate README.md</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="genGitignore" 
                  checked={project.generationOptions.gitignore}
                  onCheckedChange={(checked) => handleGenerationOptionChange('gitignore', checked as boolean)}
                />
                <Label htmlFor="genGitignore" className="ml-2 text-sm text-[#212121]">Include .gitignore</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="text-sm font-medium mb-2">API Documentation</h4>
          <RadioGroup 
            value={project.generationOptions.documentation} 
            onValueChange={(value) => handleGenerationOptionChange('documentation', value)}
            className="flex items-center space-x-4"
          >
            <div className="flex items-center">
              <RadioGroupItem value="none" id="docNone" />
              <Label htmlFor="docNone" className="ml-2 text-sm text-[#212121]">None</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="swagger" id="docSwagger" />
              <Label htmlFor="docSwagger" className="ml-2 text-sm text-[#212121]">Swagger/OpenAPI</Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem value="springdoc" id="docSpringdoc" />
              <Label htmlFor="docSpringdoc" className="ml-2 text-sm text-[#212121]">SpringDoc</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      {/* Generation Action Section */}
      <div className="bg-primary bg-opacity-5 rounded-lg p-6 border border-primary border-opacity-20 text-center">
        <h3 className="font-medium text-lg mb-2">Ready to Generate Your Project</h3>
        <p className="text-[#757575] mb-6">Your Spring Boot application will be generated based on the configurations you've set.</p>
        
        <Button
          onClick={generateProject}
          disabled={isGenerating}
          className="px-8 py-3 bg-primary text-white text-base font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md transition-all duration-200 flex items-center mx-auto"
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

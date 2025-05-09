import React from 'react';
import { useProject, JavaVersion, SpringBootVersion, PackageType, Dependency } from '@/contexts/ProjectContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const ProjectConfigForm: React.FC = () => {
  const { project, updateProjectField } = useProject();
  
  const handleDependencyChange = (id: string, checked: boolean) => {
    const updatedDependencies = project.dependencies.map(dep => 
      dep.id === id ? { ...dep, selected: checked } : dep
    );
    updateProjectField('dependencies', updatedDependencies);
  };

  return (
    <div data-step="1" className="block">
      <h2 className="text-xl font-medium mb-6 text-[#212121]">Project Setup</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Info Section */}
        <div className="space-y-4">
          <div className="form-group">
            <Label htmlFor="groupId" className="block text-sm font-medium text-[#757575] mb-1">Group ID</Label>
            <Input 
              type="text" 
              id="groupId" 
              placeholder="com.example" 
              value={project.groupId}
              onChange={(e) => updateProjectField('groupId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="form-group">
            <Label htmlFor="artifactId" className="block text-sm font-medium text-[#757575] mb-1">Artifact ID</Label>
            <Input 
              type="text" 
              id="artifactId" 
              placeholder="myproject" 
              value={project.artifactId}
              onChange={(e) => updateProjectField('artifactId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="form-group">
            <Label htmlFor="name" className="block text-sm font-medium text-[#757575] mb-1">Project Name</Label>
            <Input 
              type="text" 
              id="name" 
              placeholder="My Spring Boot Project" 
              value={project.name}
              onChange={(e) => updateProjectField('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="form-group">
            <Label htmlFor="description" className="block text-sm font-medium text-[#757575] mb-1">Description</Label>
            <Textarea 
              id="description" 
              rows={2} 
              placeholder="Project description..." 
              value={project.description}
              onChange={(e) => updateProjectField('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        {/* Project Options Section */}
        <div className="space-y-4">
          <div className="form-group">
            <Label htmlFor="javaVersion" className="block text-sm font-medium text-[#757575] mb-1">Java Version</Label>
            <Select 
              value={project.javaVersion} 
              onValueChange={(value) => updateProjectField('javaVersion', value as JavaVersion)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Java version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="21">Java 21</SelectItem>
                <SelectItem value="20">Java 20</SelectItem>
                <SelectItem value="18">Java 18</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="form-group">
            <Label htmlFor="springBootVersion" className="block text-sm font-medium text-[#757575] mb-1">Spring Boot Version</Label>
            <Select 
              value={project.springBootVersion} 
              onValueChange={(value) => updateProjectField('springBootVersion', value as SpringBootVersion)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Spring Boot version" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3.1.5">3.1.5 (Latest)</SelectItem>
                <SelectItem value="3.0.12">3.0.12</SelectItem>
                <SelectItem value="2.7.17">2.7.17</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="form-group">
            <Label className="block text-sm font-medium text-[#757575] mb-1">Package Type</Label>
            <RadioGroup 
              value={project.packageType} 
              onValueChange={(value) => updateProjectField('packageType', value as PackageType)}
              className="flex space-x-4"
            >
              <div className="flex items-center">
                <RadioGroupItem value="jar" id="jar" />
                <Label htmlFor="jar" className="ml-2 text-sm text-[#212121]">JAR</Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="war" id="war" />
                <Label htmlFor="war" className="ml-2 text-sm text-[#212121]">WAR</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="form-group">
            <Label className="block text-sm font-medium text-[#757575] mb-1">Project Dependencies</Label>
            <div className="grid grid-cols-2 gap-2">
              {project.dependencies.map((dep) => (
                <div key={dep.id} className="flex items-center">
                  <Checkbox 
                    id={dep.id} 
                    checked={dep.selected}
                    onCheckedChange={(checked) => handleDependencyChange(dep.id, checked as boolean)}
                  />
                  <Label htmlFor={dep.id} className="ml-2 text-sm text-[#212121]">{dep.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectConfigForm;

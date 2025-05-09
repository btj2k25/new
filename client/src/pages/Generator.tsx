import React from 'react';
import { useProject } from '@/contexts/ProjectContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Stepper from '@/components/Stepper';
import ProjectConfigForm from '@/components/ProjectConfigForm';
import DatabaseConfigForm from '@/components/DatabaseConfigForm';
import SchemaDesignForm from '@/components/SchemaDesignForm';
import GenerateForm from '@/components/GenerateForm';
import { Button } from '@/components/ui/button';
import { MaterialIcon } from '@/lib/icons';

// Main Generator component
const Generator: React.FC = () => {
  const { project, nextStep, prevStep, isLastStep } = useProject();
  const { currentStep } = project;

  const steps = [
    { id: 1, label: 'Project Setup' },
    { id: 2, label: 'Database Config' },
    { id: 3, label: 'Schema Design' },
    { id: 4, label: 'Generate & Download' },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ProjectConfigForm />;
      case 2:
        return <DatabaseConfigForm />;
      case 3:
        return <SchemaDesignForm />;
      case 4:
        return <GenerateForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-[1200px]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Spring Boot Application Generator</h1>
          <p className="text-gray-600">Generate production-ready Spring Boot applications in minutes</p>
        </div>
        <Stepper steps={steps} />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {renderStepContent()}
        </div>
        
        <div className="flex justify-between">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 text-[#212121] rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center"
            >
              <MaterialIcon name="arrow_back" className="w-5 h-5 mr-1" />
              Previous
            </Button>
          ) : (
            <div>{/* Empty div to maintain layout with flex justify-between */}</div>
          )}
          
          {!isLastStep && (
            <Button
              variant="default"
              onClick={nextStep}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center ml-auto"
            >
              Next
              <MaterialIcon name="arrow_forward" className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Generator;

import React from 'react';
import { useProject } from '@/contexts/ProjectContext';

interface StepperProps {
  steps: { id: number; label: string }[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
  const { project } = useProject();
  const { currentStep } = project;

  return (
    <div className="mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div 
              key={step.id} 
              className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} flex items-center ${isLast ? '' : 'flex-1'}`}
            >
              <div className="stepper-circle w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center text-sm font-medium">
                {step.id}
              </div>
              {!isLast && <div className="stepper-line"></div>}
              <div className={`${isLast ? 'ml-2' : 'mx-2'} text-sm md:text-base font-medium ${isActive ? 'text-primary' : 'text-[#757575]'}`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;

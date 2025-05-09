import React from 'react';
import { ProjectProvider } from '@/contexts/ProjectContext';

const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProjectProvider>
      {children}
    </ProjectProvider>
  );
};

export default TestProvider;
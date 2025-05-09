import React, { createContext, useContext, useState, ReactNode } from 'react';

export type JavaVersion = '18' | '20' | '21';
export type SpringBootVersion = '2.7.17' | '3.0.12' | '3.1.5';
export type PackageType = 'jar' | 'war';
export type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'h2' | 'oracle' | 'mssql';
export type FieldType = 'Long' | 'Integer' | 'String' | 'Boolean' | 'LocalDate' | 'LocalDateTime' | 'BigDecimal' | 'Double';
export type RelationshipType = '@OneToOne' | '@OneToMany' | '@ManyToOne' | '@ManyToMany';

export interface Dependency {
  id: string;
  name: string;
  selected: boolean;
}

export interface DatabaseOption {
  url: string;
  name: string;
  username: string;
  password: string;
  generateDdl: boolean;
  showSql: boolean;
  connectionPool: boolean;
}

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  constraints: string[];
}

export interface Entity {
  id: string;
  name: string;
  description: string;
  fields: Field[];
}

export interface Relationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: RelationshipType;
  fieldName: string;
}

export interface GenerationOption {
  controllers: boolean;
  services: boolean;
  repositories: boolean;
  dtos: boolean;
  docker: boolean;
  dockerCompose: boolean;
  readme: boolean;
  gitignore: boolean;
  documentation: 'none' | 'swagger' | 'springdoc';
}

export interface ProjectConfig {
  groupId: string;
  artifactId: string;
  name: string;
  description: string;
  javaVersion: JavaVersion;
  springBootVersion: SpringBootVersion;
  packageType: PackageType;
  dependencies: Dependency[];
  database: {
    type: DatabaseType | null;
    options: DatabaseOption;
  };
  entities: Entity[];
  relationships: Relationship[];
  generationOptions: GenerationOption;
  currentStep: number;
}

interface ProjectContextType {
  project: ProjectConfig;
  setProject: React.Dispatch<React.SetStateAction<ProjectConfig>>;
  nextStep: () => void;
  prevStep: () => void;
  updateProjectField: <K extends keyof ProjectConfig>(field: K, value: ProjectConfig[K]) => void;
  addEntity: (entity: Entity) => void;
  updateEntity: (entity: Entity) => void;
  removeEntity: (entityId: string) => void;
  addRelationship: (relationship: Relationship) => void;
  updateRelationship: (relationship: Relationship) => void;
  removeRelationship: (relationshipId: string) => void;
  isLastStep: boolean;
  getEntityById: (id: string) => Entity | undefined;
}

const defaultDependencies: Dependency[] = [
  { id: 'web', name: 'Spring Web', selected: true },
  { id: 'jpa', name: 'Spring Data JPA', selected: false },
  { id: 'security', name: 'Spring Security', selected: false },
  { id: 'actuator', name: 'Actuator', selected: false },
  { id: 'devtools', name: 'DevTools', selected: false },
  { id: 'lombok', name: 'Lombok', selected: false },
];

const initialProject: ProjectConfig = {
  groupId: 'com.example',
  artifactId: 'demo',
  name: 'Spring Boot Application',
  description: '',
  javaVersion: '21',
  springBootVersion: '3.1.5',
  packageType: 'jar',
  dependencies: defaultDependencies,
  database: {
    type: null,
    options: {
      url: '',
      name: '',
      username: '',
      password: '',
      generateDdl: true,
      showSql: false,
      connectionPool: true,
    },
  },
  entities: [],
  relationships: [],
  generationOptions: {
    controllers: true,
    services: true,
    repositories: true,
    dtos: false,
    docker: false,
    dockerCompose: false,
    readme: true,
    gitignore: true,
    documentation: 'swagger',
  },
  currentStep: 1,
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ProjectConfig>(initialProject);

  const nextStep = () => {
    if (project.currentStep < 4) {
      setProject((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const prevStep = () => {
    if (project.currentStep > 1) {
      setProject((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const updateProjectField = <K extends keyof ProjectConfig>(field: K, value: ProjectConfig[K]) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const addEntity = (entity: Entity) => {
    setProject((prev) => ({
      ...prev,
      entities: [...prev.entities, entity],
    }));
  };

  const updateEntity = (entity: Entity) => {
    setProject((prev) => ({
      ...prev,
      entities: prev.entities.map((e) => (e.id === entity.id ? entity : e)),
    }));
  };

  const removeEntity = (entityId: string) => {
    setProject((prev) => ({
      ...prev,
      entities: prev.entities.filter((e) => e.id !== entityId),
      relationships: prev.relationships.filter(
        (r) => r.sourceEntityId !== entityId && r.targetEntityId !== entityId
      ),
    }));
  };

  const addRelationship = (relationship: Relationship) => {
    setProject((prev) => ({
      ...prev,
      relationships: [...prev.relationships, relationship],
    }));
  };

  const updateRelationship = (relationship: Relationship) => {
    setProject((prev) => ({
      ...prev,
      relationships: prev.relationships.map((r) => (r.id === relationship.id ? relationship : r)),
    }));
  };

  const removeRelationship = (relationshipId: string) => {
    setProject((prev) => ({
      ...prev,
      relationships: prev.relationships.filter((r) => r.id !== relationshipId),
    }));
  };

  const getEntityById = (id: string) => {
    return project.entities.find(entity => entity.id === id);
  };

  const isLastStep = project.currentStep === 4;

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        nextStep,
        prevStep,
        updateProjectField,
        addEntity,
        updateEntity,
        removeEntity,
        addRelationship,
        updateRelationship,
        removeRelationship,
        isLastStep,
        getEntityById,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

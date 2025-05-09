import React, { useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { MaterialIcon } from '@/lib/icons';
import EntityCard from './EntityCard';
import RelationshipTable from './RelationshipTable';
import EntityModal from './EntityModal';
import RelationshipModal from './RelationshipModal';

const SchemaDesignForm: React.FC = () => {
  const { project, addEntity, addRelationship } = useProject();
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);

  return (
    <div data-step="3" className="block">
      <h2 className="text-xl font-medium mb-6 text-[#212121]">Schema Design</h2>
      
      {/* Entity Design Container */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Entities</h3>
          <Button 
            variant="default"
            size="sm"
            onClick={() => setIsEntityModalOpen(true)}
            className="px-3 py-1 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center text-sm"
          >
            <MaterialIcon name="add" className="h-4 w-4 mr-1" /> Add Entity
          </Button>
        </div>
        
        {/* Entity List */}
        <div id="entityList" className="space-y-4">
          {project.entities.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <p className="text-[#757575]">No entities defined yet. Add your first entity to get started.</p>
            </div>
          ) : (
            project.entities.map((entity) => (
              <EntityCard key={entity.id} entity={entity} />
            ))
          )}
        </div>
      </div>
      
      {/* Relationship Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Relationships</h3>
          <Button 
            variant="default"
            size="sm"
            onClick={() => setIsRelationshipModalOpen(true)}
            disabled={project.entities.length < 2}
            className="px-3 py-1 bg-primary text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center text-sm"
          >
            <MaterialIcon name="add" className="h-4 w-4 mr-1" /> Add Relationship
          </Button>
        </div>
        
        <RelationshipTable relationships={project.relationships} />
      </div>

      {/* Modals */}
      <EntityModal 
        isOpen={isEntityModalOpen} 
        onClose={() => setIsEntityModalOpen(false)} 
        onSubmit={(entity) => {
          addEntity(entity);
          setIsEntityModalOpen(false);
        }}
      />

      <RelationshipModal 
        isOpen={isRelationshipModalOpen} 
        onClose={() => setIsRelationshipModalOpen(false)} 
        onSubmit={(relationship) => {
          addRelationship(relationship);
          setIsRelationshipModalOpen(false);
        }}
        entities={project.entities}
      />
    </div>
  );
};

export default SchemaDesignForm;

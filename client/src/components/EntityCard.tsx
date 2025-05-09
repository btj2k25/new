import React, { useState } from 'react';
import { useProject, Entity, Field } from '@/contexts/ProjectContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MaterialIcon } from '@/lib/icons';
import EntityModal from './EntityModal';

interface EntityCardProps {
  entity: Entity;
}

const EntityCard: React.FC<EntityCardProps> = ({ entity }) => {
  const { removeEntity, updateEntity } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    removeEntity(entity.id);
  };

  const getConstraintVariant = (constraint: string) => {
    if (constraint.includes('@Id') || constraint.includes('@GeneratedValue')) {
      return 'info';
    } else if (constraint.includes('@NotNull') || constraint.includes('@NotBlank') || constraint.includes('@Min') || constraint.includes('@Email') || constraint.includes('@Column')) {
      return 'warning';
    } else if (constraint.includes('@CreationTimestamp') || constraint.includes('@UpdateTimestamp')) {
      return 'purple';
    } else {
      return 'default';
    }
  };

  return (
    <>
      <div className="entity-card border rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
          <div className="flex items-center">
            <MaterialIcon name="table_chart" className="w-5 h-5 text-primary mr-2" />
            <h4 className="font-medium">{entity.name}</h4>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleEdit} className="text-primary hover:text-blue-700 focus:outline-none h-8 w-8">
              <MaterialIcon name="edit" className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-red-700 focus:outline-none h-8 w-8">
              <MaterialIcon name="delete" className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          {entity.description && (
            <p className="text-sm text-gray-600 mb-3">{entity.description}</p>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">Field Name</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">Constraints</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entity.fields.map((field) => (
                  <tr key={field.id}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-[#212121]">{field.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-[#212121]">{field.type}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-[#212121]">
                      <div className="flex flex-wrap gap-1">
                        {field.constraints.map((constraint, i) => (
                          <Badge key={i} variant={getConstraintVariant(constraint)} className="text-xs">{constraint}</Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-3">
            <Button variant="link" size="sm" onClick={handleEdit} className="text-sm text-primary hover:text-blue-700 flex items-center">
              <MaterialIcon name="add" className="h-4 w-4 mr-1" /> Add Field
            </Button>
          </div>
        </div>
      </div>

      <EntityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(updatedEntity) => {
          updateEntity(updatedEntity);
          setIsModalOpen(false);
        }}
        entity={entity}
        isEditing={true}
      />
    </>
  );
};

export default EntityCard;

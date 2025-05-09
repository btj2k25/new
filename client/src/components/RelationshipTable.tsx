import React, { useState } from 'react';
import { useProject, Relationship } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MaterialIcon } from '@/lib/icons';
import RelationshipModal from './RelationshipModal';

interface RelationshipTableProps {
  relationships: Relationship[];
}

const RelationshipTable: React.FC<RelationshipTableProps> = ({ relationships }) => {
  const { getEntityById, removeRelationship, updateRelationship } = useProject();
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (relationship: Relationship) => {
    setEditingRelationship(relationship);
    setIsModalOpen(true);
  };

  const handleDelete = (relationshipId: string) => {
    removeRelationship(relationshipId);
  };

  return (
    <>
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        {relationships.length === 0 ? (
          <div className="text-center p-6">
            <p className="text-[#757575]">No relationships defined yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">Source Entity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">Relationship Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">Target Entity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">Field Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {relationships.map((relationship) => {
                  const sourceEntity = getEntityById(relationship.sourceEntityId);
                  const targetEntity = getEntityById(relationship.targetEntityId);
                  
                  return (
                    <tr key={relationship.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#212121]">
                        {sourceEntity?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#212121]">
                        <Badge variant="info" className="px-2 py-1 text-xs rounded-full">{relationship.type}</Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#212121]">
                        {targetEntity?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#212121]">
                        {relationship.fieldName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-[#212121]">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(relationship)} className="text-primary hover:text-blue-700 focus:outline-none h-8 w-8 mr-2">
                          <MaterialIcon name="edit" className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(relationship.id)} className="text-destructive hover:text-red-700 focus:outline-none h-8 w-8">
                          <MaterialIcon name="delete" className="h-5 w-5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingRelationship && (
        <RelationshipModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditingRelationship(null);
          }} 
          onSubmit={(updatedRelationship) => {
            updateRelationship(updatedRelationship);
            setIsModalOpen(false);
            setEditingRelationship(null);
          }}
          relationship={editingRelationship}
          entities={useProject().project.entities}
          isEditing={true}
        />
      )}
    </>
  );
};

export default RelationshipTable;

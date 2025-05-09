import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Entity, Relationship, RelationshipType } from '@/contexts/ProjectContext';

interface RelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (relationship: Relationship) => void;
  entities: Entity[];
  relationship?: Relationship;
  isEditing?: boolean;
}

const RelationshipModal: React.FC<RelationshipModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  entities,
  relationship,
  isEditing = false,
}) => {
  const [sourceEntityId, setSourceEntityId] = useState<string>('');
  const [targetEntityId, setTargetEntityId] = useState<string>('');
  const [type, setType] = useState<RelationshipType>('@OneToMany');
  const [fieldName, setFieldName] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (relationship) {
        setSourceEntityId(relationship.sourceEntityId);
        setTargetEntityId(relationship.targetEntityId);
        setType(relationship.type);
        setFieldName(relationship.fieldName);
      } else {
        // Default values for new relationship
        setSourceEntityId(entities.length > 0 ? entities[0].id : '');
        setTargetEntityId(entities.length > 1 ? entities[1].id : entities.length > 0 ? entities[0].id : '');
        setType('@OneToMany');
        setFieldName('');
      }
    }
  }, [isOpen, relationship, entities]);

  const handleSourceEntityChange = (id: string) => {
    setSourceEntityId(id);
    
    // Auto-suggest field name based on target entity
    if (targetEntityId) {
      const targetEntity = entities.find(e => e.id === targetEntityId);
      if (targetEntity) {
        const suggestedName = getSuggestedFieldName(targetEntity.name, type);
        setFieldName(suggestedName);
      }
    }
  };

  const handleTargetEntityChange = (id: string) => {
    setTargetEntityId(id);
    
    // Auto-suggest field name based on target entity
    if (id) {
      const targetEntity = entities.find(e => e.id === id);
      if (targetEntity) {
        const suggestedName = getSuggestedFieldName(targetEntity.name, type);
        setFieldName(suggestedName);
      }
    }
  };

  const handleTypeChange = (newType: RelationshipType) => {
    setType(newType);
    
    // Update field name based on new relationship type
    if (targetEntityId) {
      const targetEntity = entities.find(e => e.id === targetEntityId);
      if (targetEntity) {
        const suggestedName = getSuggestedFieldName(targetEntity.name, newType);
        setFieldName(suggestedName);
      }
    }
  };

  const getSuggestedFieldName = (entityName: string, relationType: RelationshipType): string => {
    // Convert entity name to camelCase
    const baseName = entityName.charAt(0).toLowerCase() + entityName.slice(1);
    
    // For plural relationships, add 's' at the end
    if (relationType === '@OneToMany' || relationType === '@ManyToMany') {
      return `${baseName}s`;
    }
    
    return baseName;
  };

  const handleSubmit = () => {
    // Basic validation
    if (!sourceEntityId || !targetEntityId || !type || !fieldName.trim()) {
      return; // Add proper validation handling
    }

    const newRelationship: Relationship = {
      id: relationship?.id || crypto.randomUUID(),
      sourceEntityId,
      targetEntityId,
      type,
      fieldName: fieldName.trim()
    };

    onSubmit(newRelationship);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Relationship' : 'Add New Relationship'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="form-group">
            <Label htmlFor="sourceEntity" className="block text-sm font-medium text-[#757575] mb-1">Source Entity</Label>
            <Select 
              value={sourceEntityId}
              onValueChange={handleSourceEntityChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select source entity" />
              </SelectTrigger>
              <SelectContent>
                {entities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="form-group">
            <Label htmlFor="relationshipType" className="block text-sm font-medium text-[#757575] mb-1">Relationship Type</Label>
            <Select 
              value={type}
              onValueChange={(value) => handleTypeChange(value as RelationshipType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="@OneToOne">@OneToOne</SelectItem>
                <SelectItem value="@OneToMany">@OneToMany</SelectItem>
                <SelectItem value="@ManyToOne">@ManyToOne</SelectItem>
                <SelectItem value="@ManyToMany">@ManyToMany</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-[#757575]">The relationship will be applied from the source entity to the target entity</p>
          </div>
          
          <div className="form-group">
            <Label htmlFor="targetEntity" className="block text-sm font-medium text-[#757575] mb-1">Target Entity</Label>
            <Select 
              value={targetEntityId}
              onValueChange={handleTargetEntityChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select target entity" />
              </SelectTrigger>
              <SelectContent>
                {entities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="form-group">
            <Label htmlFor="fieldName" className="block text-sm font-medium text-[#757575] mb-1">Field Name</Label>
            <Input 
              type="text" 
              id="fieldName" 
              placeholder="e.g. products"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
            <p className="mt-1 text-xs text-[#757575]">Name of the field in the source entity that will reference the target entity</p>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="mt-2 sm:mt-0"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Relationship'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RelationshipModal;

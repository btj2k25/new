import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaterialIcon } from '@/lib/icons';
import { Entity, Field, FieldType } from '@/contexts/ProjectContext';

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entity: Entity) => void;
  entity?: Entity;
  isEditing?: boolean;
}

const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  entity,
  isEditing = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [generateId, setGenerateId] = useState(true);
  const [generateTimestamps, setGenerateTimestamps] = useState(true);
  const [useLombok, setUseLombok] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (entity) {
        setName(entity.name);
        setDescription(entity.description);
        setFields(entity.fields);
        
        // Check if entity has ID field with @Id annotation
        const hasIdField = entity.fields.some(
          (f) => f.name === 'id' && f.constraints.some((c) => c.includes('@Id'))
        );
        setGenerateId(hasIdField);
        
        // Check if entity has timestamp fields
        const hasTimestampFields = entity.fields.some(
          (f) => f.name === 'createdAt' || f.name === 'updatedAt'
        );
        setGenerateTimestamps(hasTimestampFields);
      } else {
        // Default values for new entity
        setName('');
        setDescription('');
        setFields([
          { 
            id: crypto.randomUUID(),
            name: 'id',
            type: 'Long',
            constraints: ['@Id', '@GeneratedValue']
          }
        ]);
        setGenerateId(true);
        setGenerateTimestamps(true);
        setUseLombok(true);
      }
    }
  }, [isOpen, entity]);

  const addField = () => {
    setFields([
      ...fields,
      {
        id: crypto.randomUUID(),
        name: '',
        type: 'String',
        constraints: []
      }
    ]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id: string, field: Partial<Field>) => {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, ...field } : f))
    );
  };

  const handleSubmit = () => {
    // Basic validation
    if (!name.trim()) {
      return; // Add proper validation handling
    }

    // Generate final fields
    let finalFields = [...fields];
    
    // Make sure we have an ID field if generateId is checked
    if (generateId && !finalFields.some(f => f.name === 'id')) {
      finalFields.unshift({
        id: crypto.randomUUID(),
        name: 'id',
        type: 'Long',
        constraints: ['@Id', '@GeneratedValue']
      });
    }
    
    // Add timestamp fields if not present and generateTimestamps is checked
    if (generateTimestamps) {
      if (!finalFields.some(f => f.name === 'createdAt')) {
        finalFields.push({
          id: crypto.randomUUID(),
          name: 'createdAt',
          type: 'LocalDateTime',
          constraints: ['@CreationTimestamp']
        });
      }
      
      if (!finalFields.some(f => f.name === 'updatedAt')) {
        finalFields.push({
          id: crypto.randomUUID(),
          name: 'updatedAt',
          type: 'LocalDateTime',
          constraints: ['@UpdateTimestamp']
        });
      }
    }

    // Create the entity
    const newEntity: Entity = {
      id: entity?.id || crypto.randomUUID(),
      name,
      description,
      fields: finalFields
    };

    onSubmit(newEntity);
  };

  const fieldTypes: FieldType[] = [
    'Long',
    'Integer',
    'String',
    'Boolean',
    'LocalDate',
    'LocalDateTime',
    'BigDecimal',
    'Double'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Entity' : 'Add New Entity'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="form-group">
            <Label htmlFor="entityName" className="block text-sm font-medium text-[#757575] mb-1">Entity Name</Label>
            <Input 
              type="text" 
              id="entityName" 
              placeholder="e.g. Customer" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="mt-1 text-xs text-[#757575]">Entity name should be singular and PascalCase (e.g. Customer, Product)</p>
          </div>
          
          <div className="form-group">
            <Label htmlFor="entityDesc" className="block text-sm font-medium text-[#757575] mb-1">Description (Optional)</Label>
            <Textarea 
              id="entityDesc" 
              rows={2} 
              placeholder="Brief description of this entity..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <Label className="block text-sm font-medium text-[#757575] mb-1">Fields</Label>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-[#757575] uppercase tracking-wider">Type</th>
                    <th className="px-3 py-2 text-xs font-medium text-[#757575] uppercase tracking-wider w-10"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((field) => (
                    <tr key={field.id}>
                      <td className="px-3 py-2">
                        <Input 
                          type="text" 
                          placeholder="fieldName" 
                          value={field.name}
                          onChange={(e) => updateField(field.id, { name: e.target.value })}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Select 
                          value={field.type}
                          onValueChange={(value) => updateField(field.id, { type: value as FieldType })}
                        >
                          <SelectTrigger className="w-full h-8 text-sm">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-red-700 focus:outline-none h-6 w-6"
                          onClick={() => removeField(field.id)}
                          disabled={field.name === 'id' && generateId}
                        >
                          <MaterialIcon name="delete" className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-50 px-3 py-2 flex justify-center">
                <Button 
                  variant="link" 
                  onClick={addField}
                  className="text-sm text-primary hover:text-blue-700 flex items-center"
                >
                  <MaterialIcon name="add" className="h-4 w-4 mr-1" /> Add Field
                </Button>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <Label className="block text-sm font-medium text-[#757575] mb-1">Constraints</Label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="idGeneration" 
                  checked={generateId}
                  onCheckedChange={(checked) => setGenerateId(checked as boolean)}
                />
                <Label htmlFor="idGeneration" className="ml-2 text-sm text-[#212121]">Generate @Id and @GeneratedValue for 'id' field</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="timestamps" 
                  checked={generateTimestamps}
                  onCheckedChange={(checked) => setGenerateTimestamps(checked as boolean)}
                />
                <Label htmlFor="timestamps" className="ml-2 text-sm text-[#212121]">Add createdAt and updatedAt timestamps</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="lombok" 
                  checked={useLombok}
                  onCheckedChange={(checked) => setUseLombok(checked as boolean)}
                />
                <Label htmlFor="lombok" className="ml-2 text-sm text-[#212121]">Generate Lombok annotations (@Data, @Builder, etc.)</Label>
              </div>
            </div>
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
            {isEditing ? 'Save Changes' : 'Add Entity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EntityModal;

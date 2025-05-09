import React from 'react';
import { useProject, DatabaseType } from '@/contexts/ProjectContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  PostgreSQLLogo,
  MySQLLogo,
  MongoDBLogo,
  H2Logo,
  OracleLogo,
  MicrosoftSQLLogo
} from '@/lib/icons';

const DatabaseConfigForm: React.FC = () => {
  const { project, updateProjectField } = useProject();

  const handleDatabaseSelect = (type: DatabaseType) => {
    updateProjectField('database', {
      ...project.database,
      type
    });
  };

  const handleConnectionOptionChange = (field: string, value: string | boolean) => {
    updateProjectField('database', {
      ...project.database,
      options: {
        ...project.database.options,
        [field]: value
      }
    });
  };

  const databases = [
    { 
      type: 'postgresql' as DatabaseType, 
      name: 'PostgreSQL',
      description: 'Robust, open-source relational database',
      logo: <PostgreSQLLogo />
    },
    { 
      type: 'mysql' as DatabaseType, 
      name: 'MySQL',
      description: 'Popular open-source relational database',
      logo: <MySQLLogo />
    },
    { 
      type: 'mongodb' as DatabaseType, 
      name: 'MongoDB',
      description: 'NoSQL document-oriented database',
      logo: <MongoDBLogo />
    },
    { 
      type: 'h2' as DatabaseType, 
      name: 'H2 Database',
      description: 'In-memory database for testing',
      logo: <H2Logo />
    },
    { 
      type: 'oracle' as DatabaseType, 
      name: 'Oracle',
      description: 'Enterprise-grade relational database',
      logo: <OracleLogo />
    },
    { 
      type: 'mssql' as DatabaseType, 
      name: 'SQL Server',
      description: 'Microsoft\'s enterprise database solution',
      logo: <MicrosoftSQLLogo />
    }
  ];

  return (
    <div data-step="2" className="block">
      <h2 className="text-xl font-medium mb-6 text-[#212121]">Database Configuration</h2>
      
      {/* Database Selection Section */}
      <div className="mb-6">
        <Label className="block text-sm font-medium text-[#757575] mb-3">Select Database Type</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {databases.map((db) => (
            <div 
              key={db.type}
              className={`database-card border rounded-lg p-4 hover:border-primary cursor-pointer transition-all duration-200 flex flex-col items-center ${project.database.type === db.type ? 'db-card-selected' : ''}`}
              onClick={() => handleDatabaseSelect(db.type)}
            >
              {db.logo}
              <h3 className="font-medium mb-1">{db.name}</h3>
              <p className="text-xs text-[#757575] text-center">{db.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Database Connection Settings */}
      {project.database.type && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-medium mb-4">Connection Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <Label htmlFor="dbUrl" className="block text-sm font-medium text-[#757575] mb-1">Database URL</Label>
              <Input 
                type="text" 
                id="dbUrl" 
                placeholder={project.database.type === 'postgresql' ? 'jdbc:postgresql://localhost:5432/mydb' : 'Database URL'}
                value={project.database.options.url}
                onChange={(e) => handleConnectionOptionChange('url', e.target.value)}
              />
            </div>
            <div className="form-group">
              <Label htmlFor="dbName" className="block text-sm font-medium text-[#757575] mb-1">Database Name</Label>
              <Input 
                type="text" 
                id="dbName" 
                placeholder="mydb"
                value={project.database.options.name}
                onChange={(e) => handleConnectionOptionChange('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <Label htmlFor="dbUsername" className="block text-sm font-medium text-[#757575] mb-1">Username</Label>
              <Input 
                type="text" 
                id="dbUsername" 
                placeholder={project.database.type === 'postgresql' ? 'postgres' : 'username'}
                value={project.database.options.username}
                onChange={(e) => handleConnectionOptionChange('username', e.target.value)}
              />
            </div>
            <div className="form-group">
              <Label htmlFor="dbPassword" className="block text-sm font-medium text-[#757575] mb-1">Password</Label>
              <Input 
                type="password" 
                id="dbPassword" 
                placeholder="••••••••"
                value={project.database.options.password}
                onChange={(e) => handleConnectionOptionChange('password', e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Additional Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center">
                <Checkbox 
                  id="hibernateDdl" 
                  checked={project.database.options.generateDdl}
                  onCheckedChange={(checked) => handleConnectionOptionChange('generateDdl', checked as boolean)}
                />
                <Label htmlFor="hibernateDdl" className="ml-2 text-sm text-[#212121]">Generate DDL</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="showSql" 
                  checked={project.database.options.showSql}
                  onCheckedChange={(checked) => handleConnectionOptionChange('showSql', checked as boolean)}
                />
                <Label htmlFor="showSql" className="ml-2 text-sm text-[#212121]">Show SQL</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="connectionPool" 
                  checked={project.database.options.connectionPool}
                  onCheckedChange={(checked) => handleConnectionOptionChange('connectionPool', checked as boolean)}
                />
                <Label htmlFor="connectionPool" className="ml-2 text-sm text-[#212121]">Connection Pooling</Label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseConfigForm;

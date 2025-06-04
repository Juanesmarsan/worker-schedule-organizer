
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project';
import { MapPin, Building, DollarSign } from 'lucide-react';

interface ProjectsLocationMapProps {
  projects: Project[];
}

const ProjectsLocationMap: React.FC<ProjectsLocationMapProps> = ({ projects }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-blue-500';
      case 'completado': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'activo': return 'Activo';
      case 'completado': return 'Completado';
      default: return 'Pausado';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Proyectos por Ubicación</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => {
            const projectRevenue = project.budget || (project.hourlyRate || 0) * 160;
            const projectExpenses = project.variableExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
            const profit = projectRevenue - projectExpenses;
            
            return (
              <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`}></div>
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building className="h-3 w-3" />
                      <span>{project.city}</span>
                      <Badge variant="outline" className="text-xs">
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <DollarSign className="h-3 w-3" />
                    <span>€{profit.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {project.type === 'presupuesto' ? 'Presupuesto' : 'Administración'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Activos</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completados</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Pausados</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsLocationMap;

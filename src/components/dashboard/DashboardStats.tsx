
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types/project';
import { Absence } from '@/types/calendar';
import { Building2, Users, CalendarX, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  projects: Project[];
  absences: Absence[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ projects, absences }) => {
  const activeProjects = projects.filter(p => p.status === 'activo').length;
  const totalRevenue = projects.reduce((sum, project) => {
    const projectRevenue = project.budget || (project.hourlyRate || 0) * 160;
    return sum + projectRevenue;
  }, 0);
  const totalExpenses = projects.reduce((sum, project) => {
    const projectExpenses = project.variableExpenses?.reduce((expSum, exp) => expSum + exp.amount, 0) || 0;
    return sum + projectExpenses;
  }, 0);
  const pendingAbsences = absences.filter(a => a.status === 'pending').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
          <p className="text-xs text-muted-foreground">
            de {projects.length} totales
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Beneficio: €{(totalRevenue - totalExpenses).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalExpenses.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            En {projects.length} proyectos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ausencias Pendientes</CardTitle>
          <CalendarX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingAbsences}</div>
          <p className="text-xs text-muted-foreground">
            de {absences.length} totales
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;

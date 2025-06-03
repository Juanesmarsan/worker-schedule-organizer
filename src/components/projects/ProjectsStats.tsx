
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from "@/types/project";

interface ProjectsStatsProps {
  projects: Project[];
}

const ProjectsStats = ({ projects }: ProjectsStatsProps) => {
  const totalVariableExpenses = projects
    .reduce((sum, p) => sum + p.variableExpenses.reduce((expSum, exp) => expSum + exp.amount, 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{projects.length}</div>
          <p className="text-xs text-muted-foreground">Proyectos en el sistema</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {projects.filter(p => p.status === "activo").length}
          </div>
          <p className="text-xs text-muted-foreground">En desarrollo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Por Presupuesto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {projects.filter(p => p.type === "presupuesto").length}
          </div>
          <p className="text-xs text-muted-foreground">Proyectos con presupuesto</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gastos Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalVariableExpenses.toFixed(2)} €
          </div>
          <p className="text-xs text-muted-foreground">Suma de gastos variables</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsStats;

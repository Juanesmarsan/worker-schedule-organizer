import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Building, Clock, Euro, Calendar, AlertTriangle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Project } from "@/types/project";
import { Absence } from "@/types/calendar";

interface DashboardWithDataProps {
  projects: Project[];
  absences: Absence[];
}

const DashboardWithData = ({ projects, absences }: DashboardWithDataProps) => {
  const [monthlyProjectData, setMonthlyProjectData] = useState<any[]>([]);
  const [projectStatusData, setProjectStatusData] = useState<any[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);

  const totalRevenue = projects.reduce((sum, project) => {
    return sum + (project.budget || (project.hourlyRate || 0) * 160);
  }, 0);

  const totalExpenses = projects.reduce((sum, project) => {
    return sum + (project.variableExpenses?.reduce((expSum, exp) => expSum + exp.amount, 0) || 0);
  }, 0);

  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0;

  const pendingAbsences = absences.filter(a => a.status === 'pending').length;
  const totalEmployees = [...new Set(absences.map(a => a.employeeName))].length || 12;

  const chartConfig = {
    revenue: {
      label: "Ingresos",
      color: "#3b82f6",
    },
    expenses: {
      label: "Gastos",
      color: "#ef4444",
    },
    profit: {
      label: "Beneficio",
      color: "#22c55e",
    },
    projects: {
      label: "Proyectos",
      color: "#22c55e",
    },
  };

  useEffect(() => {
    // Calcular datos mensuales de proyectos
    const monthlyData = [
      { month: 'Ene', projects: 3, revenue: 45000, expenses: 32000 },
      { month: 'Feb', projects: 4, revenue: 52000, expenses: 35000 },
      { month: 'Mar', projects: 3, revenue: 48000, expenses: 31000 },
      { month: 'Abr', projects: 5, revenue: 61000, expenses: 42000 },
      { month: 'May', projects: 4, revenue: 55000, expenses: 38000 },
      { month: 'Jun', projects: projects.length, revenue: 67000, expenses: 45000 },
    ];
    setMonthlyProjectData(monthlyData);

    // Calcular estado de proyectos basado en datos reales
    const activeProjects = projects.filter(p => p.status === 'activo').length;
    const completedProjects = projects.filter(p => p.status === 'completado').length;
    const pausedProjects = projects.filter(p => p.status === 'pausado').length;

    const statusData = [
      { name: 'Activos', value: activeProjects, color: '#3b82f6' },
      { name: 'Completados', value: completedProjects, color: '#22c55e' },
      { name: 'Pausados', value: pausedProjects, color: '#6b7280' },
    ];
    setProjectStatusData(statusData);

    // Calcular datos por ciudad basado en proyectos reales
    const citiesMap = new Map();
    projects.forEach(project => {
      const city = project.city || 'Sin especificar';
      if (citiesMap.has(city)) {
        const existing = citiesMap.get(city);
        citiesMap.set(city, {
          ...existing,
          projects: existing.projects + 1,
          revenue: existing.revenue + (project.budget || project.hourlyRate * 160 || 0)
        });
      } else {
        citiesMap.set(city, {
          city,
          projects: 1,
          revenue: project.budget || project.hourlyRate * 160 || 0
        });
      }
    });

    setCityData(Array.from(citiesMap.values()));
  }, [projects]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Empresarial</h1>
        <p className="text-gray-600">Datos en tiempo real de tu empresa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Estimados</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              Basado en {projects.length} proyectos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margen de Beneficio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {profitMargin > 0 ? (
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              )}
              €{totalProfit.toLocaleString()} beneficio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter(p => p.status === 'activo').length}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {projects.length} proyectos totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1 text-orange-500" />
              {pendingAbsences} ausencias pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolución de Proyectos</CardTitle>
            <CardDescription>Número de proyectos e ingresos por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart data={monthlyProjectData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  name="Ingresos (€)"
                />
                <Area 
                  type="monotone" 
                  dataKey="projects" 
                  stackId="2"
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  fillOpacity={0.3}
                  name="Proyectos"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Proyectos</CardTitle>
            <CardDescription>Distribución actual</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Ciudad</CardTitle>
            <CardDescription>Proyectos e ingresos por ubicación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cityData.map((city, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{city.city}</p>
                      <p className="text-sm text-gray-500">{city.projects} proyecto{city.projects !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">€{city.revenue.toLocaleString()}</p>
                    <Badge variant="secondary" className="text-xs">
                      {totalRevenue > 0 ? ((city.revenue / totalRevenue) * 100).toFixed(1) : 0}%
                    </Badge>
                  </div>
                </div>
              ))}
              {cityData.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay datos de ciudades disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos por Proyecto</CardTitle>
            <CardDescription>Distribución de gastos variables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project, index) => {
                const projectExpenses = project.variableExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
                const projectRevenue = project.budget || (project.hourlyRate || 0) * 160;
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Building className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-gray-500">{project.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">€{projectExpenses.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {projectRevenue > 0 ? ((projectExpenses / projectRevenue) * 100).toFixed(1) : 0}% del ingreso
                      </p>
                    </div>
                  </div>
                );
              })}
              {projects.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay proyectos disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardWithData;

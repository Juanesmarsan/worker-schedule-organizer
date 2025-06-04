
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types/project';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface FinancialSummaryProps {
  projects: Project[];
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ projects }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const projectsData = projects.map(project => {
    const revenue = project.budget || (project.hourlyRate || 0) * 160;
    const expenses = project.variableExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
    return {
      name: project.name,
      revenue,
      expenses,
      profit: revenue - expenses
    };
  });

  const statusData = [
    { name: 'Activos', value: projects.filter(p => p.status === 'activo').length },
    { name: 'Completados', value: projects.filter(p => p.status === 'completado').length },
    { name: 'Pausados', value: projects.filter(p => p.status === 'pausado').length }
  ].filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen Financiero</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Ingresos vs Gastos por Proyecto</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={projectsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#00C49F" name="Ingresos" />
                <Bar dataKey="expenses" fill="#FF8042" name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Estado de Proyectos</h4>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;

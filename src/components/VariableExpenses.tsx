import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project, VariableExpense } from "@/types/project";
import VariableExpenseForm from "@/components/VariableExpenseForm";

const VariableExpenses = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allVariableExpenses, setAllVariableExpenses] = useState<(VariableExpense & { projectName: string })[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Simulamos obtener los proyectos (en una app real esto vendría de un contexto compartido o API)
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: 1,
        name: "Reforma Oficina Central",
        type: "presupuesto",
        budget: 15000,
        description: "Renovación completa de la oficina central",
        status: "activo",
        createdAt: new Date(),
        variableExpenses: [
          { id: 1, concept: "Material eléctrico", amount: 450, date: new Date(), note: "Cables y enchufes para renovación" },
          { id: 2, concept: "Pintura", amount: 220, date: new Date() }
        ]
      },
      {
        id: 2,
        name: "Mantenimiento Sistemas",
        type: "administracion",
        description: "Mantenimiento mensual de sistemas informáticos",
        status: "activo",
        createdAt: new Date(),
        variableExpenses: [
          { id: 3, concept: "Licencias software", amount: 150, date: new Date(), note: "Renovación anual Office 365" },
          { id: 4, concept: "Repuestos hardware", amount: 80, date: new Date() }
        ]
      }
    ];
    
    setProjects(mockProjects);

    // Crear lista unificada de gastos variables
    const expenses = mockProjects.flatMap(project =>
      project.variableExpenses.map(expense => ({
        ...expense,
        projectName: project.name
      }))
    );
    setAllVariableExpenses(expenses);
  }, []);

  const handleAddExpense = (projectId: number, expenseData: Omit<VariableExpense, 'id'>) => {
    const newExpense: VariableExpense = {
      ...expenseData,
      id: Date.now()
    };

    const updatedProjects = projects.map(project =>
      project.id === projectId
        ? { ...project, variableExpenses: [...project.variableExpenses, newExpense] }
        : project
    );

    setProjects(updatedProjects);

    // Actualizar lista unificada
    const expenses = updatedProjects.flatMap(project =>
      project.variableExpenses.map(expense => ({
        ...expense,
        projectName: project.name
      }))
    );
    setAllVariableExpenses(expenses);
  };

  const totalVariableExpenses = allVariableExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resumen de Gastos Variables</CardTitle>
            <CardDescription>
              Todos los gastos variables asignados a proyectos
            </CardDescription>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Gasto Variable
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead className="text-right">Importe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allVariableExpenses.map((expense) => (
                <TableRow key={`${expense.id}-${expense.projectName}`}>
                  <TableCell>
                    <Badge variant="outline">{expense.projectName}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{expense.concept}</TableCell>
                  <TableCell>{expense.date.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {expense.note ? (
                      <span className="text-sm text-muted-foreground">{expense.note}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{expense.amount.toFixed(2)} €</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resumen por proyecto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastos Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVariableExpenses.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">Suma de todos los gastos variables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos con Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.variableExpenses.length > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">De {projects.length} proyectos totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.length > 0 ? (totalVariableExpenses / projects.length).toFixed(2) : '0.00'} €
            </div>
            <p className="text-xs text-muted-foreground">Gasto variable promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen detallado por proyecto */}
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Proyecto</CardTitle>
          <CardDescription>
            Desglose de gastos variables por cada proyecto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => {
              const projectTotal = project.variableExpenses.reduce((sum, expense) => sum + expense.amount, 0);
              return (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant={project.type === "presupuesto" ? "default" : "secondary"}>
                      {project.type === "presupuesto" ? "Presupuesto" : "Administración"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {project.variableExpenses.length} gastos - Total: {projectTotal.toFixed(2)} €
                  </div>
                  {project.variableExpenses.length > 0 && (
                    <div className="space-y-1">
                      {project.variableExpenses.map((expense) => (
                        <div key={expense.id} className="flex justify-between text-sm">
                          <span>{expense.concept}</span>
                          <span>{expense.amount.toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <VariableExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        projects={projects}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
};

export default VariableExpenses;

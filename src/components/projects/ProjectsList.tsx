
import { Edit, Trash2, DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Project } from "@/types/project";

interface ProjectsListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onAddExpense: (project: Project) => void;
  onRemoveExpense: (projectId: number, expenseId: number) => void;
}

const ProjectsList = ({ projects, onEdit, onDelete, onAddExpense, onRemoveExpense }: ProjectsListProps) => {
  const getStatusBadge = (status: Project['status']) => {
    const variants = {
      activo: "default",
      completado: "secondary",
      pausado: "destructive"
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Presupuesto/Precio-Hora</TableHead>
          <TableHead>Gastos Variables</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="w-[150px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => {
          const variableTotal = project.variableExpenses.reduce((sum, expense) => sum + expense.amount, 0);
          return (
            <TableRow key={project.id}>
              <TableCell>
                <Collapsible>
                  <CollapsibleTrigger className="font-medium hover:underline">
                    {project.name}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="text-sm text-muted-foreground">
                      {project.description}
                    </div>
                    {project.variableExpenses.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="text-xs font-medium">Gastos Variables:</div>
                        {project.variableExpenses.map((expense) => (
                          <div key={expense.id} className="flex justify-between text-xs bg-gray-50 p-1 rounded">
                            <span>{expense.concept}</span>
                            <div className="flex gap-2 items-center">
                              <span>{expense.amount.toFixed(2)} €</span>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => onRemoveExpense(project.id, expense.id)}
                              >
                                <Trash2 className="w-2 h-2" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </TableCell>
              <TableCell>
                <Badge variant={project.type === "presupuesto" ? "default" : "secondary"}>
                  {project.type === "presupuesto" ? "Presupuesto" : "Administración"}
                </Badge>
              </TableCell>
              <TableCell>
                {project.type === "presupuesto" && project.budget 
                  ? `${project.budget.toFixed(2)} €` 
                  : project.type === "administracion" && project.hourlyRate
                  ? `${project.hourlyRate.toFixed(2)} €/h`
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{variableTotal.toFixed(2)} €</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddExpense(project)}
                  >
                    <DollarSign className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(project.status)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProjectsList;

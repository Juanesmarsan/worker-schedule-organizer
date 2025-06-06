import { Edit, Trash2, DollarSign, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project, TimelineStep } from "@/types/project";
import ProjectTimeline from "./ProjectTimeline";

interface ProjectsListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onAddExpense: (project: Project) => void;
  onRemoveExpense: (projectId: number, expenseId: number) => void;
  onStatusChange: (projectId: number, status: Project['status']) => void;
  onManageWorkers: (project: Project) => void;
  onUpdateTimelineStep: (projectId: number, step: TimelineStep) => void;
  onAddTimelineStep: (projectId: number) => void;
}

const ProjectsList = ({ 
  projects, 
  onEdit, 
  onDelete, 
  onAddExpense, 
  onRemoveExpense, 
  onStatusChange, 
  onManageWorkers,
  onUpdateTimelineStep,
  onAddTimelineStep
}: ProjectsListProps) => {
  const getStatusBadge = (status: Project['status']) => {
    const variants = {
      activo: "default", // azul
      completado: "destructive", // rojo
      pausado: "secondary"
    } as const;

    const labels = {
      activo: "Activo",
      completado: "Finalizado",
      pausado: "Pausado"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getTotalWorkerCost = (project: Project) => {
    if (project.type === "administracion") {
      return project.workers.reduce((total, worker) => {
        if (worker.hourlyRate) {
          const workerHours = worker.workDays.reduce((sum, day) => sum + day.hours, 0);
          return total + (workerHours * worker.hourlyRate);
        }
        return total;
      }, 0);
    }
    return 0;
  };

  // Función para obtener los pasos por defecto del timeline
  const getDefaultTimelineSteps = (): TimelineStep[] => {
    return [
      {
        id: 1,
        title: "PASO 1:",
        concept: "Consulta Inicial Cliente",
        status: 'pending'
      },
      {
        id: 2,
        title: "PASO 2:",
        concept: "Diseño del Proyecto",
        status: 'pending'
      },
      {
        id: 3,
        title: "PASO 3:",
        concept: "Concepto Inicial Diseño",
        status: 'pending'
      },
      {
        id: 4,
        title: "PASO 4:",
        concept: "Liberar Diseño Para Oferta",
        status: 'pending'
      },
      {
        id: 5,
        title: "PASO 5:",
        concept: "2do Concepto Diseño",
        status: 'pending'
      },
      {
        id: 6,
        title: "PASO 6:",
        concept: "Presentación Ventas & Propuestas",
        status: 'pending'
      },
      {
        id: 7,
        title: "PASO 7:",
        concept: "Compra de Materiales",
        status: 'pending'
      },
      {
        id: 8,
        title: "PASO 8:",
        concept: "Instalar",
        status: 'pending'
      },
      {
        id: 9,
        title: "PASO 9:",
        concept: "Revisar Proyecto Finalizado",
        status: 'pending'
      }
    ];
  };

  const handleUpdateTimelineStep = (projectId: number, step: TimelineStep) => {
    console.log('Updating timeline step:', step, 'for project:', projectId);
    // Aquí se implementaría la lógica para actualizar el paso en el proyecto
  };

  const handleAddTimelineStep = (projectId: number) => {
    console.log('Adding new timeline step for project:', projectId);
    // Aquí se implementaría la lógica para añadir un nuevo paso
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => {
        const variableTotal = project.variableExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const workerCost = getTotalWorkerCost(project);
        const totalWorkerHours = project.workers.reduce((total, worker) => 
          total + worker.workDays.reduce((sum, day) => sum + day.hours, 0), 0
        );
        
        // Usar los pasos del timeline del proyecto o los por defecto
        const timelineSteps = project.timelineSteps || getDefaultTimelineSteps();
        
        return (
          <div key={project.id} className="border rounded-lg p-4 bg-white">
            {/* Información principal del proyecto */}
            <div className="grid grid-cols-7 gap-4 items-center mb-4">
              <div>
                <Collapsible>
                  <CollapsibleTrigger className="font-medium hover:underline text-left">
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
              </div>
              
              <div>
                <Badge variant={project.type === "presupuesto" ? "default" : "secondary"}>
                  {project.type === "presupuesto" ? "Presupuesto" : "Administración"}
                </Badge>
              </div>
              
              <div>
                {project.type === "presupuesto" && project.budget 
                  ? `${project.budget.toFixed(2)} €` 
                  : project.type === "administracion" && project.hourlyRate
                  ? `${project.hourlyRate.toFixed(2)} €/h`
                  : "-"}
              </div>
              
              <div>
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
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-xs">
                    <div>{project.workers.length} operarios</div>
                    <div className="text-muted-foreground">
                      {totalWorkerHours}h total
                      {project.type === "administracion" && workerCost > 0 && (
                        <div>{workerCost.toFixed(2)}€</div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onManageWorkers(project)}
                  >
                    <Users className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Select 
                  value={project.status} 
                  onValueChange={(value: Project['status']) => onStatusChange(project.id, value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue>
                      {getStatusBadge(project.status)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Activo
                      </div>
                    </SelectItem>
                    <SelectItem value="completado">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Finalizado
                      </div>
                    </SelectItem>
                    <SelectItem value="pausado">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        Pausado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
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
              </div>
            </div>
            
            {/* Timeline para proyectos de presupuesto - siempre visible */}
            {project.type === "presupuesto" && (
              <div className="mt-4">
                <ProjectTimeline 
                  projectName={project.name}
                  timelineSteps={timelineSteps}
                  onUpdateStep={(step) => onUpdateTimelineStep(project.id, step)}
                  onAddStep={() => onAddTimelineStep(project.id)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectsList;

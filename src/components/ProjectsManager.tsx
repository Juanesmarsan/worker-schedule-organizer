import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Project, VariableExpense } from "@/types/project";
import { Worker } from "@/types/worker";
import ProjectForm from "@/components/projects/ProjectForm";
import ProjectsList from "@/components/projects/ProjectsList";
import ProjectsStats from "@/components/projects/ProjectsStats";
import QuickExpenseForm from "@/components/projects/QuickExpenseForm";
import WorkersManagement from "@/components/projects/WorkersManagement";

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Reforma Oficina Central",
      type: "presupuesto",
      budget: 15000,
      description: "Renovación completa de la oficina central",
      status: "activo",
      createdAt: new Date(),
      variableExpenses: [
        { id: 1, concept: "Material eléctrico", amount: 450, date: new Date(), paymentMethod: "transferencia" },
        { id: 2, concept: "Pintura", amount: 220, date: new Date(), paymentMethod: "efectivo" }
      ],
      workers: []
    },
    {
      id: 2,
      name: "Mantenimiento Sistemas",
      type: "administracion",
      hourlyRate: 50,
      description: "Mantenimiento mensual de sistemas informáticos",
      status: "activo",
      createdAt: new Date(),
      variableExpenses: [
        { id: 3, concept: "Licencias software", amount: 150, date: new Date(), paymentMethod: "tarjeta", creditCardNumber: "**** **** **** 1234" }
      ],
      workers: []
    }
  ]);

  // Lista de operarios disponibles
  const [availableWorkers] = useState<Worker[]>([
    { id: 1, name: "Juan Pérez", defaultHourlyRate: 25 },
    { id: 2, name: "María García", defaultHourlyRate: 30 },
    { id: 3, name: "Carlos López", defaultHourlyRate: 28 },
    { id: 4, name: "Ana Martín", defaultHourlyRate: 32 },
    { id: 5, name: "Pedro Ruiz", defaultHourlyRate: 26 }
  ]);

  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProjectForExpense, setSelectedProjectForExpense] = useState<Project | null>(null);
  const [selectedProjectForWorkers, setSelectedProjectForWorkers] = useState<Project | null>(null);

  const { toast } = useToast();

  const handleOpenProjectForm = (project?: Project) => {
    setEditingProject(project || null);
    setIsProjectFormOpen(true);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    if (editingProject) {
      setProjects(projects.map(project => 
        project.id === editingProject.id 
          ? { ...project, ...projectData }
          : project
      ));
      toast({
        title: "Proyecto actualizado",
        description: `El proyecto "${projectData.name}" ha sido actualizado`,
      });
    } else {
      const newProject: Project = {
        ...projectData,
        id: Date.now(),
        createdAt: new Date()
      };
      setProjects([...projects, newProject]);
      toast({
        title: "Proyecto creado",
        description: `El proyecto "${projectData.name}" ha sido creado`,
      });
    }
    setIsProjectFormOpen(false);
  };

  const deleteProject = (id: number) => {
    const project = projects.find(p => p.id === id);
    setProjects(projects.filter(p => p.id !== id));
    toast({
      title: "Proyecto eliminado",
      description: `El proyecto "${project?.name}" ha sido eliminado`,
    });
  };

  const openExpenseDialog = (project: Project) => {
    setSelectedProjectForExpense(project);
    setIsExpenseDialogOpen(true);
  };

  const addVariableExpense = (projectId: number, expense: VariableExpense) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, variableExpenses: [...project.variableExpenses, expense] }
        : project
    ));
    setIsExpenseDialogOpen(false);
  };

  const removeVariableExpense = (projectId: number, expenseId: number) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, variableExpenses: project.variableExpenses.filter(e => e.id !== expenseId) }
        : project
    ));

    toast({
      title: "Gasto eliminado",
      description: "El gasto variable ha sido eliminado del proyecto",
    });
  };

  const handleStatusChange = (projectId: number, status: Project['status']) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, status }
        : project
    ));

    const statusLabels = {
      activo: "Activo",
      completado: "Finalizado", 
      pausado: "Pausado"
    };

    toast({
      title: "Estado actualizado",
      description: `El proyecto ha sido marcado como ${statusLabels[status]}`,
    });
  };

  const handleManageWorkers = (project: Project) => {
    setSelectedProjectForWorkers(project);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(project =>
      project.id === updatedProject.id ? updatedProject : project
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Proyectos</CardTitle>
            <CardDescription>
              Administra proyectos por presupuesto y por administración, incluyendo gastos variables y operarios
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenProjectForm()}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </CardHeader>
        <CardContent>
          <ProjectsList
            projects={projects}
            onEdit={handleOpenProjectForm}
            onDelete={deleteProject}
            onAddExpense={openExpenseDialog}
            onRemoveExpense={removeVariableExpense}
            onStatusChange={handleStatusChange}
            onManageWorkers={handleManageWorkers}
          />
        </CardContent>
      </Card>

      <ProjectsStats projects={projects} />

      {selectedProjectForWorkers && (
        <WorkersManagement
          project={selectedProjectForWorkers}
          onUpdateProject={handleUpdateProject}
          availableWorkers={availableWorkers}
        />
      )}

      <ProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        editingProject={editingProject}
        onSave={handleSaveProject}
      />

      <QuickExpenseForm
        isOpen={isExpenseDialogOpen}
        onClose={() => setIsExpenseDialogOpen(false)}
        selectedProject={selectedProjectForExpense}
        onAddExpense={addVariableExpense}
      />
    </div>
  );
};

export default ProjectsManager;

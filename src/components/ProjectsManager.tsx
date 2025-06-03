import { useState } from "react";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { Project, VariableExpense } from "@/types/project";

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
        { id: 1, concept: "Material eléctrico", amount: 450, date: new Date() },
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
        { id: 3, concept: "Licencias software", amount: 150, date: new Date() }
      ]
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProjectForExpense, setSelectedProjectForExpense] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "presupuesto" as "presupuesto" | "administracion",
    budget: "",
    description: "",
    status: "activo" as "activo" | "completado" | "pausado"
  });
  const [expenseFormData, setExpenseFormData] = useState({
    concept: "",
    amount: ""
  });

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: "",
      type: "presupuesto",
      budget: "",
      description: "",
      status: "activo"
    });
    setEditingProject(null);
  };

  const openDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        type: project.type,
        budget: project.budget?.toString() || "",
        description: project.description,
        status: project.status
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const saveProject = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del proyecto es obligatorio",
        variant: "destructive"
      });
      return;
    }

    if (formData.type === "presupuesto" && (!formData.budget || parseFloat(formData.budget) <= 0)) {
      toast({
        title: "Error",
        description: "Los proyectos por presupuesto deben tener un presupuesto válido",
        variant: "destructive"
      });
      return;
    }

    const projectData: Omit<Project, 'id' | 'createdAt'> = {
      name: formData.name.trim(),
      type: formData.type,
      budget: formData.type === "presupuesto" ? parseFloat(formData.budget) : undefined,
      description: formData.description.trim(),
      status: formData.status,
      variableExpenses: editingProject?.variableExpenses || []
    };

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

    closeDialog();
  };

  const deleteProject = (id: number) => {
    const project = projects.find(p => p.id === id);
    setProjects(projects.filter(p => p.id !== id));
    toast({
      title: "Proyecto eliminado",
      description: `El proyecto "${project?.name}" ha sido eliminado`,
    });
  };

  const getStatusBadge = (status: Project['status']) => {
    const variants = {
      activo: "default",
      completado: "secondary",
      pausado: "destructive"
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const openExpenseDialog = (project: Project) => {
    setSelectedProjectForExpense(project);
    setExpenseFormData({ concept: "", amount: "" });
    setIsExpenseDialogOpen(true);
  };

  const closeExpenseDialog = () => {
    setIsExpenseDialogOpen(false);
    setSelectedProjectForExpense(null);
    setExpenseFormData({ concept: "", amount: "" });
  };

  const addVariableExpense = () => {
    if (!selectedProjectForExpense) return;

    if (!expenseFormData.concept.trim() || !expenseFormData.amount.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(expenseFormData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "El importe debe ser un número válido mayor que 0",
        variant: "destructive"
      });
      return;
    }

    const newExpense: VariableExpense = {
      id: Date.now(),
      concept: expenseFormData.concept.trim(),
      amount: amount,
      date: new Date()
    };

    setProjects(projects.map(project =>
      project.id === selectedProjectForExpense.id
        ? { ...project, variableExpenses: [...project.variableExpenses, newExpense] }
        : project
    ));

    toast({
      title: "Gasto agregado",
      description: `Se ha agregado el gasto "${newExpense.concept}" al proyecto "${selectedProjectForExpense.name}"`,
    });

    closeExpenseDialog();
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Proyectos</CardTitle>
            <CardDescription>
              Administra proyectos por presupuesto y por administración, incluyendo gastos variables
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? "Modifica los datos del proyecto" : "Crea un nuevo proyecto para gestionar"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="project-name">Nombre del Proyecto</Label>
                  <Input
                    id="project-name"
                    placeholder="Ej: Reforma de oficinas"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-type">Tipo de Proyecto</Label>
                  <Select value={formData.type} onValueChange={(value: "presupuesto" | "administracion") => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presupuesto">Por Presupuesto</SelectItem>
                      <SelectItem value="administracion">Por Administración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.type === "presupuesto" && (
                  <div className="grid gap-2">
                    <Label htmlFor="project-budget">Presupuesto (€)</Label>
                    <Input
                      id="project-budget"
                      type="number"
                      placeholder="0.00"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="project-status">Estado</Label>
                  <Select value={formData.status} onValueChange={(value: "activo" | "completado" | "pausado") => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="pausado">Pausado</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project-description">Descripción</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Describe el proyecto..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button onClick={saveProject}>
                  {editingProject ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Presupuesto</TableHead>
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
                                      onClick={() => removeVariableExpense(project.id, expense.id)}
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
                      {project.budget ? `${project.budget.toFixed(2)} €` : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{variableTotal.toFixed(2)} €</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openExpenseDialog(project)}
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
                          onClick={() => openDialog(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProject(project.id)}
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
        </CardContent>
      </Card>

      {/* Dialog para agregar gastos variables */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Gasto Variable</DialogTitle>
            <DialogDescription>
              Agregar un nuevo gasto variable al proyecto "{selectedProjectForExpense?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="expense-concept">Concepto</Label>
              <Input
                id="expense-concept"
                placeholder="Ej: Material, mano de obra..."
                value={expenseFormData.concept}
                onChange={(e) => setExpenseFormData({...expenseFormData, concept: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expense-amount">Importe (€)</Label>
              <Input
                id="expense-amount"
                type="number"
                placeholder="0.00"
                value={expenseFormData.amount}
                onChange={(e) => setExpenseFormData({...expenseFormData, amount: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeExpenseDialog}>
              Cancelar
            </Button>
            <Button onClick={addVariableExpense}>
              Agregar Gasto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resumen de proyectos */}
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
              {projects
                .reduce((sum, p) => sum + p.variableExpenses.reduce((expSum, exp) => expSum + exp.amount, 0), 0)
                .toFixed(2)} €
            </div>
            <p className="text-xs text-muted-foreground">Suma de gastos variables</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectsManager;

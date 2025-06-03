
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/project";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingProject: Project | null;
  onSave: (projectData: Omit<Project, 'id' | 'createdAt'>) => void;
}

const ProjectForm = ({ isOpen, onClose, editingProject, onSave }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "presupuesto" as "presupuesto" | "administracion",
    budget: "",
    hourlyRate: "",
    description: "",
    status: "activo" as "activo" | "completado" | "pausado"
  });

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: "",
      type: "presupuesto",
      budget: "",
      hourlyRate: "",
      description: "",
      status: "activo"
    });
  };

  const handleOpen = (project?: Project) => {
    if (project) {
      setFormData({
        name: project.name,
        type: project.type,
        budget: project.budget?.toString() || "",
        hourlyRate: project.hourlyRate?.toString() || "",
        description: project.description,
        status: project.status
      });
    } else {
      resetForm();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
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

    if (formData.type === "administracion" && (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0)) {
      toast({
        title: "Error",
        description: "Los proyectos por administración deben tener un precio/hora válido",
        variant: "destructive"
      });
      return;
    }

    const projectData: Omit<Project, 'id' | 'createdAt'> = {
      name: formData.name.trim(),
      type: formData.type,
      budget: formData.type === "presupuesto" ? parseFloat(formData.budget) : undefined,
      hourlyRate: formData.type === "administracion" ? parseFloat(formData.hourlyRate) : undefined,
      description: formData.description.trim(),
      status: formData.status,
      variableExpenses: editingProject?.variableExpenses || []
    };

    onSave(projectData);
    handleClose();
  };

  // Update form when editingProject changes
  useEffect(() => {
    if (isOpen) {
      handleOpen(editingProject || undefined);
    }
  }, [isOpen, editingProject]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
          {formData.type === "administracion" && (
            <div className="grid gap-2">
              <Label htmlFor="project-hourly-rate">Precio/Hora (€)</Label>
              <Input
                id="project-hourly-rate"
                type="number"
                placeholder="0.00"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
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
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingProject ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;

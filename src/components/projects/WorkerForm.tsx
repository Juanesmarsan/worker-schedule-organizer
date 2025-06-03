
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProjectWorker } from "@/types/project";

interface WorkerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workerData: Omit<ProjectWorker, 'id' | 'workDays'>) => void;
  editingWorker: ProjectWorker | null;
  projectType: "presupuesto" | "administracion";
}

const WorkerForm = ({ isOpen, onClose, onSave, editingWorker, projectType }: WorkerFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    hourlyRate: ""
  });

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (editingWorker) {
        setFormData({
          name: editingWorker.name,
          hourlyRate: editingWorker.hourlyRate?.toString() || ""
        });
      } else {
        setFormData({
          name: "",
          hourlyRate: ""
        });
      }
    }
  }, [isOpen, editingWorker]);

  const handleClose = () => {
    setFormData({
      name: "",
      hourlyRate: ""
    });
    onClose();
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del operario es obligatorio",
        variant: "destructive"
      });
      return;
    }

    if (projectType === "administracion" && (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0)) {
      toast({
        title: "Error",
        description: "Para proyectos de administración el precio por hora es obligatorio",
        variant: "destructive"
      });
      return;
    }

    const workerData: Omit<ProjectWorker, 'id' | 'workDays'> = {
      name: formData.name.trim(),
      hourlyRate: projectType === "administracion" ? parseFloat(formData.hourlyRate) : undefined
    };

    onSave(workerData);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingWorker ? "Editar Operario" : "Nuevo Operario"}
          </DialogTitle>
          <DialogDescription>
            {editingWorker ? "Modifica los datos del operario" : "Añade un nuevo operario al proyecto"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="worker-name">Nombre del Operario</Label>
            <Input
              id="worker-name"
              placeholder="Ej: Juan Pérez"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          {projectType === "administracion" && (
            <div className="grid gap-2">
              <Label htmlFor="worker-hourly-rate">Precio por Hora (€)</Label>
              <Input
                id="worker-hourly-rate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
              />
              <p className="text-xs text-muted-foreground">
                Precio que nos pagan por hora de este operario
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingWorker ? "Actualizar" : "Añadir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerForm;

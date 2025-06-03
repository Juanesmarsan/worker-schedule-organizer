import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProjectWorker } from "@/types/project";
import { Worker } from "@/types/worker";

interface WorkerAssignmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workerData: Omit<ProjectWorker, 'id'>) => void;
  editingWorker: ProjectWorker | null;
  projectType: "presupuesto" | "administracion";
  availableWorkers: Worker[];
}

const WorkerAssignmentForm = ({ isOpen, onClose, onSave, editingWorker, projectType, availableWorkers }: WorkerAssignmentFormProps) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [workDays, setWorkDays] = useState<ProjectWorker['workDays']>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [hours, setHours] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (editingWorker) {
        const worker = availableWorkers.find(w => w.name === editingWorker.name);
        setSelectedWorkerId(worker?.id.toString() || "");
        setHourlyRate(editingWorker.hourlyRate?.toString() || "");
        setWorkDays([...editingWorker.workDays]);
      } else {
        setSelectedWorkerId("");
        setHourlyRate("");
        setWorkDays([]);
      }
      setSelectedDate(undefined);
      setHours("");
    }
  }, [isOpen, editingWorker, availableWorkers]);

  const handleWorkerSelect = (workerId: string) => {
    setSelectedWorkerId(workerId);
    const worker = availableWorkers.find(w => w.id.toString() === workerId);
    if (worker && projectType === "administracion" && worker.defaultHourlyRate) {
      setHourlyRate(worker.defaultHourlyRate.toString());
    }
  };

  const handleAddDay = () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Selecciona una fecha",
        variant: "destructive"
      });
      return;
    }

    if (!hours || parseFloat(hours) <= 0) {
      toast({
        title: "Error",
        description: "Introduce un número de horas válido",
        variant: "destructive"
      });
      return;
    }

    const dateString = selectedDate.toISOString().split('T')[0];
    
    if (workDays.some(day => day.date === dateString)) {
      toast({
        title: "Error",
        description: "Ya existe un registro para esta fecha",
        variant: "destructive"
      });
      return;
    }

    const newWorkDay = {
      date: dateString,
      hours: parseFloat(hours)
    };

    setWorkDays([...workDays, newWorkDay].sort((a, b) => a.date.localeCompare(b.date)));
    setHours("");
    setSelectedDate(undefined);

    toast({
      title: "Día añadido",
      description: `Se han registrado ${hours} horas para el ${selectedDate.toLocaleDateString('es-ES')}`,
    });
  };

  const handleRemoveDay = (dateToRemove: string) => {
    setWorkDays(workDays.filter(day => day.date !== dateToRemove));
  };

  const handleClose = () => {
    setSelectedWorkerId("");
    setHourlyRate("");
    setWorkDays([]);
    setSelectedDate(undefined);
    setHours("");
    onClose();
  };

  const handleSave = () => {
    if (!selectedWorkerId) {
      toast({
        title: "Error",
        description: "Selecciona un operario",
        variant: "destructive"
      });
      return;
    }

    if (projectType === "administracion" && (!hourlyRate || parseFloat(hourlyRate) <= 0)) {
      toast({
        title: "Error",
        description: "Para proyectos de administración el precio por hora es obligatorio",
        variant: "destructive"
      });
      return;
    }

    const selectedWorker = availableWorkers.find(w => w.id.toString() === selectedWorkerId);
    if (!selectedWorker) return;

    const workerData: Omit<ProjectWorker, 'id'> = {
      name: selectedWorker.name,
      hourlyRate: projectType === "administracion" ? parseFloat(hourlyRate) : undefined,
      workDays: workDays
    };

    onSave(workerData);
    handleClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getTotalHours = () => {
    return workDays.reduce((total, day) => total + day.hours, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingWorker ? "Editar Asignación de Operario" : "Asignar Operario al Proyecto"}
          </DialogTitle>
          <DialogDescription>
            Selecciona un operario y programa sus días de trabajo
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="worker-select">Operario</Label>
              <Select value={selectedWorkerId} onValueChange={handleWorkerSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un operario" />
                </SelectTrigger>
                <SelectContent>
                  {availableWorkers.map((worker) => (
                    <SelectItem key={worker.id} value={worker.id.toString()}>
                      {worker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {projectType === "administracion" && (
              <div className="grid gap-2">
                <Label htmlFor="worker-hourly-rate">Precio por Hora (€)</Label>
                <Input
                  id="worker-hourly-rate"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Precio que nos pagan por hora de este operario en este proyecto
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label>Programar Días de Trabajo</Label>
              <Badge variant="secondary">
                Total: {getTotalHours()}h
              </Badge>
            </div>
            
            <div className="grid gap-4 border rounded-lg p-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Seleccionar Fecha</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-fit"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-sm font-medium mb-1 block">Horas</Label>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="8"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddDay}>
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Día
                  </Button>
                </div>
              </div>
            </div>

            {workDays.length > 0 && (
              <div className="grid gap-2">
                <Label>Días Programados</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {workDays.map((day) => (
                    <div key={day.date} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{formatDate(day.date)}</span>
                        <span className="text-muted-foreground ml-2">
                          {day.hours}h
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveDay(day.date)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {editingWorker ? "Actualizar" : "Asignar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerAssignmentForm;

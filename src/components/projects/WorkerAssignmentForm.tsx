
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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
    toast({
      title: "Día eliminado",
      description: "El día de trabajo ha sido eliminado",
    });
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

    toast({
      title: "Operario asignado",
      description: `${selectedWorker.name} ha sido asignado con ${workDays.length} días programados`,
    });
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingWorker ? "Editar Asignación de Operario" : "Asignar Operario al Proyecto"}
          </DialogTitle>
          <DialogDescription>
            Selecciona un operario y programa sus días de trabajo. Puedes añadir tantos días como necesites.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Selección de operario */}
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

          {/* Programación de días */}
          <div className="grid gap-4 border rounded-lg p-4 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Programar Días de Trabajo</h3>
              <Badge variant="secondary" className="text-sm">
                Total: {getTotalHours()}h en {workDays.length} días
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Selector de fecha */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Seleccionar Fecha</Label>
                <div className="border rounded-lg p-3 bg-white">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Añadir horas y día */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Horas de Trabajo</Label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    placeholder="8"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <Button 
                  onClick={handleAddDay}
                  className="w-full"
                  size="lg"
                  disabled={!selectedDate || !hours}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Día
                </Button>

                {selectedDate && (
                  <p className="text-sm text-muted-foreground">
                    Añadiendo: {selectedDate.toLocaleDateString('es-ES')} 
                    {hours && ` - ${hours} horas`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Lista de días programados */}
          {workDays.length > 0 && (
            <div className="grid gap-3 border rounded-lg p-4">
              <h4 className="font-medium text-lg">Días Programados ({workDays.length})</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {workDays.map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex-1">
                      <span className="font-medium">{formatDate(day.date)}</span>
                      <span className="text-muted-foreground ml-3">
                        {day.hours} horas
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

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!selectedWorkerId}>
            {editingWorker ? "Actualizar" : "Asignar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerAssignmentForm;

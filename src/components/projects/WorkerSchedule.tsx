
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProjectWorker } from "@/types/project";

interface WorkerScheduleProps {
  isOpen: boolean;
  onClose: () => void;
  worker: ProjectWorker | null;
  onUpdateSchedule: (workerId: number, workDays: ProjectWorker['workDays']) => void;
}

const WorkerSchedule = ({ isOpen, onClose, worker, onUpdateSchedule }: WorkerScheduleProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [hours, setHours] = useState("");
  const [workDays, setWorkDays] = useState<ProjectWorker['workDays']>([]);

  const { toast } = useToast();

  useEffect(() => {
    if (worker) {
      setWorkDays([...worker.workDays]);
    }
  }, [worker]);

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
    
    // Verificar si ya existe un día para esta fecha
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

    const updatedWorkDays = [...workDays, newWorkDay].sort((a, b) => a.date.localeCompare(b.date));
    setWorkDays(updatedWorkDays);
    setHours("");
    setSelectedDate(undefined);

    toast({
      title: "Día añadido",
      description: `Se han registrado ${hours} horas para el ${selectedDate.toLocaleDateString('es-ES')}`,
    });
  };

  const handleRemoveDay = (dateToRemove: string) => {
    const updatedWorkDays = workDays.filter(day => day.date !== dateToRemove);
    setWorkDays(updatedWorkDays);

    toast({
      title: "Día eliminado",
      description: "El día de trabajo ha sido eliminado",
    });
  };

  const handleSave = () => {
    if (worker) {
      onUpdateSchedule(worker.id, workDays);
      toast({
        title: "Horario actualizado",
        description: `Se ha actualizado el horario de ${worker.name}`,
      });
    }
    onClose();
  };

  const getTotalHours = () => {
    return workDays.reduce((total, day) => total + day.hours, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  if (!worker) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Horario de {worker.name}</DialogTitle>
          <DialogDescription>
            Gestiona los días y horas de trabajo del operario
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Añadir Día de Trabajo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Seleccionar Fecha</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Horas</label>
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
                    Añadir Día
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Días Programados</CardTitle>
              <Badge variant="secondary">
                Total: {getTotalHours()}h
              </Badge>
            </CardHeader>
            <CardContent>
              {workDays.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay días programados
                </p>
              ) : (
                <div className="space-y-2">
                  {workDays.map((day) => (
                    <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
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
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Horario
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerSchedule;

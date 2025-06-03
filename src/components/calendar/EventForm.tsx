
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EventType, EventFormData } from "@/types/calendar";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: EventFormData;
  onFormDataChange: (data: EventFormData) => void;
  onSave: () => void;
  selectedEmployee: string;
}

export const EventForm = ({
  isOpen,
  onClose,
  formData,
  onFormDataChange,
  onSave,
  selectedEmployee
}: EventFormProps) => {
  const calculateHours = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2024-01-01T${formData.startTime}`);
      const end = new Date(`2024-01-01T${formData.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const hours = Math.round(diffMs / (1000 * 60 * 60));
      onFormDataChange({ ...formData, hours: hours > 0 ? hours : 0 });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar para {selectedEmployee}</DialogTitle>
          <DialogDescription>
            Registra horas, ausencias, vacaciones o anotaciones
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo de evento *</Label>
            <Select value={formData.type} onValueChange={(value: EventType) => onFormDataChange({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work_hours">Horas de trabajo</SelectItem>
                <SelectItem value="vacation">Vacaciones</SelectItem>
                <SelectItem value="absence">Ausencia</SelectItem>
                <SelectItem value="note">Anotación</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date">Fecha *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => onFormDataChange({ ...formData, date: e.target.value })}
            />
          </div>

          {formData.type === 'work_hours' && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startTime">Hora inicio</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => {
                    onFormDataChange({ ...formData, startTime: e.target.value });
                    setTimeout(calculateHours, 100);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Hora fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => {
                    onFormDataChange({ ...formData, endTime: e.target.value });
                    setTimeout(calculateHours, 100);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="hours">Horas totales</Label>
                <Input
                  id="hours"
                  type="number"
                  value={formData.hours}
                  onChange={(e) => onFormDataChange({ ...formData, hours: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}

          {formData.type === 'note' && (
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
                placeholder="Título de la anotación"
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onFormDataChange({ ...formData, notes: e.target.value })}
              placeholder="Información adicional..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onSave}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

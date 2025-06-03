import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Users, Clock, Briefcase, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Proper localizer configuration
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday start
  getDay,
  locales: {
    'es': es,
  },
});

type EventType = 'vacation' | 'absence' | 'meeting' | 'deadline' | 'work_hours' | 'note';

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  employee: string;
  hours?: number;
  notes?: string;
}

const WorkCalendar = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Juan Pérez - Vacaciones",
      start: new Date(2024, 5, 10),
      end: new Date(2024, 5, 14),
      type: 'vacation',
      employee: "Juan Pérez"
    },
    {
      id: 2,
      title: "María García - Ausencia médica",
      start: new Date(2024, 5, 3),
      end: new Date(2024, 5, 3),
      type: 'absence',
      employee: "María García"
    },
    {
      id: 3,
      title: "Carlos López - 8 horas",
      start: new Date(2024, 5, 5, 9, 0),
      end: new Date(2024, 5, 5, 17, 0),
      type: 'work_hours',
      employee: "Carlos López",
      hours: 8
    },
    {
      id: 4,
      title: "Ana Martín - Reunión cliente",
      start: new Date(2024, 5, 6, 10, 0),
      end: new Date(2024, 5, 6, 11, 0),
      type: 'note',
      employee: "Ana Martín",
      notes: "Reunión importante con cliente ABC"
    }
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee: "",
    type: "work_hours" as const,
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    hours: 8,
    title: "",
    notes: ""
  });

  const employees = ["Juan Pérez", "María García", "Carlos López", "Ana Martín"];

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    
    switch (event.type) {
      case 'vacation':
        backgroundColor = '#059669';
        break;
      case 'absence':
        backgroundColor = '#dc2626';
        break;
      case 'meeting':
        backgroundColor = '#7c3aed';
        break;
      case 'deadline':
        backgroundColor = '#ea580c';
        break;
      case 'work_hours':
        backgroundColor = '#0891b2';
        break;
      case 'note':
        backgroundColor = '#7c2d12';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const getEventsForDate = (date: Date) => {
    const filtered = events.filter(event => {
      const eventDate = new Date(event.start);
      const dateMatches = eventDate.toDateString() === date.toDateString();
      const employeeMatches = selectedEmployee === "all" || event.employee === selectedEmployee;
      return dateMatches && employeeMatches;
    });
    return filtered;
  };

  const getFilteredEvents = () => {
    if (selectedEmployee === "all") return events;
    return events.filter(event => event.employee === selectedEmployee);
  };

  const todaysEvents = getEventsForDate(new Date());
  const selectedDateEvents = getEventsForDate(selectedDate);

  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case 'vacation':
        return <CalendarDays className="w-4 h-4" />;
      case 'absence':
        return <Users className="w-4 h-4" />;
      case 'meeting':
        return <Briefcase className="w-4 h-4" />;
      case 'deadline':
        return <Clock className="w-4 h-4" />;
      case 'work_hours':
        return <Clock className="w-4 h-4" />;
      case 'note':
        return <Edit className="w-4 h-4" />;
      default:
        return <CalendarDays className="w-4 h-4" />;
    }
  };

  const getEventTypeBadge = (type: EventType) => {
    switch (type) {
      case 'vacation':
        return <Badge className="bg-green-100 text-green-800">Vacaciones</Badge>;
      case 'absence':
        return <Badge className="bg-red-100 text-red-800">Ausencia</Badge>;
      case 'meeting':
        return <Badge className="bg-purple-100 text-purple-800">Reunión</Badge>;
      case 'deadline':
        return <Badge className="bg-orange-100 text-orange-800">Fecha límite</Badge>;
      case 'work_hours':
        return <Badge className="bg-cyan-100 text-cyan-800">Horas</Badge>;
      case 'note':
        return <Badge className="bg-amber-100 text-amber-800">Nota</Badge>;
      default:
        return <Badge variant="secondary">Evento</Badge>;
    }
  };

  const handleAddEvent = () => {
    setFormData({
      employee: "",
      type: "work_hours",
      startDate: "",
      endDate: "",
      startTime: "09:00",
      endTime: "17:00",
      hours: 8,
      title: "",
      notes: ""
    });
    setIsDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!formData.employee || !formData.startDate) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = formData.endDate 
      ? new Date(`${formData.endDate}T${formData.endTime}`)
      : new Date(`${formData.startDate}T${formData.endTime}`);

    let title = "";
    if (formData.type === 'work_hours') {
      title = `${formData.employee} - ${formData.hours}h`;
    } else if (formData.type === 'vacation') {
      title = `${formData.employee} - Vacaciones`;
    } else if (formData.type === 'absence') {
      title = `${formData.employee} - Ausencia`;
    } else if (formData.type === 'note') {
      title = `${formData.employee} - ${formData.title}`;
    } else {
      title = `${formData.employee} - ${formData.title}`;
    }

    const newEvent: CalendarEvent = {
      id: Date.now(),
      title,
      start: startDateTime,
      end: endDateTime,
      type: formData.type,
      employee: formData.employee,
      hours: formData.type === 'work_hours' ? formData.hours : undefined,
      notes: formData.notes || undefined
    };

    setEvents([...events, newEvent]);
    toast({
      title: "Evento añadido",
      description: "El evento se ha agregado al calendario"
    });
    setIsDialogOpen(false);
  };

  const calculateHours = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2024-01-01T${formData.startTime}`);
      const end = new Date(`2024-01-01T${formData.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const hours = Math.round(diffMs / (1000 * 60 * 60));
      setFormData({ ...formData, hours: hours > 0 ? hours : 0 });
    }
  };

  // Calendar messages in Spanish
  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango',
    showMore: (total: number) => `+ Ver más (${total})`
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Calendario de Trabajo</h2>
          <p className="text-gray-600">Gestiona horas, vacaciones, ausencias y anotaciones</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los empleados</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee} value={employee}>
                  {employee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddEvent} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Evento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendario</CardTitle>
              <CardDescription>
                Haz clic en una fecha para ver los eventos del día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '500px' }}>
                <Calendar
                  localizer={localizer}
                  events={getFilteredEvents()}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={eventStyleGetter}
                  onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
                  selectable
                  messages={messages}
                  culture="es"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Eventos de hoy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Eventos de Hoy
              </CardTitle>
              <CardDescription>
                {todaysEvents.length} evento(s) programado(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaysEvents.length > 0 ? (
                todaysEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      {getEventTypeIcon(event.type)}
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        {event.notes && (
                          <p className="text-xs text-gray-600">{event.notes}</p>
                        )}
                      </div>
                    </div>
                    {getEventTypeBadge(event.type)}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay eventos programados para hoy
                </p>
              )}
            </CardContent>
          </Card>

          {/* Eventos del día seleccionado */}
          {selectedDate.toDateString() !== new Date().toDateString() && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  {selectedDate.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
                <CardDescription>
                  {selectedDateEvents.length} evento(s) programado(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-3">
                        {getEventTypeIcon(event.type)}
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          {event.notes && (
                            <p className="text-xs text-gray-600">{event.notes}</p>
                          )}
                        </div>
                      </div>
                      {getEventTypeBadge(event.type)}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay eventos programados para esta fecha
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Resumen rápido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Mes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total eventos</span>
                <Badge variant="outline">{getFilteredEvents().length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Horas registradas</span>
                <Badge className="bg-cyan-100 text-cyan-800">
                  {getFilteredEvents().filter(e => e.type === 'work_hours').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Vacaciones</span>
                <Badge className="bg-green-100 text-green-800">
                  {getFilteredEvents().filter(e => e.type === 'vacation').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ausencias</span>
                <Badge className="bg-red-100 text-red-800">
                  {getFilteredEvents().filter(e => e.type === 'absence').length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog para agregar eventos */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Evento al Calendario</DialogTitle>
            <DialogDescription>
              Registra horas, ausencias, vacaciones o anotaciones
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee">Empleado *</Label>
              <Select value={formData.employee} onValueChange={(value) => setFormData({ ...formData, employee: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee} value={employee}>
                      {employee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="type">Tipo de evento *</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha inicio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            {formData.type === 'work_hours' && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startTime">Hora inicio</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => {
                        setFormData({ ...formData, startTime: e.target.value });
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
                        setFormData({ ...formData, endTime: e.target.value });
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
                      onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </>
            )}
            {formData.type === 'note' && (
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título de la anotación"
                />
              </div>
            )}
            <div>
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Información adicional..."
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEvent}>
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkCalendar;


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
import { CalendarDays, Users, Clock, Briefcase, Plus, Edit, Calculator } from "lucide-react";
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

type EventType = 'vacation' | 'absence' | 'work_hours' | 'note';

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

// Festivos de Valencia 2024
const valenciaHolidays2024 = [
  new Date(2024, 0, 1),  // Año Nuevo
  new Date(2024, 0, 6),  // Reyes
  new Date(2024, 2, 19), // San José
  new Date(2024, 2, 29), // Viernes Santo
  new Date(2024, 3, 1),  // Lunes de Pascua
  new Date(2024, 3, 22), // San Vicente Mártir
  new Date(2024, 4, 1),  // Día del Trabajo
  new Date(2024, 5, 24), // San Juan
  new Date(2024, 7, 15), // Asunción
  new Date(2024, 9, 9),  // Día de la Comunidad Valenciana
  new Date(2024, 9, 12), // Día de la Hispanidad
  new Date(2024, 10, 1), // Todos los Santos
  new Date(2024, 11, 6), // Día de la Constitución
  new Date(2024, 11, 8), // Inmaculada
  new Date(2024, 11, 25), // Navidad
];

const WorkCalendar = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "8 horas",
      start: new Date(2024, 5, 3, 9, 0),
      end: new Date(2024, 5, 3, 17, 0),
      type: 'work_hours',
      employee: "Juan Pérez",
      hours: 8
    },
    {
      id: 2,
      title: "Vacaciones",
      start: new Date(2024, 5, 10),
      end: new Date(2024, 5, 14),
      type: 'vacation',
      employee: "Juan Pérez"
    },
    {
      id: 3,
      title: "Ausencia médica",
      start: new Date(2024, 5, 20),
      end: new Date(2024, 5, 20),
      type: 'absence',
      employee: "María García"
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState<string>("Juan Pérez");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    type: "work_hours" as EventType,
    date: "",
    hours: 8,
    startTime: "09:00",
    endTime: "17:00",
    title: "",
    notes: ""
  });

  const employees = ["Juan Pérez", "María García", "Carlos López", "Ana Martín"];

  // Verificar si una fecha es festivo o domingo
  const isHolidayOrSunday = (date: Date) => {
    const isHoliday = valenciaHolidays2024.some(holiday => 
      holiday.toDateString() === date.toDateString()
    );
    const isSunday = date.getDay() === 0;
    return isHoliday || isSunday;
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    
    switch (event.type) {
      case 'vacation':
        backgroundColor = '#059669';
        break;
      case 'absence':
        backgroundColor = '#dc2626';
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

  // Función para obtener el estilo de las fechas (festivos y domingos)
  const dayPropGetter = (date: Date) => {
    if (isHolidayOrSunday(date)) {
      return {
        style: {
          backgroundColor: '#fef3c7', // Color pastel amarillo
          color: '#92400e'
        }
      };
    }
    return {};
  };

  const getEmployeeEvents = () => {
    return events.filter(event => event.employee === selectedEmployee);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString() && 
             event.employee === selectedEmployee;
    });
  };

  // Calcular horas extras del mes
  const calculateMonthlyOvertime = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const monthEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getFullYear() === year &&
             eventDate.getMonth() === month &&
             event.employee === selectedEmployee &&
             event.type === 'work_hours';
    });

    const totalHours = monthEvents.reduce((sum, event) => sum + (event.hours || 0), 0);
    
    // Calcular días laborables del mes (excluyendo festivos y domingos)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workDays = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (!isHolidayOrSunday(date) && date.getDay() !== 6) { // No sábados tampoco
        workDays++;
      }
    }
    
    const expectedHours = workDays * 8; // 8 horas por día laborable
    const overtime = Math.max(0, totalHours - expectedHours);
    
    return { totalHours, expectedHours, overtime, workDays };
  };

  const monthlyStats = calculateMonthlyOvertime();

  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case 'vacation':
        return <CalendarDays className="w-4 h-4" />;
      case 'absence':
        return <Users className="w-4 h-4" />;
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
      case 'work_hours':
        return <Badge className="bg-cyan-100 text-cyan-800">Horas</Badge>;
      case 'note':
        return <Badge className="bg-amber-100 text-amber-800">Nota</Badge>;
      default:
        return <Badge variant="secondary">Evento</Badge>;
    }
  };

  const handleAddEvent = (slotInfo?: any) => {
    const selectedDate = slotInfo ? slotInfo.start : new Date();
    setFormData({
      type: "work_hours",
      date: selectedDate.toISOString().split('T')[0],
      hours: 8,
      startTime: "09:00",
      endTime: "17:00",
      title: "",
      notes: ""
    });
    setIsDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!formData.date) {
      toast({
        title: "Error",
        description: "Por favor selecciona una fecha",
        variant: "destructive"
      });
      return;
    }

    const eventDate = new Date(formData.date);
    let startDateTime, endDateTime;
    let title = "";

    if (formData.type === 'work_hours') {
      startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      endDateTime = new Date(`${formData.date}T${formData.endTime}`);
      title = `${formData.hours}h`;
    } else {
      startDateTime = new Date(formData.date);
      endDateTime = new Date(formData.date);
      
      if (formData.type === 'vacation') {
        title = "Vacaciones";
      } else if (formData.type === 'absence') {
        title = "Ausencia";
      } else {
        title = formData.title || "Nota";
      }
    }

    const newEvent: CalendarEvent = {
      id: Date.now(),
      title,
      start: startDateTime,
      end: endDateTime,
      type: formData.type,
      employee: selectedEmployee,
      hours: formData.type === 'work_hours' ? formData.hours : undefined,
      notes: formData.notes || undefined
    };

    setEvents([...events, newEvent]);
    toast({
      title: "Evento añadido",
      description: `Evento agregado para ${selectedEmployee}`
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

  const todaysEvents = getEventsForDate(new Date());

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Calendario de {selectedEmployee}
          </h2>
          <p className="text-gray-600">
            Gestiona horas diarias, vacaciones y ausencias
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee} value={employee}>
                  {employee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => handleAddEvent()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Calendario - {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </CardTitle>
              <CardDescription>
                Haz clic en una fecha para añadir horas o eventos. 
                <span className="block text-amber-600 mt-1">
                  Las fechas en amarillo son festivos o domingos
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '500px' }}>
                <Calendar
                  localizer={localizer}
                  events={getEmployeeEvents()}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={eventStyleGetter}
                  dayPropGetter={dayPropGetter}
                  onSelectSlot={handleAddEvent}
                  onNavigate={(date) => setCurrentMonth(date)}
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
          {/* Resumen mensual de horas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Resumen Mensual
              </CardTitle>
              <CardDescription>
                {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Días laborables</span>
                <Badge variant="outline">{monthlyStats.workDays}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Horas esperadas</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {monthlyStats.expectedHours}h
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Horas trabajadas</span>
                <Badge className="bg-cyan-100 text-cyan-800">
                  {monthlyStats.totalHours}h
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Horas extras</span>
                <Badge className={monthlyStats.overtime > 0 ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"}>
                  {monthlyStats.overtime}h
                </Badge>
              </div>
            </CardContent>
          </Card>

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

          {/* Próximos festivos */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Festivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {valenciaHolidays2024
                .filter(holiday => holiday > new Date())
                .slice(0, 3)
                .map((holiday, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{holiday.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
                    <Badge variant="outline" className="text-xs">Festivo</Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog para agregar eventos */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <Select value={formData.type} onValueChange={(value: EventType) => setFormData({ ...formData, type: value })}>
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
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
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

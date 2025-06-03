
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { CalendarEvent, EventFormData, EventType } from "@/types/calendar";
import { EventForm } from "./calendar/EventForm";
import { MonthlyStats } from "./calendar/MonthlyStats";
import { EventsList } from "./calendar/EventsList";
import { HolidaysList } from "./calendar/HolidaysList";
import { valenciaHolidays2024, isHolidayOrSunday } from "@/utils/holidayUtils";
import { calculateMonthlyOvertime, getEventsForDate, getEmployeeEvents } from "@/utils/calendarUtils";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState<EventFormData>({
    type: "work_hours" as EventType,
    date: "",
    hours: 8,
    startTime: "09:00",
    endTime: "17:00",
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

  const monthlyStats = calculateMonthlyOvertime(events, selectedEmployee, currentMonth);
  const todaysEvents = getEventsForDate(events, new Date(), selectedEmployee);
  const employeeEvents = getEmployeeEvents(events, selectedEmployee);

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
                  events={employeeEvents}
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
          <MonthlyStats stats={monthlyStats} currentMonth={currentMonth} />
          <EventsList events={todaysEvents} />
          <HolidaysList holidays={valenciaHolidays2024} />
        </div>
      </div>

      <EventForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSaveEvent}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
};

export default WorkCalendar;


import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Clock, Briefcase } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: 'vacation' | 'absence' | 'meeting' | 'deadline';
  employee?: string;
}

const WorkCalendar = () => {
  const [events] = useState<CalendarEvent[]>([
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
      title: "Reunión de equipo",
      start: new Date(2024, 5, 5, 10, 0),
      end: new Date(2024, 5, 5, 11, 0),
      type: 'meeting'
    },
    {
      id: 4,
      title: "Entrega proyecto",
      start: new Date(2024, 5, 15),
      end: new Date(2024, 5, 15),
      type: 'deadline'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());

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
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const todaysEvents = getEventsForDate(new Date());
  const selectedDateEvents = getEventsForDate(selectedDate);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'vacation':
        return <CalendarDays className="w-4 h-4" />;
      case 'absence':
        return <Users className="w-4 h-4" />;
      case 'meeting':
        return <Briefcase className="w-4 h-4" />;
      case 'deadline':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'vacation':
        return <Badge className="bg-green-100 text-green-800">Vacaciones</Badge>;
      case 'absence':
        return <Badge className="bg-red-100 text-red-800">Ausencia</Badge>;
      case 'meeting':
        return <Badge className="bg-purple-100 text-purple-800">Reunión</Badge>;
      case 'deadline':
        return <Badge className="bg-orange-100 text-orange-800">Fecha límite</Badge>;
      default:
        return <Badge variant="secondary">Evento</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Calendario de Trabajo</h2>
        <p className="text-gray-600">Visualiza vacaciones, ausencias y eventos importantes</p>
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
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={eventStyleGetter}
                  onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
                  selectable
                  culture="es"
                  messages={{
                    next: "Siguiente",
                    previous: "Anterior",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    agenda: "Agenda",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "No hay eventos en este rango",
                    showMore: (total) => `+ Ver más (${total})`
                  }}
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
                <Calendar className="w-5 h-5" />
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
                        {event.employee && (
                          <p className="text-xs text-gray-600">{event.employee}</p>
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
                          {event.employee && (
                            <p className="text-xs text-gray-600">{event.employee}</p>
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
                <Badge variant="outline">{events.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Vacaciones</span>
                <Badge className="bg-green-100 text-green-800">
                  {events.filter(e => e.type === 'vacation').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ausencias</span>
                <Badge className="bg-red-100 text-red-800">
                  {events.filter(e => e.type === 'absence').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Reuniones</span>
                <Badge className="bg-purple-100 text-purple-800">
                  {events.filter(e => e.type === 'meeting').length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkCalendar;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Clock, Edit } from "lucide-react";
import { CalendarEvent, EventType } from "@/types/calendar";

interface EventsListProps {
  events: CalendarEvent[];
}

export const EventsList = ({ events }: EventsListProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Eventos de Hoy
        </CardTitle>
        <CardDescription>
          {events.length} evento(s) programado(s)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length > 0 ? (
          events.map((event) => (
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
  );
};

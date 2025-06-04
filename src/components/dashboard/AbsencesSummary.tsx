
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Absence } from '@/types/calendar';
import { CalendarX, Clock, CheckCircle } from 'lucide-react';

interface AbsencesSummaryProps {
  absences: Absence[];
}

const AbsencesSummary: React.FC<AbsencesSummaryProps> = ({ absences }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <CalendarX className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobada';
      case 'pending': return 'Pendiente';
      default: return 'Rechazada';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'vacation': return 'Vacaciones';
      case 'sick': return 'Enfermedad';
      case 'personal': return 'Personal';
      default: return 'Otro';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarX className="h-5 w-5" />
          <span>Resumen de Ausencias</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {absences.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay ausencias registradas</p>
          ) : (
            absences.map((absence) => (
              <div key={absence.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(absence.status)}
                  <div>
                    <h4 className="font-medium">{absence.employeeName}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{getTypeText(absence.type)}</span>
                      <span>•</span>
                      <span>{absence.days} día(s)</span>
                      <span>•</span>
                      <span>{absence.startDate} - {absence.endDate}</span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={absence.status === 'approved' ? 'default' : absence.status === 'pending' ? 'secondary' : 'destructive'}
                >
                  {getStatusText(absence.status)}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AbsencesSummary;

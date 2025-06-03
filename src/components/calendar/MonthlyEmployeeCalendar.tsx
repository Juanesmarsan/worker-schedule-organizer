
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DayCell } from "./DayCell";

interface MonthlyEmployeeCalendarProps {
  employee: string;
  workHours: Record<string, number>;
  onHoursChange: (date: Date, hours: number) => void;
  onDateChange?: (date: Date) => void;
}

export const MonthlyEmployeeCalendar = ({ 
  employee, 
  workHours, 
  onHoursChange,
  onDateChange
}: MonthlyEmployeeCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Notificar cambios de fecha al componente padre
  useEffect(() => {
    if (onDateChange) {
      onDateChange(currentDate);
    }
  }, [currentDate, onDateChange]);

  // Obtener el primer día del mes y cuántos días tiene
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Ajustar para que lunes sea 0
  const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const renderCalendarDays = () => {
    const days = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < adjustedStartingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24"></div>
      );
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayKey = getDayKey(date);
      const hours = workHours[dayKey];

      days.push(
        <DayCell
          key={dayKey}
          date={date}
          employee={employee}
          workHours={hours}
          onHoursChange={onHoursChange}
        />
      );
    }

    return days;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {employee} - {currentDate.toLocaleDateString('es-ES', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
        <div className="mt-4 text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span>Días festivos (España y Valencia)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span>Horas estándar (8h)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
            <span>Horas trabajadas (editable)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

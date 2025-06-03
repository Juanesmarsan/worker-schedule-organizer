import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isHoliday, isHolidayOrSunday } from "@/utils/holidayUtils";

interface DayCellProps {
  date: Date;
  employee: string;
  workHours?: number;
  onHoursChange: (date: Date, hours: number) => void;
  isVacationDay?: boolean;
}

export const DayCell = ({ date, employee, workHours, onHoursChange, isVacationDay }: DayCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempHours, setTempHours] = useState(workHours?.toString() || "");

  const isHolidayDate = isHoliday(date);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;
  const isVacation = isVacationDay || false;

  console.log(`Fecha: ${date.toDateString()}, Es festivo: ${isHolidayDate}, Es domingo: ${isSunday}, Es fin de semana: ${isWeekend}, Es vacación: ${isVacation}`);

  const handleSave = () => {
    const hours = parseFloat(tempHours) || 0;
    onHoursChange(date, hours);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempHours(workHours?.toString() || "");
    setIsEditing(false);
  };

  // Si es un día de vacaciones, mostrarlo con fondo verde suave
  if (isVacation) {
    return (
      <div className="w-full h-24 bg-green-50 border border-green-200 rounded p-1">
        <div className="text-xs text-green-600 mb-1">
          {date.toLocaleDateString('es-ES', { day: 'numeric' })}
        </div>
        <div className="flex h-16">
          {/* Lado izquierdo - 8 horas para vacaciones */}
          <div className="flex-1 bg-green-100 border-r border-green-200 flex items-center justify-center">
            <span className="text-green-700 font-bold text-lg">8</span>
          </div>
          
          {/* Lado derecho - Horas editables para vacaciones */}
          <div className="flex-1 flex items-center justify-center p-1">
            {isEditing ? (
              <div className="w-full">
                <Input
                  type="number"
                  value={tempHours}
                  onChange={(e) => setTempHours(e.target.value)}
                  className="h-8 text-xs text-center"
                  onBlur={handleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-full text-xs p-1"
                onClick={() => setIsEditing(true)}
              >
                {workHours || '8'}h
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Si es un día festivo, mostrarlo con fondo rojo suave
  if (isHolidayDate) {
    return (
      <div className="w-full h-24 bg-red-50 border border-red-200 rounded p-1">
        <div className="text-xs text-red-600 mb-1">
          {date.toLocaleDateString('es-ES', { day: 'numeric' })}
        </div>
        <div className="flex h-16">
          {/* Lado izquierdo - 0 para festivos */}
          <div className="flex-1 bg-red-100 border-r border-red-200 flex items-center justify-center">
            <span className="text-red-700 font-bold text-lg">0</span>
          </div>
          
          {/* Lado derecho - Horas editables para festivos */}
          <div className="flex-1 flex items-center justify-center p-1">
            {isEditing ? (
              <div className="w-full">
                <Input
                  type="number"
                  value={tempHours}
                  onChange={(e) => setTempHours(e.target.value)}
                  className="h-8 text-xs text-center"
                  onBlur={handleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-full text-xs p-1"
                onClick={() => setIsEditing(true)}
              >
                {workHours || '0'}h
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Si es domingo (pero no festivo), también con fondo rojo suave
  if (isSunday) {
    return (
      <div className="w-full h-24 bg-red-50 border border-red-200 rounded p-1">
        <div className="text-xs text-red-600 mb-1">
          {date.toLocaleDateString('es-ES', { day: 'numeric' })}
        </div>
        <div className="flex h-16">
          {/* Lado izquierdo - 0 para domingos */}
          <div className="flex-1 bg-red-100 border-r border-red-200 flex items-center justify-center">
            <span className="text-red-700 font-bold text-lg">0</span>
          </div>
          
          {/* Lado derecho - Horas editables para domingos */}
          <div className="flex-1 flex items-center justify-center p-1">
            {isEditing ? (
              <div className="w-full">
                <Input
                  type="number"
                  value={tempHours}
                  onChange={(e) => setTempHours(e.target.value)}
                  className="h-8 text-xs text-center"
                  onBlur={handleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-full text-xs p-1"
                onClick={() => setIsEditing(true)}
              >
                {workHours || '0'}h
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Si es sábado - como día laboral pero con 0 horas estándar
  if (isSaturday) {
    return (
      <div className="w-full h-24 bg-white border border-gray-200 rounded p-1">
        <div className="text-xs text-gray-500 mb-1">
          {date.toLocaleDateString('es-ES', { day: 'numeric' })}
        </div>
        <div className="flex h-16">
          {/* Lado izquierdo - 0 horas estándar para sábados */}
          <div className="flex-1 bg-blue-50 border-r border-gray-200 flex items-center justify-center">
            <span className="text-blue-700 font-bold text-lg">0</span>
          </div>
          
          {/* Lado derecho - Horas editables */}
          <div className="flex-1 flex items-center justify-center p-1">
            {isEditing ? (
              <div className="w-full">
                <Input
                  type="number"
                  value={tempHours}
                  onChange={(e) => setTempHours(e.target.value)}
                  className="h-8 text-xs text-center"
                  onBlur={handleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-full text-xs p-1"
                onClick={() => setIsEditing(true)}
              >
                {workHours || '0'}h
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Día laboral normal (lunes a viernes)
  return (
    <div className="w-full h-24 bg-white border border-gray-200 rounded p-1">
      <div className="text-xs text-gray-500 mb-1">
        {date.toLocaleDateString('es-ES', { day: 'numeric' })}
      </div>
      <div className="flex h-16">
        {/* Lado izquierdo - Horas estándar */}
        <div className="flex-1 bg-blue-50 border-r border-gray-200 flex items-center justify-center">
          <span className="text-blue-700 font-bold text-lg">8</span>
        </div>
        
        {/* Lado derecho - Horas editables */}
        <div className="flex-1 flex items-center justify-center p-1">
          {isEditing ? (
            <div className="w-full">
              <Input
                type="number"
                value={tempHours}
                onChange={(e) => setTempHours(e.target.value)}
                className="h-8 text-xs text-center"
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full text-xs p-1"
              onClick={() => setIsEditing(true)}
            >
              {workHours || '0'}h
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

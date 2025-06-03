
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isHoliday } from "@/utils/holidayUtils";

interface DayCellProps {
  date: Date;
  employee: string;
  workHours?: number;
  onHoursChange: (date: Date, hours: number) => void;
  absenceType?: string | null;
}

export const DayCell = ({ date, employee, workHours, onHoursChange, absenceType }: DayCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempHours, setTempHours] = useState(workHours?.toString() || "");

  const isHolidayDate = isHoliday(date);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isSunday = date.getDay() === 0;
  const isSaturday = date.getDay() === 6;

  console.log(`Fecha: ${date.toDateString()}, Es festivo: ${isHolidayDate}, Es domingo: ${isSunday}, Es fin de semana: ${isWeekend}, Tipo ausencia: ${absenceType}`);

  const handleSave = () => {
    const hours = parseFloat(tempHours) || 0;
    onHoursChange(date, hours);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempHours(workHours?.toString() || "");
    setIsEditing(false);
  };

  // Función para obtener las horas por defecto según el tipo de ausencia
  const getDefaultHours = (type: string | null) => {
    switch (type) {
      case 'vacation':
      case 'sick':
      case 'work_leave':
        return '8';
      case 'personal':
      case 'other':
      default:
        return '0';
    }
  };

  // Función para obtener los estilos según el tipo de ausencia
  const getAbsenceStyles = (type: string | null) => {
    switch (type) {
      case 'vacation':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          textColor: 'text-green-600',
          leftBg: 'bg-green-100',
          leftBorder: 'border-green-200',
          leftText: 'text-green-700'
        };
      case 'sick':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          textColor: 'text-orange-600',
          leftBg: 'bg-orange-100',
          leftBorder: 'border-orange-200',
          leftText: 'text-orange-700'
        };
      case 'work_leave':
        return {
          bg: 'bg-red-700',
          border: 'border-red-800',
          textColor: 'text-white',
          leftBg: 'bg-red-800',
          leftBorder: 'border-red-900',
          leftText: 'text-white'
        };
      case 'personal':
      case 'other':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          textColor: 'text-yellow-600',
          leftBg: 'bg-yellow-100',
          leftBorder: 'border-yellow-200',
          leftText: 'text-yellow-700'
        };
      default:
        return null;
    }
  };

  // Si hay una ausencia, mostrarla con el color correspondiente
  if (absenceType) {
    const styles = getAbsenceStyles(absenceType);
    const defaultHours = getDefaultHours(absenceType);
    
    if (styles) {
      return (
        <div className={`w-full h-24 ${styles.bg} border ${styles.border} rounded p-1`}>
          <div className={`text-xs ${styles.textColor} mb-1`}>
            {date.toLocaleDateString('es-ES', { day: 'numeric' })}
          </div>
          <div className="flex h-16">
            {/* Lado izquierdo - Horas por defecto según tipo */}
            <div className={`flex-1 ${styles.leftBg} border-r ${styles.leftBorder} flex items-center justify-center`}>
              <span className={`${styles.leftText} font-bold text-lg`}>{defaultHours}</span>
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
                  className={`h-8 w-full text-xs p-1 ${absenceType === 'work_leave' ? 'text-white hover:bg-red-600' : ''}`}
                  onClick={() => setIsEditing(true)}
                >
                  {workHours || defaultHours}h
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }
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

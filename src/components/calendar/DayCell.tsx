
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isHoliday, isHolidayOrSunday } from "@/utils/holidayUtils";

interface DayCellProps {
  date: Date;
  employee: string;
  workHours?: number;
  onHoursChange: (date: Date, hours: number) => void;
}

export const DayCell = ({ date, employee, workHours, onHoursChange }: DayCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempHours, setTempHours] = useState(workHours?.toString() || "");

  const isHolidayDate = isHoliday(date);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isWorkDay = !isHolidayOrSunday(date) && !isWeekend;

  const handleSave = () => {
    const hours = parseFloat(tempHours) || 0;
    onHoursChange(date, hours);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempHours(workHours?.toString() || "");
    setIsEditing(false);
  };

  if (isHolidayDate) {
    return (
      <div className="w-full h-24 bg-red-50 border border-red-200 rounded p-2 flex flex-col items-center justify-center">
        <span className="text-red-700 text-xs font-medium mb-1">FESTIVO</span>
        <span className="text-red-600 text-sm font-semibold">
          {date.toLocaleDateString('es-ES', { day: 'numeric' })}
        </span>
      </div>
    );
  }

  if (!isWorkDay) {
    return (
      <div className="w-full h-24 bg-gray-100 border border-gray-200 rounded p-1 flex items-center justify-center">
        <span className="text-gray-500 text-sm">
          {date.toLocaleDateString('es-ES', { day: 'numeric' })}
        </span>
      </div>
    );
  }

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

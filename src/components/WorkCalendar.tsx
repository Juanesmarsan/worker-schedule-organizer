
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MonthlyEmployeeCalendar } from "./calendar/MonthlyEmployeeCalendar";
import { MonthlyStats } from "./calendar/MonthlyStats";
import { HolidaysList } from "./calendar/HolidaysList";
import { getAllHolidays, isHoliday } from "@/utils/holidayUtils";
import { useToast } from "@/hooks/use-toast";
import { MonthlyStats as MonthlyStatsType } from "@/types/calendar";

const WorkCalendar = () => {
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("Juan Pérez");
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Almacenar las horas trabajadas por empleado y fecha
  const [employeeWorkHours, setEmployeeWorkHours] = useState<Record<string, Record<string, number>>>({
    "Juan Pérez": {},
    "María García": {},
    "Carlos López": {},
    "Ana Martín": {}
  });

  const employees = ["Juan Pérez", "María García", "Carlos López", "Ana Martín"];
  
  // Obtener festivos del año actual
  const currentYear = currentDate.getFullYear();
  const currentYearHolidays = getAllHolidays(currentYear);

  const handleHoursChange = (date: Date, hours: number) => {
    const dateKey = date.toISOString().split('T')[0];
    
    setEmployeeWorkHours(prev => ({
      ...prev,
      [selectedEmployee]: {
        ...prev[selectedEmployee],
        [dateKey]: hours
      }
    }));

    toast({
      title: "Horas actualizadas",
      description: `${hours} horas registradas para ${selectedEmployee} el ${date.toLocaleDateString('es-ES')}`
    });
  };

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const currentEmployeeHours = employeeWorkHours[selectedEmployee] || {};

  // Calcular estadísticas mensuales
  const calculateMonthlyStats = (): MonthlyStatsType => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Obtener días del mes
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workDays = 0;
    let totalHours = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Domingo o sábado
      const isHolidayDate = isHoliday(date);
      
      // Solo contar días laborables (lunes a viernes, no festivos)
      if (!isWeekend && !isHolidayDate) {
        workDays++;
      }
      
      // Sumar horas trabajadas de todos los días
      const dateKey = date.toISOString().split('T')[0];
      const hoursWorked = currentEmployeeHours[dateKey] || 0;
      totalHours += hoursWorked;
    }
    
    const expectedHours = workDays * 8; // 8 horas por día laboral
    const overtime = Math.max(0, totalHours - expectedHours);
    
    return {
      workDays,
      expectedHours,
      totalHours,
      overtime
    };
  };

  const monthlyStats = calculateMonthlyStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Calendario Individual de Empleados
          </h2>
          <p className="text-gray-600">
            Gestiona las horas diarias de cada empleado. Los festivos aparecen en rojo.
          </p>
        </div>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendario principal */}
        <div className="lg:col-span-3">
          <MonthlyEmployeeCalendar
            employee={selectedEmployee}
            workHours={currentEmployeeHours}
            onHoursChange={handleHoursChange}
            onDateChange={handleDateChange}
          />
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          <MonthlyStats stats={monthlyStats} currentMonth={currentDate} />
          
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Horas registradas:</span>
                  <span className="font-medium">
                    {Object.values(currentEmployeeHours).reduce((sum, hours) => sum + hours, 0)}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Días con horas:</span>
                  <span className="font-medium">
                    {Object.keys(currentEmployeeHours).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <HolidaysList holidays={currentYearHolidays} />
        </div>
      </div>
    </div>
  );
};

export default WorkCalendar;

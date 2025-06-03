
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MonthlyEmployeeCalendar } from "./calendar/MonthlyEmployeeCalendar";
import { MonthlyStats } from "./calendar/MonthlyStats";
import { HolidaysList } from "./calendar/HolidaysList";
import { getAllHolidays, isHoliday } from "@/utils/holidayUtils";
import { useToast } from "@/hooks/use-toast";
import { MonthlyStats as MonthlyStatsType, Absence } from "@/types/calendar";
import { Project } from "@/types/project";

interface WorkCalendarProps {
  absences?: Absence[];
  onAbsenceAdded?: (absence: Absence) => void;
  onAbsenceStatusChange?: (id: number, status: 'approved' | 'rejected') => void;
  projects?: Project[]; // Añadir proyectos para calcular beneficios
}

const WorkCalendar = ({ absences = [], onAbsenceAdded, onAbsenceStatusChange, projects = [] }: WorkCalendarProps) => {
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

  // Función para verificar el tipo de ausencia de un día específico
  const getAbsenceType = (date: Date, employee: string): string | null => {
    const dateStr = date.toISOString().split('T')[0];
    const absence = absences.find(absence => 
      absence.employeeName === employee &&
      absence.status === 'approved' &&
      dateStr >= absence.startDate &&
      dateStr <= absence.endDate
    );
    return absence ? absence.type : null;
  };

  // Función para obtener información del proyecto donde trabajó el empleado en una fecha específica
  const getProjectWorkInfo = (date: Date, employee: string) => {
    const dateStr = date.toISOString().split('T')[0];
    
    for (const project of projects) {
      if (project.type === "administracion") {
        const worker = project.workers.find(w => w.name === employee);
        if (worker) {
          const workDay = worker.workDays.find(wd => wd.date === dateStr);
          if (workDay) {
            return {
              project,
              hours: workDay.hours,
              hourlyRate: project.hourlyRate || worker.hourlyRate || 0
            };
          }
        }
      }
    }
    return null;
  };

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

  // Calcular estadísticas mensuales incluyendo beneficio bruto
  const calculateMonthlyStats = (): MonthlyStatsType & { grossProfit: number } => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Obtener días del mes
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workDays = 0;
    let totalHours = 0;
    let laboralHours = 0;
    let grossProfit = 0; // Nueva variable para beneficio bruto
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHolidayDate = isHoliday(date);
      const absenceType = getAbsenceType(date, selectedEmployee);
      
      // Solo contar días laborables (lunes a viernes, no festivos)
      if (!isWeekend && !isHolidayDate) {
        workDays++;
      }
      
      // Sumar horas trabajadas de todos los días
      const dateKey = date.toISOString().split('T')[0];
      const hoursWorked = currentEmployeeHours[dateKey] || 0;
      totalHours += hoursWorked;
      
      // Sumar horas laborales (solo días laborables, no festivos ni domingos)
      if (!isHolidayDate && dayOfWeek !== 0) {
        laboralHours += hoursWorked;
      }

      // Calcular beneficio bruto solo para días sin ausencias
      if (!absenceType && !isHolidayDate && hoursWorked > 0) {
        const projectInfo = getProjectWorkInfo(date, selectedEmployee);
        if (projectInfo) {
          grossProfit += projectInfo.hours * projectInfo.hourlyRate;
        }
      }
    }
    
    const expectedHours = workDays * 8;
    const overtime = Math.max(0, totalHours - expectedHours);
    
    return {
      workDays,
      expectedHours,
      totalHours,
      overtime,
      laboralHours,
      grossProfit
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
            getAbsenceType={(date) => getAbsenceType(date, selectedEmployee)}
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
                <div className="flex justify-between">
                  <span>Horas laborales:</span>
                  <span className="font-medium">
                    {monthlyStats.laboralHours}h
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium text-green-700">Beneficio bruto:</span>
                  <span className="font-bold text-green-700">
                    {monthlyStats.grossProfit.toFixed(2)}€
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

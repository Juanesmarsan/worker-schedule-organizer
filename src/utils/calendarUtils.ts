
import { CalendarEvent, MonthlyStats } from "@/types/calendar";
import { isHolidayOrSunday } from "./holidayUtils";

export const calculateMonthlyOvertime = (
  events: CalendarEvent[],
  selectedEmployee: string,
  currentMonth: Date
): MonthlyStats => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getFullYear() === year &&
           eventDate.getMonth() === month &&
           event.employee === selectedEmployee &&
           event.type === 'work_hours';
  });

  const totalHours = monthEvents.reduce((sum, event) => sum + (event.hours || 0), 0);
  
  // Calcular días laborables del mes (excluyendo festivos y domingos)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let workDays = 0;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (!isHolidayOrSunday(date) && date.getDay() !== 6) { // No sábados tampoco
      workDays++;
    }
  }
  
  const expectedHours = workDays * 8; // 8 horas por día laborable
  const overtime = Math.max(0, totalHours - expectedHours);
  
  return { totalHours, expectedHours, overtime, workDays };
};

export const getEventsForDate = (events: CalendarEvent[], date: Date, selectedEmployee: string) => {
  return events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === date.toDateString() && 
           event.employee === selectedEmployee;
  });
};

export const getEmployeeEvents = (events: CalendarEvent[], selectedEmployee: string) => {
  return events.filter(event => event.employee === selectedEmployee);
};

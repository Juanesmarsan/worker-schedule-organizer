
import { MonthlyStats } from "@/types/calendar";

export const calculateMonthlyStats = (
  year: number,
  month: number,
  workHours: Record<string, number>,
  getAbsenceType: (date: Date) => string | null
): MonthlyStats => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let workDays = 0;
  let totalHours = 0;
  let laboralHours = 0;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (!isWeekend) {
      workDays++;
    }
    
    const dateKey = date.toISOString().split('T')[0];
    const hoursWorked = workHours[dateKey] || 0;
    totalHours += hoursWorked;
    
    if (!isWeekend && dayOfWeek !== 0) {
      laboralHours += hoursWorked;
    }
  }
  
  const expectedHours = workDays * 8;
  const overtime = Math.max(0, totalHours - expectedHours);
  
  return {
    workDays,
    expectedHours,
    totalHours,
    overtime,
    laboralHours
  };
};

export const isHoliday = (date: Date): boolean => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const holidays = [
    '1-1', '1-6', '5-1', '8-15', '10-12', '11-1', '12-6', '12-8', '12-25'
  ];
  
  return holidays.includes(`${month}-${day}`);
};


export type EventType = 'vacation' | 'absence' | 'work_hours' | 'note';

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  employee: string;
  hours?: number;
  notes?: string;
}

export interface EventFormData {
  type: EventType;
  date: string;
  hours: number;
  startTime: string;
  endTime: string;
  title: string;
  notes: string;
}

export interface MonthlyStats {
  totalHours: number;
  expectedHours: number;
  overtime: number;
  workDays: number;
  laboralHours?: number;
}

// Tipo para las ausencias
export interface Absence {
  id: number;
  employeeName: string;
  type: 'vacation' | 'sick' | 'personal' | 'other' | 'work_leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

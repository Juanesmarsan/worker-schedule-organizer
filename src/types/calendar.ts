
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
}

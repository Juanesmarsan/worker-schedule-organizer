
export interface MonthlyStats {
  workDays: number;
  expectedHours: number;
  totalHours: number;
  overtime: number;
  laboralHours: number;
  grossProfit?: number;
}

export interface Absence {
  id: number;
  employeeName: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  days: number;
  reason: string;
}

export interface WorkEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  type: 'work' | 'meeting' | 'training' | 'other';
  description?: string;
  employeeName?: string;
}

export type EventType = 'vacation' | 'absence' | 'work_hours' | 'note';

export interface EventFormData {
  type: EventType;
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  hours: number;
  notes: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  type: EventType;
  notes?: string;
  employee?: string;
  start: Date;
  end: Date;
  hours?: number;
}

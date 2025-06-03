
export interface MonthlyStats {
  workDays: number;
  expectedHours: number;
  totalHours: number;
  overtime: number;
  laboralHours: number;
}

export interface Absence {
  id: number;
  employeeName: string;
  type: 'vacation' | 'sick' | 'personal' | 'other';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
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

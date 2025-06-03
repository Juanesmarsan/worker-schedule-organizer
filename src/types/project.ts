
export interface VariableExpense {
  id: number;
  concept: string;
  amount: number;
  date: Date;
  note?: string;
  receipt?: File;
  paymentMethod: "transferencia" | "efectivo" | "tarjeta";
  creditCardNumber?: string;
}

export interface ProjectWorker {
  id: number;
  name: string;
  hourlyRate?: number; // Solo para proyectos de administración
  workDays: {
    date: string; // formato YYYY-MM-DD
    hours: number;
  }[];
}

export interface Project {
  id: number;
  name: string;
  type: "presupuesto" | "administracion";
  budget?: number;
  hourlyRate?: number;
  description: string;
  status: "activo" | "completado" | "pausado";
  createdAt: Date;
  variableExpenses: VariableExpense[];
  workers: ProjectWorker[];
}

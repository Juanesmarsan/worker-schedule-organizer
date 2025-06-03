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

export interface Project {
  id: number;
  name: string;
  type: "presupuesto" | "administracion";
  budget?: number;
  description: string;
  status: "activo" | "completado" | "pausado";
  createdAt: Date;
  variableExpenses: VariableExpense[];
}

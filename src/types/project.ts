
export interface VariableExpense {
  id: number;
  concept: string;
  amount: number;
  date: Date;
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

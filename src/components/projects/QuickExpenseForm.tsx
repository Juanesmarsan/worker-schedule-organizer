
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Project, VariableExpense } from "@/types/project";

interface QuickExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject: Project | null;
  onAddExpense: (projectId: number, expense: VariableExpense) => void;
}

const QuickExpenseForm = ({ isOpen, onClose, selectedProject, onAddExpense }: QuickExpenseFormProps) => {
  const [expenseFormData, setExpenseFormData] = useState({
    concept: "",
    amount: ""
  });

  const { toast } = useToast();

  const resetForm = () => {
    setExpenseFormData({ concept: "", amount: "" });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddExpense = () => {
    if (!selectedProject) return;

    if (!expenseFormData.concept.trim() || !expenseFormData.amount.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(expenseFormData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "El importe debe ser un número válido mayor que 0",
        variant: "destructive"
      });
      return;
    }

    const newExpense: VariableExpense = {
      id: Date.now(),
      concept: expenseFormData.concept.trim(),
      amount: amount,
      date: new Date(),
      paymentMethod: "transferencia"
    };

    onAddExpense(selectedProject.id, newExpense);

    toast({
      title: "Gasto agregado",
      description: `Se ha agregado el gasto "${newExpense.concept}" al proyecto "${selectedProject.name}"`,
    });

    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Gasto Variable</DialogTitle>
          <DialogDescription>
            Agregar un nuevo gasto variable al proyecto "{selectedProject?.name}"
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="expense-concept">Concepto</Label>
            <Input
              id="expense-concept"
              placeholder="Ej: Material, mano de obra..."
              value={expenseFormData.concept}
              onChange={(e) => setExpenseFormData({...expenseFormData, concept: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expense-amount">Importe (€)</Label>
            <Input
              id="expense-amount"
              type="number"
              placeholder="0.00"
              value={expenseFormData.amount}
              onChange={(e) => setExpenseFormData({...expenseFormData, amount: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleAddExpense}>
            Agregar Gasto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickExpenseForm;

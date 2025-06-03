
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Project, VariableExpense } from "@/types/project";
import { Upload, CreditCard } from "lucide-react";

interface VariableExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onAddExpense: (projectId: number, expense: Omit<VariableExpense, 'id'>) => void;
}

const VariableExpenseForm = ({ isOpen, onClose, projects, onAddExpense }: VariableExpenseFormProps) => {
  const [formData, setFormData] = useState({
    projectId: "",
    concept: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    note: "",
    paymentMethod: "transferencia" as "transferencia" | "efectivo" | "tarjeta",
    creditCardNumber: ""
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      projectId: "",
      concept: "",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      note: "",
      paymentMethod: "transferencia",
      creditCardNumber: ""
    });
    setReceiptFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!formData.projectId || !formData.concept.trim() || !formData.amount.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios (proyecto, concepto e importe)",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "El importe debe ser un número válido mayor que 0",
        variant: "destructive"
      });
      return;
    }

    if (formData.paymentMethod === "tarjeta" && !formData.creditCardNumber.trim()) {
      toast({
        title: "Error",
        description: "Por favor introduce el número de tarjeta de crédito",
        variant: "destructive"
      });
      return;
    }

    const expense: Omit<VariableExpense, 'id'> = {
      concept: formData.concept.trim(),
      amount: amount,
      date: new Date(formData.date),
      note: formData.note.trim() || undefined,
      receipt: receiptFile || undefined,
      paymentMethod: formData.paymentMethod,
      creditCardNumber: formData.paymentMethod === "tarjeta" ? formData.creditCardNumber.trim() : undefined
    };

    onAddExpense(parseInt(formData.projectId), expense);

    const selectedProject = projects.find(p => p.id === parseInt(formData.projectId));
    toast({
      title: "Gasto agregado",
      description: `Se ha agregado el gasto "${expense.concept}" al proyecto "${selectedProject?.name}"`,
    });

    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Gasto Variable</DialogTitle>
          <DialogDescription>
            Registra un nuevo gasto variable asignándolo a un proyecto específico
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-select">Proyecto *</Label>
            <Select value={formData.projectId} onValueChange={(value) => setFormData({...formData, projectId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un proyecto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name} ({project.type === "presupuesto" ? "Presupuesto" : "Administración"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="concept">Concepto *</Label>
            <Input
              id="concept"
              placeholder="Ej: Material, mano de obra, suministros..."
              value={formData.concept}
              onChange={(e) => setFormData({...formData, concept: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Importe (€) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="payment-method">Método de Pago *</Label>
            <Select value={formData.paymentMethod} onValueChange={(value: "transferencia" | "efectivo" | "tarjeta") => setFormData({...formData, paymentMethod: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transferencia">Transferencia</SelectItem>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.paymentMethod === "tarjeta" && (
            <div className="grid gap-2">
              <Label htmlFor="credit-card">Número de Tarjeta de Crédito *</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="credit-card"
                  placeholder="**** **** **** 1234"
                  value={formData.creditCardNumber}
                  onChange={(e) => setFormData({...formData, creditCardNumber: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="receipt">Factura/Ticket</Label>
            <div className="flex items-center gap-2">
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('receipt')?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {receiptFile ? receiptFile.name : "Subir Factura/Ticket"}
              </Button>
            </div>
            {receiptFile && (
              <p className="text-sm text-muted-foreground">
                Archivo seleccionado: {receiptFile.name}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Nota (opcional)</Label>
            <Textarea
              id="note"
              placeholder="Información adicional sobre el gasto..."
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            Agregar Gasto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VariableExpenseForm;

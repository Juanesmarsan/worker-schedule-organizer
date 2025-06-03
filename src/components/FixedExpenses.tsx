
import { useState } from "react";
import { Plus, Trash2, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface FixedExpense {
  id: number;
  concept: string;
  amount: number;
}

const FixedExpenses = () => {
  const [expenses, setExpenses] = useState<FixedExpense[]>([
    { id: 1, concept: "Alquiler oficina", amount: 1200 },
    { id: 2, concept: "Seguro empresarial", amount: 300 },
    { id: 3, concept: "Suministros", amount: 150 }
  ]);
  const [newConcept, setNewConcept] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const { toast } = useToast();

  // Contraseña para acceder a gastos fijos
  const FIXED_EXPENSES_PASSWORD = "admin123";

  // Simulamos que tenemos 8 operarios activos
  const activeWorkers = 8;

  const handlePasswordSubmit = () => {
    if (passwordInput === FIXED_EXPENSES_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput("");
      toast({
        title: "Acceso concedido",
        description: "Has accedido correctamente a la gestión de gastos fijos",
      });
    } else {
      toast({
        title: "Contraseña incorrecta",
        description: "La contraseña introducida no es válida",
        variant: "destructive"
      });
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado la sesión de gastos fijos",
    });
  };

  // Si no está autenticado, mostrar formulario de contraseña
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="w-12 h-12 text-gray-400" />
            </div>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              Introduce la contraseña para acceder a la gestión de gastos fijos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Introduce la contraseña"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
            </div>
            <Button onClick={handlePasswordSubmit} className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Acceder
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensePerWorker = totalExpenses / activeWorkers;

  const addExpense = () => {
    if (!newConcept.trim() || !newAmount.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "El importe debe ser un número válido mayor que 0",
        variant: "destructive"
      });
      return;
    }

    const newExpense: FixedExpense = {
      id: Date.now(),
      concept: newConcept.trim(),
      amount: amount
    };

    setExpenses([...expenses, newExpense]);
    setNewConcept("");
    setNewAmount("");
    
    toast({
      title: "Gasto agregado",
      description: `Se ha agregado el gasto "${newExpense.concept}"`,
    });
  };

  const removeExpense = (id: number) => {
    const expense = expenses.find(e => e.id === id);
    setExpenses(expenses.filter(e => e.id !== id));
    
    toast({
      title: "Gasto eliminado",
      description: `Se ha eliminado el gasto "${expense?.concept}"`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Gastos Fijos</CardTitle>
              <CardDescription>
                Administra los gastos fijos de la empresa y calcula la repercusión por operario
              </CardDescription>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <Lock className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulario para agregar gastos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="concept">Concepto</Label>
              <Input
                id="concept"
                placeholder="Ej: Alquiler, Seguros..."
                value={newConcept}
                onChange={(e) => setNewConcept(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="amount">Importe (€)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addExpense} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>

          {/* Tabla de gastos */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead className="text-right">Importe</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.concept}</TableCell>
                  <TableCell className="text-right">{expense.amount.toFixed(2)} €</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeExpense(expense.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resumen de gastos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastos Fijos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">Gastos mensuales totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkers}</div>
            <p className="text-xs text-muted-foreground">Trabajadores con cargo de operario</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto por Operario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expensePerWorker.toFixed(2)} €</div>
            <p className="text-xs text-muted-foreground">Repercusión mensual por operario</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FixedExpenses;


import { useState } from "react";
import { Clock, TrendingUp, TrendingDown, User, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface HourRecord {
  id: number;
  employeeName: string;
  date: string;
  hoursWorked: number;
  description: string;
}

interface EmployeeHourSummary {
  name: string;
  requiredHours: number;
  workedHours: number;
  percentage: number;
  status: 'ahead' | 'on-track' | 'behind';
}

const HourTracker = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<HourRecord[]>([
    {
      id: 1,
      employeeName: "Juan Pérez",
      date: "2024-06-03",
      hoursWorked: 8,
      description: "Desarrollo de funcionalidades"
    },
    {
      id: 2,
      employeeName: "María García",
      date: "2024-06-03",
      hoursWorked: 7.5,
      description: "Diseño de interfaces"
    },
    {
      id: 3,
      employeeName: "Carlos López",
      date: "2024-06-03",
      hoursWorked: 8.5,
      description: "Gestión de proyectos"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    date: "",
    hoursWorked: 0,
    description: ""
  });

  const employees = ["Juan Pérez", "María García", "Carlos López"];

  // Calcular resumen de horas por empleado
  const calculateSummary = (): EmployeeHourSummary[] => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return employees.map(employee => {
      const employeeRecords = records.filter(record => 
        record.employeeName === employee &&
        new Date(record.date).getMonth() === currentMonth &&
        new Date(record.date).getFullYear() === currentYear
      );
      
      const workedHours = employeeRecords.reduce((sum, record) => sum + record.hoursWorked, 0);
      const requiredHours = 160; // Horas mensuales requeridas
      const percentage = (workedHours / requiredHours) * 100;
      
      let status: 'ahead' | 'on-track' | 'behind' = 'on-track';
      if (percentage > 105) status = 'ahead';
      else if (percentage < 90) status = 'behind';
      
      return {
        name: employee,
        requiredHours,
        workedHours,
        percentage,
        status
      };
    });
  };

  const handleAddRecord = () => {
    setFormData({
      employeeName: "",
      date: "",
      hoursWorked: 0,
      description: ""
    });
    setIsDialogOpen(true);
  };

  const handleSaveRecord = () => {
    if (!formData.employeeName || !formData.date || formData.hoursWorked <= 0) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const newRecord: HourRecord = {
      id: Date.now(),
      ...formData
    };

    setRecords([...records, newRecord]);
    toast({
      title: "Horas registradas",
      description: "Las horas trabajadas se han registrado correctamente"
    });
    setIsDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ahead':
        return <Badge className="bg-green-100 text-green-800">Por encima</Badge>;
      case 'on-track':
        return <Badge className="bg-blue-100 text-blue-800">En tiempo</Badge>;
      case 'behind':
        return <Badge className="bg-red-100 text-red-800">Retrasado</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ahead':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'behind':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Control de Horas</h2>
          <p className="text-gray-600">Monitorea las horas trabajadas vs. requeridas</p>
        </div>
        <Button onClick={handleAddRecord} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Registrar Horas
        </Button>
      </div>

      {/* Resumen mensual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summary.map((employee) => (
          <Card key={employee.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <CardDescription>Mes actual</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(employee.status)}
                  {getStatusBadge(employee.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{employee.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(employee.percentage, 100)} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Trabajadas</p>
                  <p className="font-semibold text-lg">{employee.workedHours}h</p>
                </div>
                <div>
                  <p className="text-gray-600">Requeridas</p>
                  <p className="font-semibold text-lg">{employee.requiredHours}h</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="text-gray-600">Diferencia</p>
                <p className={`font-semibold ${employee.workedHours - employee.requiredHours >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {employee.workedHours - employee.requiredHours >= 0 ? '+' : ''}{employee.workedHours - employee.requiredHours}h
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Registros recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Registros Recientes</CardTitle>
          <CardDescription>Últimas horas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.slice(-10).reverse().map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium text-gray-900">{record.employeeName}</p>
                    <p className="text-sm text-gray-600">{record.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{record.hoursWorked}h</p>
                  <p className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Horas Trabajadas</DialogTitle>
            <DialogDescription>
              Ingresa las horas trabajadas por el empleado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="employee">Empleado *</Label>
              <Select value={formData.employeeName} onValueChange={(value) => setFormData({ ...formData, employeeName: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee} value={employee}>
                      {employee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hours">Horas trabajadas *</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: parseFloat(e.target.value) || 0 })}
                placeholder="8.0"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción del trabajo</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe las actividades realizadas"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveRecord}>
                Registrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HourTracker;


import { useState, useEffect } from "react";
import { Calendar, Calculator, Save, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hoursPerMonth: number;
  status: 'active' | 'vacation' | 'inactive';
}

interface PayrollData {
  employeeId: number;
  month: string;
  salarioBruto: number;
  seguridadSocialTrabajador: number;
  irpf: number;
  embargos: number;
  seguridadSocialEmpresa: number;
  dietas1: number;
  dietas2: number;
  dietas3: number;
  dietas4: number;
  dietas5: number;
  adelanto1: number;
  adelanto2: number;
  adelanto3: number;
  horasExtras: number;
  horasFestivas: number;
  coeficienteEmpresa: number;
  total: number;
}

const PayrollManager = () => {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  // Datos de ejemplo de empleados - en una app real vendría de props o contexto
  const [employees] = useState<Employee[]>([
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@empresa.com",
      phone: "+34 612 345 678",
      position: "Desarrollador",
      department: "Operario",
      hoursPerMonth: 160,
      status: 'active'
    },
    {
      id: 2,
      name: "María García",
      email: "maria.garcia@empresa.com",
      phone: "+34 623 456 789",
      position: "Diseñadora",
      department: "Diseño",
      hoursPerMonth: 160,
      status: 'active'
    },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos.lopez@empresa.com",
      phone: "+34 634 567 890",
      position: "Operario",
      department: "Operario",
      hoursPerMonth: 160,
      status: 'active'
    },
    {
      id: 4,
      name: "Ana Martín",
      email: "ana.martin@empresa.com",
      phone: "+34 645 678 901",
      position: "Operario",
      department: "Operario",
      hoursPerMonth: 160,
      status: 'active'
    }
  ]);

  const [payrollData, setPayrollData] = useState<PayrollData[]>([]);
  const [gastosFijos] = useState(1650); // Ejemplo: total de gastos fijos

  // Calcular coeficiente de empresa
  const operarios = employees.filter(emp => emp.department === "Operario" && emp.status === 'active');
  const coeficienteEmpresa = operarios.length > 0 ? gastosFijos / operarios.length : 0;

  // Inicializar datos de nómina para el mes seleccionado
  useEffect(() => {
    const existingData = payrollData.filter(data => data.month === selectedMonth);
    const employeesWithData = existingData.map(data => data.employeeId);
    
    const newData = employees
      .filter(emp => emp.status === 'active')
      .filter(emp => !employeesWithData.includes(emp.id))
      .map(emp => ({
        employeeId: emp.id,
        month: selectedMonth,
        salarioBruto: 0,
        seguridadSocialTrabajador: 0,
        irpf: 0,
        embargos: 0,
        seguridadSocialEmpresa: 0,
        dietas1: 0,
        dietas2: 0,
        dietas3: 0,
        dietas4: 0,
        dietas5: 0,
        adelanto1: 0,
        adelanto2: 0,
        adelanto3: 0,
        horasExtras: 0,
        horasFestivas: 0,
        coeficienteEmpresa: emp.department === "Operario" ? coeficienteEmpresa : 0,
        total: 0
      }));

    if (newData.length > 0) {
      setPayrollData([...payrollData, ...newData]);
    }
  }, [selectedMonth, employees, coeficienteEmpresa]);

  const updatePayrollField = (employeeId: number, field: keyof PayrollData, value: number) => {
    setPayrollData(prevData => {
      const updatedData = prevData.map(data => {
        if (data.employeeId === employeeId && data.month === selectedMonth) {
          const updated = { ...data, [field]: value };
          
          // Calcular total automáticamente
          if (field !== 'total') {
            const totalDietas = updated.dietas1 + updated.dietas2 + updated.dietas3 + updated.dietas4 + updated.dietas5;
            const totalAdelantos = updated.adelanto1 + updated.adelanto2 + updated.adelanto3;
            
            updated.total = 
              updated.salarioBruto + 
              updated.horasFestivas + 
              updated.horasExtras - 
              updated.seguridadSocialTrabajador - 
              updated.seguridadSocialEmpresa - 
              updated.irpf - 
              updated.coeficienteEmpresa - 
              totalDietas - 
              updated.embargos - 
              totalAdelantos;
          }
          
          return updated;
        }
        return data;
      });
      return updatedData;
    });
  };

  const savePayroll = () => {
    toast({
      title: "Nóminas guardadas",
      description: `Las nóminas del mes ${selectedMonth} han sido guardadas correctamente`,
    });
  };

  const exportPayroll = () => {
    toast({
      title: "Exportando nóminas",
      description: `Generando archivo Excel para el mes ${selectedMonth}`,
    });
  };

  const getCurrentMonthData = () => {
    return payrollData.filter(data => data.month === selectedMonth);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Nóminas</CardTitle>
            <CardDescription>
              Administra las nóminas mensuales de los empleados
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={savePayroll} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button onClick={exportPayroll}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de mes */}
          <div className="flex items-center gap-4">
            <Label htmlFor="month">Mes:</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(i);
                  const value = `${date.getFullYear()}-${(i + 1).toString().padStart(2, '0')}`;
                  const label = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Información del coeficiente */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4" />
              <span className="font-medium">Coeficiente de Empresa</span>
            </div>
            <p className="text-sm text-gray-600">
              Gastos fijos: {gastosFijos.toFixed(2)} € / Operarios activos: {operarios.length} = 
              <span className="font-medium text-blue-600"> {coeficienteEmpresa.toFixed(2)} € por operario</span>
            </p>
          </div>

          {/* Tabla de nóminas */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Empleado</TableHead>
                  <TableHead>Salario Bruto</TableHead>
                  <TableHead>SS Trabajador</TableHead>
                  <TableHead>IRPF</TableHead>
                  <TableHead>Embargos</TableHead>
                  <TableHead>SS Empresa</TableHead>
                  <TableHead>1 Dieta</TableHead>
                  <TableHead>2 Dietas</TableHead>
                  <TableHead>3 Dietas</TableHead>
                  <TableHead>4 Dietas</TableHead>
                  <TableHead>5 Dietas</TableHead>
                  <TableHead>1 Adelanto</TableHead>
                  <TableHead>2 Adelanto</TableHead>
                  <TableHead>3 Adelanto</TableHead>
                  <TableHead>Horas Extras</TableHead>
                  <TableHead>Horas Festivas</TableHead>
                  <TableHead>Coef. Empresa</TableHead>
                  <TableHead className="font-bold">TOTAL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getCurrentMonthData().map((data) => {
                  const employee = employees.find(emp => emp.id === data.employeeId);
                  if (!employee) return null;

                  return (
                    <TableRow key={`${data.employeeId}-${data.month}`}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{employee.name}</div>
                          <div className="text-xs text-gray-500">{employee.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.salarioBruto}
                          onChange={(e) => updatePayrollField(data.employeeId, 'salarioBruto', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.seguridadSocialTrabajador}
                          onChange={(e) => updatePayrollField(data.employeeId, 'seguridadSocialTrabajador', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.irpf}
                          onChange={(e) => updatePayrollField(data.employeeId, 'irpf', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.embargos}
                          onChange={(e) => updatePayrollField(data.employeeId, 'embargos', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.seguridadSocialEmpresa}
                          onChange={(e) => updatePayrollField(data.employeeId, 'seguridadSocialEmpresa', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.dietas1}
                          onChange={(e) => updatePayrollField(data.employeeId, 'dietas1', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.dietas2}
                          onChange={(e) => updatePayrollField(data.employeeId, 'dietas2', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.dietas3}
                          onChange={(e) => updatePayrollField(data.employeeId, 'dietas3', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.dietas4}
                          onChange={(e) => updatePayrollField(data.employeeId, 'dietas4', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.dietas5}
                          onChange={(e) => updatePayrollField(data.employeeId, 'dietas5', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.adelanto1}
                          onChange={(e) => updatePayrollField(data.employeeId, 'adelanto1', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.adelanto2}
                          onChange={(e) => updatePayrollField(data.employeeId, 'adelanto2', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.adelanto3}
                          onChange={(e) => updatePayrollField(data.employeeId, 'adelanto3', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.horasExtras}
                          onChange={(e) => updatePayrollField(data.employeeId, 'horasExtras', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={data.horasFestivas}
                          onChange={(e) => updatePayrollField(data.employeeId, 'horasFestivas', parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="w-20 p-2 bg-gray-100 rounded text-center text-sm">
                          {data.coeficienteEmpresa.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-24 p-2 bg-green-100 border border-green-300 rounded text-center font-bold">
                          {data.total.toFixed(2)} €
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollManager;

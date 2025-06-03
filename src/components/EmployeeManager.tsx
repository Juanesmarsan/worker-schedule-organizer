
import { useState } from "react";
import { Plus, Edit, Trash2, User, Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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

const EmployeeManager = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@empresa.com",
      phone: "+34 612 345 678",
      position: "Desarrollador",
      department: "IT",
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
      status: 'vacation'
    },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos.lopez@empresa.com",
      phone: "+34 634 567 890",
      position: "Project Manager",
      department: "Gestión",
      hoursPerMonth: 160,
      status: 'active'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    hoursPerMonth: 160
  });

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      hoursPerMonth: 160
    });
    setIsDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      hoursPerMonth: employee.hoursPerMonth
    });
    setIsDialogOpen(true);
  };

  const handleSaveEmployee = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    if (editingEmployee) {
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...formData }
          : emp
      ));
      toast({
        title: "Empleado actualizado",
        description: "Los datos del empleado se han actualizado correctamente"
      });
    } else {
      const newEmployee: Employee = {
        id: Date.now(),
        ...formData,
        status: 'active'
      };
      setEmployees([...employees, newEmployee]);
      toast({
        title: "Empleado agregado",
        description: "El nuevo empleado se ha agregado correctamente"
      });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast({
      title: "Empleado eliminado",
      description: "El empleado se ha eliminado del sistema"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Activo</Badge>;
      case 'vacation':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Vacaciones</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inactivo</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Empleados</h2>
          <p className="text-gray-600">Administra la información de tu equipo</p>
        </div>
        <Button onClick={handleAddEmployee} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Empleado
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <CardDescription>{employee.position}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(employee.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {employee.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {employee.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {employee.department}
              </div>
              <div className="text-sm font-medium text-gray-900">
                Horas/mes: {employee.hoursPerMonth}h
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditEmployee(employee)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Editar Empleado" : "Agregar Nuevo Empleado"}
            </DialogTitle>
            <DialogDescription>
              Completa la información del empleado
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="juan@empresa.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+34 612 345 678"
              />
            </div>
            <div>
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Desarrollador, Diseñador, etc."
              />
            </div>
            <div>
              <Label htmlFor="department">Departamento</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="IT, Diseño, Ventas, etc."
              />
            </div>
            <div>
              <Label htmlFor="hours">Horas por mes</Label>
              <Input
                id="hours"
                type="number"
                value={formData.hoursPerMonth}
                onChange={(e) => setFormData({ ...formData, hoursPerMonth: parseInt(e.target.value) || 160 })}
                placeholder="160"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEmployee}>
                {editingEmployee ? "Actualizar" : "Agregar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManager;

import { useState } from "react";
import { Plus, Calendar, Clock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Absence } from "@/types/calendar";

interface AbsenceTrackerProps {
  absences: Absence[];
  onAbsenceAdded: (absence: Absence) => void;
  onAbsenceStatusChange: (id: number, status: 'approved' | 'rejected') => void;
}

const AbsenceTracker = ({ absences, onAbsenceAdded, onAbsenceStatusChange }: AbsenceTrackerProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: "",
    type: "vacation" as const,
    startDate: "",
    endDate: "",
    reason: ""
  });

  const employees = ["Juan Pérez", "María García", "Carlos López", "Ana Martín"];

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleAddAbsence = () => {
    setFormData({
      employeeName: "",
      type: "vacation",
      startDate: "",
      endDate: "",
      reason: ""
    });
    setIsDialogOpen(true);
  };

  const handleSaveAbsence = () => {
    if (!formData.employeeName || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const days = calculateDays(formData.startDate, formData.endDate);
    const newAbsence: Absence = {
      id: Date.now(),
      ...formData,
      days,
      status: 'pending'
    };

    onAbsenceAdded(newAbsence);
    toast({
      title: "Ausencia registrada",
      description: "La ausencia se ha registrado y está pendiente de aprobación"
    });
    setIsDialogOpen(false);
  };

  const handleStatusChange = (id: number, status: 'approved' | 'rejected') => {
    onAbsenceStatusChange(id, status);
    toast({
      title: `Ausencia ${status === 'approved' ? 'aprobada' : 'rechazada'}`,
      description: "El estado de la ausencia se ha actualizado"
    });
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'vacation':
        return <Badge className="bg-blue-100 text-blue-800">Vacaciones</Badge>;
      case 'sick':
        return <Badge className="bg-orange-100 text-orange-800">Enfermedad</Badge>;
      case 'personal':
        return <Badge className="bg-yellow-100 text-yellow-800">Personal</Badge>;
      case 'work_leave':
        return <Badge className="bg-amber-100 text-amber-800">Baja Laboral</Badge>;
      case 'other':
        return <Badge className="bg-gray-100 text-gray-800">Otro</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600">Pendiente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rechazada</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Control de Ausencias</h2>
          <p className="text-gray-600">Gestiona vacaciones y días libres del equipo</p>
        </div>
        <Button onClick={handleAddAbsence} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Registrar Ausencia
        </Button>
      </div>

      <div className="grid gap-6">
        {absences.map((absence) => (
          <Card key={absence.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{absence.employeeName}</CardTitle>
                    <CardDescription>{absence.reason}</CardDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {getTypeBadge(absence.type)}
                  {getStatusBadge(absence.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Inicio: {new Date(absence.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Fin: {new Date(absence.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{absence.days} día(s)</span>
                </div>
              </div>
              {absence.status === 'pending' && (
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(absence.id, 'approved')}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(absence.id, 'rejected')}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Rechazar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Ausencia</DialogTitle>
            <DialogDescription>
              Completa la información de la ausencia
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
              <Label htmlFor="type">Tipo de ausencia *</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacaciones</SelectItem>
                  <SelectItem value="sick">Enfermedad</SelectItem>
                  <SelectItem value="work_leave">Baja Laboral</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha inicio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha fin *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            {formData.startDate && formData.endDate && (
              <div className="text-sm text-gray-600">
                Duración: {calculateDays(formData.startDate, formData.endDate)} día(s)
              </div>
            )}
            <div>
              <Label htmlFor="reason">Motivo</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Describe el motivo de la ausencia"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveAbsence}>
                Registrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AbsenceTracker;

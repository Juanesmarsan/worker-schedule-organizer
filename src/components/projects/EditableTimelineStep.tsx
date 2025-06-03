
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Edit, Check, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TimelineStep } from "@/types/project";

interface EditableTimelineStepProps {
  step: TimelineStep;
  onUpdate: (step: TimelineStep) => void;
}

const EditableTimelineStep = ({ step, onUpdate }: EditableTimelineStepProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStep, setEditedStep] = useState(step);

  const handleSave = () => {
    onUpdate(editedStep);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedStep(step);
    setIsEditing(false);
  };

  const getStatusBadge = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completado</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500 text-white">En Progreso</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="concept">Concepto</Label>
            <Input
              id="concept"
              value={editedStep.concept}
              onChange={(e) => setEditedStep({ ...editedStep, concept: e.target.value })}
            />
          </div>
          <div>
            <Label>Estado</Label>
            <select
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
              value={editedStep.status}
              onChange={(e) => setEditedStep({ ...editedStep, status: e.target.value as TimelineStep['status'] })}
            >
              <option value="pending">Pendiente</option>
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Fecha de Inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedStep.startDate ? format(editedStep.startDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editedStep.startDate}
                  onSelect={(date) => setEditedStep({ ...editedStep, startDate: date })}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Fecha de Final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedStep.endDate ? format(editedStep.endDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editedStep.endDate}
                  onSelect={(date) => setEditedStep({ ...editedStep, endDate: date })}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm">
            <Check className="w-4 h-4 mr-1" />
            Guardar
          </Button>
          <Button onClick={handleCancel} variant="outline" size="sm">
            <X className="w-4 h-4 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{step.title}</h4>
          <span className="font-medium text-gray-700">{step.concept}</span>
          {getStatusBadge(step.status)}
        </div>
        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Inicio: </span>
          {step.startDate ? format(step.startDate, "dd/MM/yyyy", { locale: es }) : "Sin fecha"}
        </div>
        <div>
          <span className="font-medium">Final: </span>
          {step.endDate ? format(step.endDate, "dd/MM/yyyy", { locale: es }) : "Sin fecha"}
        </div>
      </div>
    </div>
  );
};

export default EditableTimelineStep;

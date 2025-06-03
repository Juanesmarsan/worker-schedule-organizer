
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TimelineStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  status: 'completed' | 'in-progress' | 'pending';
  week?: number;
}

interface ProjectTimelineProps {
  projectName: string;
  currentWeek?: number;
}

const ProjectTimeline = ({ projectName, currentWeek = 1 }: ProjectTimelineProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const timelineSteps: TimelineStep[] = [
    {
      id: 1,
      title: "PASO 1:",
      subtitle: "Consulta Inicial Cliente",
      description: "Revisión inicial y toma de contacto con cliente",
      icon: "📋",
      color: "bg-teal-500",
      status: currentWeek >= 1 ? 'completed' : 'pending',
      week: 1
    },
    {
      id: 2,
      title: "PASO 2:",
      subtitle: "Diseño del Proyecto",
      description: "Reunión con director y equipo del proyecto\n• Diseño preliminar\n• Planificación del presupuesto\n• Fechas clave",
      icon: "👥",
      color: "bg-blue-500",
      status: currentWeek >= 2 ? (currentWeek === 2 ? 'in-progress' : 'completed') : 'pending',
      week: 2
    },
    {
      id: 3,
      title: "PASO 3:",
      subtitle: "Concepto Inicial Diseño",
      description: "Reunión de concepto de trabajo\n• Boceto y decisión\n• Posibles especificaciones técnicas\n• Establecer fechas\n• Programación y planificación",
      icon: "✏️",
      color: "bg-purple-500",
      status: currentWeek >= 3 ? (currentWeek === 3 ? 'in-progress' : 'completed') : 'pending',
      week: 3
    },
    {
      id: 4,
      title: "PASO 4:",
      subtitle: "Liberar Diseño Para Oferta",
      description: "Obtener lista de diseño de interiores. Possibly a head start en oferta de descuento",
      icon: "🏢",
      color: "bg-pink-500",
      status: currentWeek >= 4 ? (currentWeek === 4 ? 'in-progress' : 'completed') : 'pending',
      week: 4
    },
    {
      id: 5,
      title: "PASO 5:",
      subtitle: "2do Concepto Diseño",
      description: "Reunión en desarrollo con precio",
      icon: "💡",
      color: "bg-red-500",
      status: currentWeek >= 5 ? (currentWeek === 5 ? 'in-progress' : 'completed') : 'pending',
      week: 5
    },
    {
      id: 6,
      title: "PASO 6:",
      subtitle: "Presentación Ventas & Propuestas",
      description: "Presentar presupuesto final y agenda de pagos\n• Reuniones de cierre\n• Referencias retiradas para trabajo",
      icon: "📊",
      color: "bg-orange-500",
      status: currentWeek >= 6 ? (currentWeek === 6 ? 'in-progress' : 'completed') : 'pending',
      week: 6
    },
    {
      id: 7,
      title: "PASO 7:",
      subtitle: "Compra de Materiales",
      description: "Comprar materiales, ubicar y verificar disponibilidad",
      icon: "🛠️",
      color: "bg-yellow-500",
      status: currentWeek >= 7 ? (currentWeek === 7 ? 'in-progress' : 'completed') : 'pending',
      week: 7
    },
    {
      id: 8,
      title: "PASO 8:",
      subtitle: "Instalar",
      description: "Instalación y supervisión de proyecto",
      icon: "⚙️",
      color: "bg-gray-500",
      status: currentWeek >= 8 ? (currentWeek === 8 ? 'in-progress' : 'completed') : 'pending',
      week: 8
    },
    {
      id: 9,
      title: "PASO 9:",
      subtitle: "Revisar Proyecto Finalizado",
      description: "Proyecto completado: revisa, contrata y devuelve proyecto con equipo",
      icon: "👍",
      color: "bg-green-500",
      status: currentWeek >= 9 ? 'completed' : 'pending',
      week: 9
    }
  ];

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

  const getProgressWidth = () => {
    const completedSteps = timelineSteps.filter(step => step.status === 'completed').length;
    return (completedSteps / timelineSteps.length) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Timeline del Proyecto</CardTitle>
            <p className="text-sm text-gray-600">{projectName}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isExpanded ? 'Contraer' : 'Expandir'}
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progreso del proyecto</span>
            <span>{Math.round(getProgressWidth())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressWidth()}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Timeline visual */}
        <div className="relative">
          {/* Week labels */}
          <div className="flex justify-between mb-2 text-xs text-gray-500">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="text-center">
                <span>SEMANA {i + 1}</span>
              </div>
            ))}
          </div>

          {/* Timeline bars */}
          <div className="space-y-1 mb-4">
            {timelineSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className="w-16 text-xs font-medium">
                  {step.title}
                </div>
                <div className="flex-1 grid grid-cols-9 gap-1">
                  {Array.from({ length: 9 }, (_, weekIndex) => {
                    const isActiveWeek = step.week && weekIndex + 1 >= step.week && 
                                       (index === timelineSteps.length - 1 || 
                                        !timelineSteps[index + 1]?.week || 
                                        weekIndex + 1 < timelineSteps[index + 1].week);
                    
                    return (
                      <div
                        key={weekIndex}
                        className={`h-4 rounded ${
                          isActiveWeek
                            ? step.status === 'completed' 
                              ? step.color 
                              : step.status === 'in-progress'
                              ? `${step.color} opacity-70`
                              : 'bg-gray-200'
                            : 'bg-gray-100'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Step details (expanded view) */}
          {isExpanded && (
            <div className="space-y-4 border-t pt-4">
              {timelineSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{step.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{step.title}</h4>
                      <span className="font-medium text-gray-700">{step.subtitle}</span>
                      {getStatusBadge(step.status)}
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;

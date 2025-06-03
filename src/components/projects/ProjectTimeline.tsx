
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { TimelineStep } from "@/types/project";
import EditableTimelineStep from "./EditableTimelineStep";

interface ProjectTimelineProps {
  projectName: string;
  timelineSteps: TimelineStep[];
  onUpdateStep: (step: TimelineStep) => void;
  onAddStep: () => void;
}

const ProjectTimeline = ({ projectName, timelineSteps, onUpdateStep, onAddStep }: ProjectTimelineProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getProgressWidth = () => {
    const completedSteps = timelineSteps.filter(step => step.status === 'completed').length;
    return timelineSteps.length > 0 ? (completedSteps / timelineSteps.length) * 100 : 0;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Timeline del Proyecto</CardTitle>
            <p className="text-sm text-gray-600">{projectName}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onAddStep} variant="outline" size="sm">
              <Plus className="w-4 h-4" />
              Añadir Paso
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {isExpanded ? 'Contraer' : 'Expandir'}
            </Button>
          </div>
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
        {timelineSteps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay pasos definidos para este proyecto.</p>
            <Button onClick={onAddStep} className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Añadir Primer Paso
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Compact view */}
            {!isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {timelineSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className={`w-3 h-3 rounded-full ${
                      step.status === 'completed' ? 'bg-green-500' :
                      step.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <span className="text-sm font-medium">{step.title}</span>
                    <span className="text-xs text-gray-600 truncate">{step.concept}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Expanded view */}
            {isExpanded && (
              <div className="space-y-4">
                {timelineSteps.map((step) => (
                  <EditableTimelineStep
                    key={step.id}
                    step={step}
                    onUpdate={onUpdateStep}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;

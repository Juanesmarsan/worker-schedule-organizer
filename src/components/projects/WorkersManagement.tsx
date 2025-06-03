
import { useState } from "react";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project, ProjectWorker } from "@/types/project";
import WorkerForm from "./WorkerForm";
import WorkerSchedule from "./WorkerSchedule";

interface WorkersManagementProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

const WorkersManagement = ({ project, onUpdateProject }: WorkersManagementProps) => {
  const [isWorkerFormOpen, setIsWorkerFormOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<ProjectWorker | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<ProjectWorker | null>(null);

  const handleAddWorker = (workerData: Omit<ProjectWorker, 'id' | 'workDays'>) => {
    const newWorker: ProjectWorker = {
      ...workerData,
      id: Date.now(),
      workDays: []
    };

    const updatedProject = {
      ...project,
      workers: [...project.workers, newWorker]
    };
    
    onUpdateProject(updatedProject);
    setIsWorkerFormOpen(false);
  };

  const handleEditWorker = (workerData: Omit<ProjectWorker, 'id' | 'workDays'>) => {
    if (!editingWorker) return;

    const updatedProject = {
      ...project,
      workers: project.workers.map(worker =>
        worker.id === editingWorker.id
          ? { ...worker, ...workerData }
          : worker
      )
    };
    
    onUpdateProject(updatedProject);
    setEditingWorker(null);
    setIsWorkerFormOpen(false);
  };

  const handleDeleteWorker = (workerId: number) => {
    const updatedProject = {
      ...project,
      workers: project.workers.filter(worker => worker.id !== workerId)
    };
    
    onUpdateProject(updatedProject);
  };

  const handleUpdateWorkerSchedule = (workerId: number, workDays: ProjectWorker['workDays']) => {
    const updatedProject = {
      ...project,
      workers: project.workers.map(worker =>
        worker.id === workerId
          ? { ...worker, workDays }
          : worker
      )
    };
    
    onUpdateProject(updatedProject);
  };

  const openWorkerForm = (worker?: ProjectWorker) => {
    setEditingWorker(worker || null);
    setIsWorkerFormOpen(true);
  };

  const openSchedule = (worker: ProjectWorker) => {
    setSelectedWorker(worker);
    setIsScheduleOpen(true);
  };

  const getTotalHours = (worker: ProjectWorker) => {
    return worker.workDays.reduce((total, day) => total + day.hours, 0);
  };

  const getTotalCost = (worker: ProjectWorker) => {
    if (project.type === "administracion" && worker.hourlyRate) {
      return getTotalHours(worker) * worker.hourlyRate;
    }
    return 0;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Operarios Asignados</CardTitle>
          <CardDescription>
            Gestiona los operarios que trabajarán en este proyecto
          </CardDescription>
        </div>
        <Button onClick={() => openWorkerForm()}>
          <Plus className="w-4 h-4 mr-2" />
          Añadir Operario
        </Button>
      </CardHeader>
      <CardContent>
        {project.workers.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No hay operarios asignados a este proyecto
          </p>
        ) : (
          <div className="space-y-4">
            {project.workers.map((worker) => (
              <div key={worker.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium">{worker.name}</h4>
                    {project.type === "administracion" && worker.hourlyRate && (
                      <Badge variant="secondary">
                        {worker.hourlyRate}€/h
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Total horas: {getTotalHours(worker)}h
                    {project.type === "administracion" && worker.hourlyRate && (
                      <span className="ml-3">
                        Coste total: {getTotalCost(worker).toFixed(2)}€
                      </span>
                    )}
                    <span className="ml-3">
                      Días trabajados: {worker.workDays.length}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openSchedule(worker)}
                  >
                    <Calendar className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openWorkerForm(worker)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteWorker(worker.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <WorkerForm
          isOpen={isWorkerFormOpen}
          onClose={() => {
            setIsWorkerFormOpen(false);
            setEditingWorker(null);
          }}
          onSave={editingWorker ? handleEditWorker : handleAddWorker}
          editingWorker={editingWorker}
          projectType={project.type}
        />

        <WorkerSchedule
          isOpen={isScheduleOpen}
          onClose={() => {
            setIsScheduleOpen(false);
            setSelectedWorker(null);
          }}
          worker={selectedWorker}
          onUpdateSchedule={handleUpdateWorkerSchedule}
        />
      </CardContent>
    </Card>
  );
};

export default WorkersManagement;

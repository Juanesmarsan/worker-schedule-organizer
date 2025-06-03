
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkCalendar from "@/components/WorkCalendar";
import AbsenceTracker from "@/components/AbsenceTracker";
import HourTracker from "@/components/HourTracker";
import EmployeeManager from "@/components/EmployeeManager";
import ProjectsManager from "@/components/ProjectsManager";
import PayrollManager from "@/components/PayrollManager";
import VariableExpenses from "@/components/VariableExpenses";
import FixedExpenses from "@/components/FixedExpenses";
import DashboardWithData from "@/components/DashboardWithData";
import { Absence } from "@/types/calendar";
import { Project } from "@/types/project";

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Reforma Oficina Central",
      type: "presupuesto",
      budget: 15000,
      description: "Renovación completa de la oficina central",
      city: "Madrid",
      status: "activo",
      createdAt: new Date(),
      variableExpenses: [
        { id: 1, concept: "Material eléctrico", amount: 450, date: new Date(), paymentMethod: "transferencia" },
        { id: 2, concept: "Pintura", amount: 220, date: new Date(), paymentMethod: "efectivo" }
      ],
      workers: []
    },
    {
      id: 2,
      name: "Mantenimiento Sistemas",
      type: "administracion",
      hourlyRate: 50,
      description: "Mantenimiento mensual de sistemas informáticos",
      city: "Barcelona",
      status: "activo",
      createdAt: new Date(),
      variableExpenses: [
        { id: 3, concept: "Licencias software", amount: 150, date: new Date(), paymentMethod: "tarjeta", creditCardNumber: "**** **** **** 1234" }
      ],
      workers: []
    }
  ]);

  const [absences, setAbsences] = useState<Absence[]>([
    {
      id: 1,
      employeeName: "Juan Pérez",
      type: 'vacation',
      startDate: "2024-06-10",
      endDate: "2024-06-14",
      days: 5,
      reason: "Vacaciones familiares",
      status: 'approved'
    },
    {
      id: 2,
      employeeName: "María García",
      type: 'sick',
      startDate: "2024-06-03",
      endDate: "2024-06-03",
      days: 1,
      reason: "Malestar general",
      status: 'approved'
    }
  ]);

  const handleAbsenceAdded = (newAbsence: Absence) => {
    setAbsences(prev => [...prev, newAbsence]);
  };

  const handleAbsenceStatusChange = (id: number, status: 'approved' | 'rejected') => {
    setAbsences(prev => prev.map(absence => 
      absence.id === id ? { ...absence, status } : absence
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Gestión Empresarial
          </h1>
          <p className="text-gray-600">
            Gestiona empleados, proyectos, horas y finanzas de tu empresa
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="absences">Ausencias</TabsTrigger>
            <TabsTrigger value="hours">Horas</TabsTrigger>
            <TabsTrigger value="employees">Empleados</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="payroll">Nóminas</TabsTrigger>
            <TabsTrigger value="variable-expenses">Gastos Variables</TabsTrigger>
            <TabsTrigger value="fixed-expenses">Gastos Fijos</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <DashboardWithData projects={projects} absences={absences} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <WorkCalendar 
              absences={absences}
              onAbsenceAdded={handleAbsenceAdded}
              onAbsenceStatusChange={handleAbsenceStatusChange}
            />
          </TabsContent>

          <TabsContent value="absences" className="mt-6">
            <AbsenceTracker 
              absences={absences}
              onAbsenceAdded={handleAbsenceAdded}
              onAbsenceStatusChange={handleAbsenceStatusChange}
            />
          </TabsContent>

          <TabsContent value="hours" className="mt-6">
            <HourTracker />
          </TabsContent>

          <TabsContent value="employees" className="mt-6">
            <EmployeeManager />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="payroll" className="mt-6">
            <PayrollManager />
          </TabsContent>

          <TabsContent value="variable-expenses" className="mt-6">
            <VariableExpenses />
          </TabsContent>

          <TabsContent value="fixed-expenses" className="mt-6">
            <FixedExpenses />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

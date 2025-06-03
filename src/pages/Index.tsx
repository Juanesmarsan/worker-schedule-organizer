
import { useState } from "react";
import { Users, Clock, Calendar, TrendingUp, User, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import EmployeeManager from "@/components/EmployeeManager";
import AbsenceTracker from "@/components/AbsenceTracker";
import HourTracker from "@/components/HourTracker";
import WorkCalendar from "@/components/WorkCalendar";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Datos de ejemplo
  const stats = {
    totalEmployees: 12,
    presentToday: 10,
    onVacation: 2,
    totalHoursThisMonth: 1840,
    requiredHours: 1920,
  };

  const recentActivity = [
    { id: 1, employee: "Juan Pérez", action: "Solicitó vacaciones", date: "Hoy", type: "vacation" },
    { id: 2, employee: "María García", action: "Reportó ausencia", date: "Ayer", type: "absence" },
    { id: 3, employee: "Carlos López", action: "Completó horas extra", date: "Ayer", type: "overtime" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Gestión de Trabajadores
          </h1>
          <p className="text-gray-600">
            Organiza y controla el tiempo de trabajo de tu equipo de manera eficiente
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Empleados
            </TabsTrigger>
            <TabsTrigger value="absences" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Ausencias
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horas
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Calendario
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
                  <Users className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                  <p className="text-xs opacity-80">Empleados activos</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Presentes Hoy</CardTitle>
                  <User className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.presentToday}</div>
                  <p className="text-xs opacity-80">
                    {((stats.presentToday / stats.totalEmployees) * 100).toFixed(0)}% asistencia
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">De Vacaciones</CardTitle>
                  <Calendar className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.onVacation}</div>
                  <p className="text-xs opacity-80">Empleados ausentes</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Horas del Mes</CardTitle>
                  <Clock className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalHoursThisMonth}/{stats.requiredHours}
                  </div>
                  <p className="text-xs opacity-80">
                    {((stats.totalHoursThisMonth / stats.requiredHours) * 100).toFixed(0)}% completado
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Actividad reciente */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimos movimientos en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.employee}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={activity.type === 'vacation' ? 'default' : activity.type === 'absence' ? 'destructive' : 'secondary'}>
                          {activity.type === 'vacation' ? 'Vacaciones' : activity.type === 'absence' ? 'Ausencia' : 'Horas Extra'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeManager />
          </TabsContent>

          <TabsContent value="absences">
            <AbsenceTracker />
          </TabsContent>

          <TabsContent value="hours">
            <HourTracker />
          </TabsContent>

          <TabsContent value="calendar">
            <WorkCalendar />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

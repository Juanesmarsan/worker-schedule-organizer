
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { MonthlyStats as MonthlyStatsType } from "@/types/calendar";

interface MonthlyStatsComponentProps {
  stats: MonthlyStatsType;
  currentMonth: Date;
}

export const MonthlyStats = ({ stats, currentMonth }: MonthlyStatsComponentProps) => {
  const completionPercentage = (stats.totalHours / stats.expectedHours) * 100;
  
  const getStatusBadge = () => {
    if (completionPercentage >= 100) {
      return <Badge className="bg-green-100 text-green-800">Completo</Badge>;
    } else if (completionPercentage >= 80) {
      return <Badge className="bg-yellow-100 text-yellow-800">En progreso</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Pendiente</Badge>;
    }
  };

  const getStatusIcon = () => {
    if (completionPercentage >= 100) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (completionPercentage >= 80) {
      return <Clock className="w-4 h-4 text-yellow-600" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </CardTitle>
            <CardDescription>Estadísticas mensuales</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Días laborables</p>
            <p className="text-2xl font-bold">{stats.workDays}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Horas esperadas</p>
            <p className="text-2xl font-bold">{stats.expectedHours}h</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total trabajado</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalHours}h</p>
          </div>
          <div>
            <p className="text-muted-foreground">Horas extra</p>
            <p className="text-2xl font-bold text-orange-600">{stats.overtime}h</p>
          </div>
        </div>

        {stats.grossProfit !== undefined && stats.grossProfit > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <p className="text-sm font-medium text-green-700">Beneficio de Administración</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.grossProfit.toFixed(2)}€</p>
            <p className="text-xs text-muted-foreground mt-1">
              Solo incluye horas trabajadas en proyectos de administración
            </p>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span>Progreso del mes</span>
            <span className="font-medium">{completionPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

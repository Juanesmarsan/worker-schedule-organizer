
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator } from "lucide-react";
import { MonthlyStats as MonthlyStatsType } from "@/types/calendar";

interface MonthlyStatsProps {
  stats: MonthlyStatsType;
  currentMonth: Date;
}

export const MonthlyStats = ({ stats, currentMonth }: MonthlyStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Resumen Mensual
        </CardTitle>
        <CardDescription>
          {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Días laborables</span>
          <Badge variant="outline">{stats.workDays}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Horas esperadas</span>
          <Badge className="bg-blue-100 text-blue-800">
            {stats.expectedHours}h
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Horas trabajadas</span>
          <Badge className="bg-cyan-100 text-cyan-800">
            {stats.totalHours}h
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Horas extras</span>
          <Badge className={stats.overtime > 0 ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800"}>
            {stats.overtime}h
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HolidaysListProps {
  holidays: Date[];
}

export const HolidaysList = ({ holidays }: HolidaysListProps) => {
  const upcomingHolidays = holidays
    .filter(holiday => holiday > new Date())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Festivos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {upcomingHolidays.map((holiday, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{holiday.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
            <Badge variant="outline" className="text-xs">Festivo</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

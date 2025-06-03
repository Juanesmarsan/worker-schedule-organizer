
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSpainNationalHolidays, getValenciaHolidays } from "@/utils/holidayUtils";

interface HolidaysListProps {
  holidays: Date[];
}

export const HolidaysList = ({ holidays }: HolidaysListProps) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const nationalHolidays = getSpainNationalHolidays(currentYear);
  const valenciaHolidays = getValenciaHolidays(currentYear);
  
  const upcomingHolidays = holidays
    .filter(holiday => holiday >= today)
    .slice(0, 5)
    .map(holiday => {
      const isNational = nationalHolidays.some(nh => 
        nh.toDateString() === holiday.toDateString()
      );
      const isValencia = valenciaHolidays.some(vh => 
        vh.toDateString() === holiday.toDateString()
      );
      
      return {
        date: holiday,
        isNational,
        isValencia
      };
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Festivos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingHolidays.map((holiday, index) => (
          <div key={index} className="flex flex-col space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {holiday.date.toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </span>
              <div className="flex gap-1">
                {holiday.isNational && (
                  <Badge variant="destructive" className="text-xs">
                    Nacional
                  </Badge>
                )}
                {holiday.isValencia && (
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                    Valencia
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
        {upcomingHolidays.length === 0 && (
          <p className="text-sm text-gray-500">No hay festivos próximos</p>
        )}
      </CardContent>
    </Card>
  );
};

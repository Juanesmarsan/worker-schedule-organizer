
// Festivos de Valencia 2024
export const valenciaHolidays2024 = [
  new Date(2024, 0, 1),  // Año Nuevo
  new Date(2024, 0, 6),  // Reyes
  new Date(2024, 2, 19), // San José
  new Date(2024, 2, 29), // Viernes Santo
  new Date(2024, 3, 1),  // Lunes de Pascua
  new Date(2024, 3, 22), // San Vicente Mártir
  new Date(2024, 4, 1),  // Día del Trabajo
  new Date(2024, 5, 24), // San Juan
  new Date(2024, 7, 15), // Asunción
  new Date(2024, 9, 9),  // Día de la Comunidad Valenciana
  new Date(2024, 9, 12), // Día de la Hispanidad
  new Date(2024, 10, 1), // Todos los Santos
  new Date(2024, 11, 6), // Día de la Constitución
  new Date(2024, 11, 8), // Inmaculada
  new Date(2024, 11, 25), // Navidad
];

// Verificar si una fecha es festivo o domingo
export const isHolidayOrSunday = (date: Date) => {
  const isHoliday = valenciaHolidays2024.some(holiday => 
    holiday.toDateString() === date.toDateString()
  );
  const isSunday = date.getDay() === 0;
  return isHoliday || isSunday;
};

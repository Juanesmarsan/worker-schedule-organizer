
// Festivos nacionales de España y específicos de Valencia ciudad 2024
export const spainNationalHolidays2024 = [
  new Date(2024, 0, 1),   // Año Nuevo
  new Date(2024, 0, 6),   // Reyes Magos
  new Date(2024, 2, 28),  // Jueves Santo (nacional)
  new Date(2024, 2, 29),  // Viernes Santo (nacional)
  new Date(2024, 4, 1),   // Día del Trabajo
  new Date(2024, 7, 15),  // Asunción de la Virgen
  new Date(2024, 9, 12),  // Día de la Hispanidad
  new Date(2024, 10, 1),  // Todos los Santos
  new Date(2024, 11, 6),  // Día de la Constitución
  new Date(2024, 11, 8),  // Inmaculada Concepción
  new Date(2024, 11, 25), // Navidad
];

export const valenciaHolidays2024 = [
  new Date(2024, 2, 19),  // San José (Valencia)
  new Date(2024, 3, 1),   // Lunes de Pascua (Valencia)
  new Date(2024, 3, 22),  // San Vicente Mártir (Valencia)
  new Date(2024, 5, 24),  // San Juan (Valencia)
  new Date(2024, 9, 9),   // Día de la Comunidad Valenciana
];

// Combinamos todos los festivos
export const allHolidays2024 = [...spainNationalHolidays2024, ...valenciaHolidays2024];

// Verificar si una fecha es festivo o domingo
export const isHolidayOrSunday = (date: Date) => {
  const isHoliday = allHolidays2024.some(holiday => 
    holiday.toDateString() === date.toDateString()
  );
  const isSunday = date.getDay() === 0;
  return isHoliday || isSunday;
};

// Verificar si es específicamente un festivo (no domingo)
export const isHoliday = (date: Date) => {
  return allHolidays2024.some(holiday => 
    holiday.toDateString() === date.toDateString()
  );
};

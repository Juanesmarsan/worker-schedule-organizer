// Festivos nacionales de España y específicos de Valencia ciudad 2025
export const spainNationalHolidays2024 = [
  new Date(2025, 0, 1),   // 1 de enero (miércoles): Año Nuevo
  new Date(2025, 0, 6),   // 6 de enero (lunes): Epifanía del Señor
  new Date(2025, 3, 18),  // 18 de abril (viernes): Viernes Santo
  new Date(2025, 4, 1),   // 1 de mayo (jueves): Fiesta del Trabajo
  new Date(2025, 7, 15),  // 15 de agosto (viernes): Asunción de la Virgen
  new Date(2025, 10, 1),  // 1 de noviembre (sábado): Todos los Santos
  new Date(2025, 11, 6),  // 6 de diciembre (sábado): Día de la Constitución Española
  new Date(2025, 11, 8),  // 8 de diciembre (lunes): Inmaculada Concepción
  new Date(2025, 11, 25), // 25 de diciembre (jueves): Navidad
];

export const valenciaHolidays2024 = [
  new Date(2025, 2, 19),  // 19 de marzo (miércoles): San José
  new Date(2025, 3, 21),  // 21 de abril (lunes): Lunes de Pascua (en Valencia)
  new Date(2025, 9, 9),   // 9 de octubre (jueves): Día de la Comunidad Valenciana
  new Date(2025, 0, 22),  // 22 de enero (miércoles): San Vicente Mártir
  new Date(2025, 3, 16),  // 16 de abril (miércoles): San Vicente Ferrer
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

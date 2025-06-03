
// Función para generar festivos nacionales de España para cualquier año
export const getSpainNationalHolidays = (year: number) => [
  new Date(year, 0, 1),   // 1 de enero: Año Nuevo
  new Date(year, 0, 6),   // 6 de enero: Epifanía del Señor
  new Date(year, 3, 18),  // 18 de abril: Viernes Santo (fecha fija para simplificar)
  new Date(year, 4, 1),   // 1 de mayo: Fiesta del Trabajo
  new Date(year, 7, 15),  // 15 de agosto: Asunción de la Virgen
  new Date(year, 10, 1),  // 1 de noviembre: Todos los Santos
  new Date(year, 11, 6),  // 6 de diciembre: Día de la Constitución Española
  new Date(year, 11, 8),  // 8 de diciembre: Inmaculada Concepción
  new Date(year, 11, 25), // 25 de diciembre: Navidad
];

// Función para generar festivos de Valencia para cualquier año
export const getValenciaHolidays = (year: number) => [
  new Date(year, 2, 19),  // 19 de marzo: San José
  new Date(year, 3, 21),  // 21 de abril: Lunes de Pascua (fecha fija para simplificar)
  new Date(year, 9, 9),   // 9 de octubre: Día de la Comunidad Valenciana
  new Date(year, 0, 22),  // 22 de enero: San Vicente Mártir
  new Date(year, 3, 16),  // 16 de abril: San Vicente Ferrer
];

// Función para obtener todos los festivos de un año específico
export const getAllHolidays = (year: number) => [
  ...getSpainNationalHolidays(year),
  ...getValenciaHolidays(year)
];

// Mantener compatibilidad con el código existente
export const spainNationalHolidays2024 = getSpainNationalHolidays(2025);
export const valenciaHolidays2024 = getValenciaHolidays(2025);
export const allHolidays2024 = getAllHolidays(2025);

// Verificar si una fecha es festivo o domingo
export const isHolidayOrSunday = (date: Date) => {
  const year = date.getFullYear();
  const holidays = getAllHolidays(year);
  const isHoliday = holidays.some(holiday => 
    holiday.toDateString() === date.toDateString()
  );
  const isSunday = date.getDay() === 0;
  return isHoliday || isSunday;
};

// Verificar si es específicamente un festivo (no domingo)
export const isHoliday = (date: Date) => {
  const year = date.getFullYear();
  const holidays = getAllHolidays(year);
  return holidays.some(holiday => 
    holiday.toDateString() === date.toDateString()
  );
};

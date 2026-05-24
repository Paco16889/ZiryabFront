/**
 * Convierte el valor de día que viene del API o de Prisma al número que usa el front.
 *
 * - Si ya es un número entre 1 y 7, se devuelve igual (no se modifica).
 * - Si es un string tipo `MONDAY`, se mapea a 1, etc.
 * - Si el string no es reconocido, se devuelve **1** (lunes) por defecto.
 *
 * @param day Día como string Prisma (`MONDAY`…) o número 1–7.
 * @returns Entero 1–7 (lunes = 1, domingo = 7).
 *
 * @example
 * // Respuesta JSON del backend
 * prismaDayOfWeekToNumber('WEDNESDAY'); // → 3
 *
 * @example
 * // Tras normalizar o datos ya numéricos
 * prismaDayOfWeekToNumber(5); // → 5 (viernes)
 *
 * @example
 * // UI → no cambia
 * prismaDayOfWeekToNumber(1); // → 1
 */
export function prismaDayOfWeekToNumber(day: string | number): number {
  if (typeof day === 'number' && day >= 1 && day <= 7) {
    return day;
  }
  const map: Record<string, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
  };
  return map[String(day)] ?? 1;
}

/**
 * Convierte el día de la UI (1–7) al literal que espera el backend al crear o actualizar horarios.
 *
 * - 1 → `MONDAY`, …, 7 → `SUNDAY`.
 * - Valores fuera de 1–7 devuelven **`MONDAY`** por defecto.
 *
 * @param day Día en formato numérico 1 = lunes … 7 = domingo.
 * @returns String en mayúsculas compatible con Prisma / API.
 *
 * @example
 * // Usuario elige martes en un select numérico
 * numberToPrismaDayOfWeek(2); // → 'TUESDAY'
 *
 * @example
 * // Petición POST/PATCH al API
 * numberToPrismaDayOfWeek(5); // → 'FRIDAY'
 */
export function numberToPrismaDayOfWeek(day: number): string {
  const map: Record<number, string> = {
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY',
    7: 'SUNDAY',
  };
  return map[day] ?? 'MONDAY';
}

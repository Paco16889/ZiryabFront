/**
 * Convierte el día que devuelve Prisma/JSON (`MONDAY` …) al 1–7 que usa el front (1 = lunes).
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

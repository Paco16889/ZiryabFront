// models/week-schedule-flow/week-schedule.enums.ts

/**
 * Literales de día de la semana que serializa Prisma / el backend en JSON
 * (p. ej. campo `weekDay` en `WeekSchedule` antes de normalizar a 1–7 en el cliente).
 * Alineado con `numberToPrismaDayOfWeek` / `prismaDayOfWeekToNumber` en `core/utils/week-day`.
 */
export const PRISMA_WEEK_DAY = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;

/** Unión TypeScript derivada de los literales Prisma válidos para `weekDay`. */
export type PrismaWeekDay = (typeof PRISMA_WEEK_DAY)[number];

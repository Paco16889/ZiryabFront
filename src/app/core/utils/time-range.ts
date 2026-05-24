/**
 * Pasa una hora `"HH:mm"` a minutos desde medianoche (entero).
 *
 * @param t Cadena con hora y minutos, p. ej. `"09:30"`.
 * @returns Minutos desde las 00:00. Si el formato no es válido (NaN), devuelve **0**.
 *
 * @example
 * timeToMinutes('09:00'); // → 540
 *
 * @example
 * timeToMinutes('14:15'); // → 855
 *
 * @example
 * timeToMinutes('foo'); // → 0 (fallback)
 */
export function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map((x) => Number(x));
  if (Number.isNaN(h) || Number.isNaN(m)) {
    return 0;
  }
  return h * 60 + m;
}

/**
 * Indica si dos intervalos de tiempo **del mismo día** se solapan (hay al menos un minuto en común).
 *
 * Cada intervalo es `[inicio, fin]` en minutos derivados de `HH:mm`. Dos clases consecutivas
 * `09:00–10:00` y `10:00–11:00` **no** solapan (el fin de una es el inicio de la otra).
 *
 * @param aStart Inicio del primer intervalo `HH:mm`.
 * @param aEnd Fin del primer intervalo `HH:mm`.
 * @param bStart Inicio del segundo intervalo `HH:mm`.
 * @param bEnd Fin del segundo intervalo `HH:mm`.
 * @returns `true` si hay solape; si no, `false`.
 *
 * @example
 * // Misma franja: solapan
 * timeRangesOverlap('09:00', '10:00', '09:30', '10:30'); // → true
 *
 * @example
 * // Una termina cuando empieza la otra: no solapan
 * timeRangesOverlap('09:00', '10:00', '10:00', '11:00'); // → false
 *
 * @example
 * // Franjas disjuntas
 * timeRangesOverlap('08:00', '09:00', '10:00', '11:00'); // → false
 */
export function timeRangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  const as = timeToMinutes(aStart);
  const ae = timeToMinutes(aEnd);
  const bs = timeToMinutes(bStart);
  const be = timeToMinutes(bEnd);
  return as < be && bs < ae;
}

/**
 * Duración en **horas** (decimal) entre dos instantes `HH:mm` el mismo día.
 *
 * Si `end` es anterior o igual a `start`, el resultado es **0** (no hay duración negativa).
 *
 * @param start Hora de inicio `HH:mm`.
 * @param end Hora de fin `HH:mm`.
 * @returns Horas transcurridas (p. ej. 1.5 = una hora y media).
 *
 * @example
 * hoursBetween('09:00', '10:00'); // → 1
 *
 * @example
 * hoursBetween('09:00', '09:45'); // → 0.75
 *
 * @example
 * hoursBetween('10:00', '09:00'); // → 0
 */
export function hoursBetween(start: string, end: string): number {
  return Math.max(0, (timeToMinutes(end) - timeToMinutes(start)) / 60);
}

/**
 * Formato estricto `HH:mm`: dos dígitos en hora y dos en minutos (24 h).
 * Válido: `07:00`, `08:15`, `14:45`. Inválido: `8:15`, `25:00`, `08:60`.
 */
export const HH_MM_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Comprueba `HH:mm` con hora y minutos siempre a dos cifras.
 *
 * @param value Texto introducido por el usuario.
 * @returns `true` si cumple el patrón horario estricto.
 */
export function isValidHhMmTime(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && HH_MM_TIME_PATTERN.test(trimmed);
}

/**
 * Si el valor cumple `HH:mm` estricto, lo devuelve recortado; si no, `null`.
 * No rellena un solo dígito (`8:15` → inválido; debe escribirse `08:15`).
 *
 * @param value Texto de hora que puede contener espacios alrededor.
 * @returns Hora normalizada o `null` si no es válida.
 */
export function normalizeHhMmTime(value: string): string | null {
  const trimmed = value.trim();
  return isValidHhMmTime(trimmed) ? trimmed : null;
}

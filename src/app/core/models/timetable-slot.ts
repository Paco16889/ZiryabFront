/** Franja horaria del centro para una fila de la rejilla semanal (modo admin). */
export interface TimetableSlot {
  /** Hora de inicio oficial de la franja en formato `HH:mm`. */
  startTime: string;

  /** Hora de finalización oficial de la franja en formato `HH:mm`. */
  finishTime: string;
}

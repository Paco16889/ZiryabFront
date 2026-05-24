import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { WeekSchedule } from '../../../core/models/week-schedule';
import { WeekScheduleService } from '../../../core/services/admin/entities/services-for-week-schedule/week-schedule.service';
import { prismaDayOfWeekToNumber } from '../../../core/utils/week-day';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/**
 * Componente que muestra el horario semanal del alumno autenticado.
 * Carga las franjas desde backend y las agrupa por día para mostrarlas en formato tarjeta.
 */
@Component({
  selector: 'app-horario-alumno',
  standalone: true,
  imports: [CommonModule, TranslateModule, BotonAtrasComponent],
  templateUrl: './horario-alumno.component.html',
  styleUrl: './horario-alumno.component.scss'
})
export class HorarioAlumnoComponent implements OnInit {
  /** Servicio de sesión para obtener el alumno autenticado. */
  private authService = inject(AuthService);
  /** Servicio de horarios semanales filtrados por alumno. */
  private weekScheduleService = inject(WeekScheduleService);

  /** Días lectivos que se muestran como columnas/tarjetas. */
  readonly weekDays = [1, 2, 3, 4, 5];
  /** Horarios agrupados por día numérico. */
  schedulesByDay: Record<number, WeekSchedule[]> = {};
  /** Estado de carga inicial del horario. */
  isLoading = true;

  /** Carga el horario del alumno autenticado y lo agrupa por día. */
  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      this.isLoading = false;
      return;
    }

    this.weekScheduleService.getSchedulesByStudent(userId).subscribe((response) => {
      this.isLoading = false;
      const schedules = response.success ? response.data : [];
      this.schedulesByDay = this.groupByDay(this.normalizeSchedules(schedules));
    });
  }

  /** Devuelve las franjas de un día, o lista vacía si no hay clase. */
  getDaySchedules(day: number): WeekSchedule[] {
    return this.schedulesByDay[day] ?? [];
  }

  /** Extrae el nombre de asignatura desde la relación teacherAssignment. */
  getSubjectName(schedule: WeekSchedule): string {
    const assignment = schedule.teacherAssignment as unknown as { subject?: { name?: string } };
    return assignment.subject?.name ?? '-';
  }

  /** Extrae el nombre de grupo desde la relación teacherAssignment. */
  getGroupName(schedule: WeekSchedule): string {
    const assignment = schedule.teacherAssignment as unknown as { group?: { name?: string } };
    return assignment.group?.name ?? '-';
  }

  /** El API envía `weekDay` como enum Prisma (`MONDAY`…); la vista agrupa por 1–5. */
  private normalizeSchedules(schedules: WeekSchedule[]): WeekSchedule[] {
    return schedules.map((s) => ({
      ...s,
      weekDay: prismaDayOfWeekToNumber(s.weekDay as unknown as string | number),
    }));
  }

  /** Ordena las franjas por hora y las agrupa por día de la semana. */
  private groupByDay(schedules: WeekSchedule[]): Record<number, WeekSchedule[]> {
    const dayMap: Record<string, number> = {
      'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3, 'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6, 'SUNDAY': 7
    };

    return schedules
      .sort((left, right) => left.startTime.localeCompare(right.startTime))
      .reduce<Record<number, WeekSchedule[]>>((accumulator, schedule) => {
        let dayValue = schedule.weekDay;
        
        // mapeamos a numero nos strinf q vengan del back
        if (typeof dayValue === 'string') {
          dayValue = dayMap[dayValue] || 1;
        }

        const day = dayValue as number;
        if (!accumulator[day]) {
          accumulator[day] = [];
        }
        accumulator[day].push(schedule);
        return accumulator;
      }, {});
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { WeekSchedule } from '../../../core/models/week-schedule';
import { AuthService } from '../../../core/services/auth.service';
import { WeekScheduleService } from '../../../core/services/admin/entities/week-schedule.service';
import { prismaDayOfWeekToNumber } from '../../../core/utils/week-day';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/**
 * Componente que muestra el horario semanal del profesor autenticado.
 * Recupera las clases del docente y las organiza por día de la semana.
 */
@Component({
  selector: 'app-horario-profesor',
  standalone: true,
  imports: [CommonModule, TranslateModule, BotonAtrasComponent],
  templateUrl: './horario-profesor.component.html',
  styleUrl: './horario-profesor.component.scss'
})
export class HorarioProfesorComponent implements OnInit {
  private authService = inject(AuthService);
  private weekScheduleService = inject(WeekScheduleService);

  readonly weekDays = [1, 2, 3, 4, 5];
  schedulesByDay: Record<number, WeekSchedule[]> = {};
  isLoading = true;

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      this.isLoading = false;
      return;
    }

    this.weekScheduleService.getSchedulesByTeacher(userId).subscribe((response) => {
      this.isLoading = false;
      const schedules = response.success ? response.data : [];
      this.schedulesByDay = this.groupByDay(this.normalizeSchedules(schedules));
    });
  }

  getDaySchedules(day: number): WeekSchedule[] {
    return this.schedulesByDay[day] ?? [];
  }

  getSubjectName(schedule: WeekSchedule): string {
    const assignment = schedule.teacherAssignment as unknown as { subject?: { name?: string } };
    return assignment.subject?.name ?? '-';
  }

  getGroupName(schedule: WeekSchedule): string {
    const assignment = schedule.teacherAssignment as unknown as { group?: { name?: string } };
    return assignment.group?.name ?? '-';
  }

  private normalizeSchedules(schedules: WeekSchedule[]): WeekSchedule[] {
    return schedules.map((s) => ({
      ...s,
      weekDay: prismaDayOfWeekToNumber(s.weekDay as unknown as string | number),
    }));
  }

  private groupByDay(schedules: WeekSchedule[]): Record<number, WeekSchedule[]> {
    return schedules
      .sort((left, right) => left.startTime.localeCompare(right.startTime))
      .reduce<Record<number, WeekSchedule[]>>((accumulator, schedule) => {
        const day = schedule.weekDay;
        if (!accumulator[day]) {
          accumulator[day] = [];
        }
        accumulator[day].push(schedule);
        return accumulator;
      }, {});
  }
}

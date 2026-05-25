import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { weekScheduleClassKeyFromParts } from '../../utils/week-schedule-class-key';
import { ToggleService } from '../toggle.service';

/** Contexto para abrir «Crear plantilla» tras guardar asignaciones docentes (EQ-309). */
export interface WeekScheduleCreateNavigationContext {
  idCourse: number;
  grade: string;
  idGroup: number;
}

/**
 * Navegación admin: abrir el builder de horarios con clase preseleccionada.
 */
@Injectable({ providedIn: 'root' })
export class WeekScheduleNavigationService {
  private readonly toggle = inject(ToggleService);

  readonly pendingCreate = signal<WeekScheduleCreateNavigationContext | null>(null);

  goToCreateTemplate(ctx: WeekScheduleCreateNavigationContext): void {
    this.pendingCreate.set(ctx);
    this.toggle.openMenu('schedules');
  }

  takePendingCreate(): WeekScheduleCreateNavigationContext | null {
    const ctx = this.pendingCreate();
    this.pendingCreate.set(null);
    return ctx;
  }

  pendingCreateClassKey(schoolYear: string = environment.currentSchoolYear): string | null {
    const ctx = this.pendingCreate();
    if (ctx == null) {
      return null;
    }
    return weekScheduleClassKeyFromParts(
      ctx.idCourse,
      ctx.grade,
      ctx.idGroup,
      schoolYear,
    );
  }
}

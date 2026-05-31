import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { weekScheduleClassKeyFromParts } from '../../utils/week-schedule-class-key';
import { ToggleService } from '../toggle.service';

/** Contexto para abrir «Crear plantilla» tras guardar asignaciones docentes (EQ-309). */
export interface WeekScheduleCreateNavigationContext {
  /** Ciclo formativo de la clase a materializar. */
  idCourse: number;

  /** Curso dentro del ciclo (`"1"` o `"2"`). */
  grade: string;

  /** Grupo académico de la plantilla. */
  idGroup: number;
}

/**
 * Navegación admin: abrir el builder de horarios con clase preseleccionada.
 */
@Injectable({ providedIn: 'root' })
export class WeekScheduleNavigationService {
  /** Abre el panel lateral del menú admin en la sección de horarios. */
  private readonly toggle = inject(ToggleService);

  /** Contexto pendiente para preseleccionar clase en el builder de horarios. */
  readonly pendingCreate = signal<WeekScheduleCreateNavigationContext | null>(null);

  /**
   * Abre el menú de horarios y guarda el contexto para el builder de plantilla.
   * @param ctx Ciclo, curso y grupo de la clase a crear.
   */
  goToCreateTemplate(ctx: WeekScheduleCreateNavigationContext): void {
    this.pendingCreate.set(ctx);
    this.toggle.openMenu('schedules');
  }

  /**
   * Lee y limpia el contexto pendiente (una sola vez por navegación).
   * @returns Contexto guardado o `null` si no había pendiente.
   */
  takePendingCreate(): WeekScheduleCreateNavigationContext | null {
    const ctx = this.pendingCreate();
    this.pendingCreate.set(null);
    return ctx;
  }

  /**
   * Clave de clase (`idCourse-grade-idGroup-schoolYear`) derivada del contexto pendiente.
   * @param schoolYear Año escolar; por defecto el del entorno.
   */
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

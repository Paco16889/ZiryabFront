import { inject, Injectable, signal } from '@angular/core';
import { ToggleService } from '../toggle.service';

/**
 * Navegación admin: abrir alta de asignaturas con ciclo preseleccionado (CURSO-140 / CURSO-141).
 */
@Injectable({ providedIn: 'root' })
export class SubjectCreateNavigationService {
  /** Abre el panel lateral del menú admin en la sección de asignaturas. */
  private readonly toggle = inject(ToggleService);

  /** Ciclo pendiente de preseleccionar en el formulario de alta de asignatura. */
  readonly pendingIdCourse = signal<number | null>(null);

  /**
   * Abre el menú de asignaturas y deja el ciclo listo para el formulario de creación.
   * @param idCourse Identificador del ciclo a preseleccionar.
   */
  goToCreateSubjectForCourse(idCourse: number): void {
    this.pendingIdCourse.set(idCourse);
    this.toggle.openMenu('subjects');
  }

  /** Lee y limpia el idCourse pendiente (una sola vez por navegación). */
  takePendingIdCourse(): number | null {
    const id = this.pendingIdCourse();
    this.pendingIdCourse.set(null);
    return id;
  }
}

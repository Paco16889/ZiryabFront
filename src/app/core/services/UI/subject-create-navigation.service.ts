import { inject, Injectable, signal } from '@angular/core';
import { ToggleService } from '../toggle.service';

/**
 * Navegación admin: abrir alta de asignaturas con ciclo preseleccionado (CURSO-140 / CURSO-141).
 */
@Injectable({ providedIn: 'root' })
export class SubjectCreateNavigationService {
  private readonly toggle = inject(ToggleService);

  readonly pendingIdCourse = signal<number | null>(null);

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

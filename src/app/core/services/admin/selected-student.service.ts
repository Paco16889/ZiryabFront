import { Injectable, signal } from '@angular/core';
import { PendingStudentDraft, Student } from '../../models/student';

/**
 * Estado del wizard de matriculación (EQ-311-A): borrador en memoria o alumno existente.
 * Huérfanos tras crash/cierre se limpian en backend con job periódico (EQ-311-C).
 */
@Injectable({
  providedIn: 'root',
})
export class SelectedStudentService {
  /** Alumno ya dado de alta seleccionado para matricular. */
  readonly selectedStudent = signal<Student | null>(null);

  /** Borrador del paso 2 aún no persistido en base de datos. */
  readonly pendingStudentDraft = signal<PendingStudentDraft | null>(null);

  /** `true` mientras `confirmEnrollment` está en vuelo (EQ-313). */
  readonly enrollmentInProgress = signal(false);

  /** Fija un alumno existente y descarta cualquier borrador pendiente. */
  setSelectedStudent(student: Student): void {
    this.pendingStudentDraft.set(null);
    this.selectedStudent.set(student);
  }

  /** Guarda el borrador del formulario y limpia la selección de alumno existente. */
  setPendingStudentDraft(draft: PendingStudentDraft): void {
    this.selectedStudent.set(null);
    this.pendingStudentDraft.set(draft);
  }

  /** Reinicia alumno seleccionado y borrador. */
  clearSelectedStudent(): void {
    this.selectedStudent.set(null);
    this.pendingStudentDraft.set(null);
  }

  /** Limpia el estado tras confirmar matrícula con éxito. */
  completeEnrollmentSession(): void {
    this.clearSelectedStudent();
  }

  /** Indica si hay alumno o borrador listo para el paso de matrícula. */
  hasEnrollmentTarget(): boolean {
    return this.selectedStudent() != null || this.pendingStudentDraft() != null;
  }

  /** Nombre legible del objetivo de matrícula (alumno o borrador). */
  enrollmentTargetLabel(): string {
    const student = this.selectedStudent();
    if (student) {
      return [student.name, student.surname].filter(Boolean).join(' ');
    }
    const draft = this.pendingStudentDraft();
    if (draft) {
      return [draft.name, draft.surname].filter(Boolean).join(' ');
    }
    return '';
  }
}

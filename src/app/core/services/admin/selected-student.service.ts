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
  readonly selectedStudent = signal<Student | null>(null);
  readonly pendingStudentDraft = signal<PendingStudentDraft | null>(null);
  /** true mientras confirmEnrollment está en vuelo (EQ-313). */
  readonly enrollmentInProgress = signal(false);

  setSelectedStudent(student: Student): void {
    this.pendingStudentDraft.set(null);
    this.selectedStudent.set(student);
  }

  setPendingStudentDraft(draft: PendingStudentDraft): void {
    this.selectedStudent.set(null);
    this.pendingStudentDraft.set(draft);
  }

  clearSelectedStudent(): void {
    this.selectedStudent.set(null);
    this.pendingStudentDraft.set(null);
  }

  completeEnrollmentSession(): void {
    this.clearSelectedStudent();
  }

  hasEnrollmentTarget(): boolean {
    return this.selectedStudent() != null || this.pendingStudentDraft() != null;
  }

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

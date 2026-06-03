import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubjectEvaluationService } from '../../../core/services/profesor/subject-evaluation.service';
import { TeacherTeachingContextService } from '../../../core/services/profesor/teacher-teaching-context.service';
import { AuthService } from '../../../core/services/auth.service';
import { EvaluationPeriod, TutoredCourseGroup } from '../../../core/models/grade';
import {
  CreateSubjectEvaluationRequest,
  SubjectEvaluation,
} from '../../../core/models/subject-evaluation';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../core/i18n/api-error.util';

/** Alumno con sus asignaturas matriculadas para la tabla de notas del profesor. */
interface StudentWithSubjects {
  id: number;
  name: string;
  surname: string;
  subjects: {
    id: number;
    name: string;
    enrollmentId: number;
  }[];
}

/** Pantalla de profesor para introducir evaluaciones por grupo y periodo. */
@Component({
  selector: 'app-gestion-notas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BotonAtrasComponent, TranslateModule],
  templateUrl: './gestion-notas.component.html',
  styleUrl: './gestion-notas.component.scss'
})
export class GestionNotasComponent implements OnInit {
  private readonly subjectEvaluationService = inject(SubjectEvaluationService);
  private readonly teachingContext = inject(TeacherTeachingContextService);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);

  public selectedGroup = signal<TutoredCourseGroup | null>(null);
  public selectedPeriod = signal<EvaluationPeriod>(EvaluationPeriod.FIRST_TRIMESTER);
  public periods = Object.values(EvaluationPeriod);
  public students = signal<StudentWithSubjects[]>([]);
  public evaluationsMap = new Map<string, SubjectEvaluation>();

  public loading = signal<boolean>(false);
  public saving = signal<boolean>(false);
  public successMessage = signal<string>('');
  public errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    const teacherId = this.authService.getUserId();
    if (!teacherId) {
      this.errorMessage.set(this.translate.instant('common.errors.userNotIdentified'));
      return;
    }
    this.loading.set(true);
    this.teachingContext.getMyTutoredGroups(teacherId).subscribe({
      next: (groups) => {
        if (groups.length === 1) {
          this.selectedGroup.set(groups[0]);
          this.loadEvaluations();
        } else {
          this.errorMessage.set(this.translate.instant('common.errors.noTutorGroups'));
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error('Error al cargar grupos:', err);
        this.errorMessage.set(resolveApiError(this.translate, err, 'common.errors.loadTutorGroups'));
        this.loading.set(false);
      },
    });
  }

  onPeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPeriod.set(select.value as EvaluationPeriod);
    if (this.selectedGroup()) {
      this.loadEvaluations();
    }
  }

  private getEvaluationKey(
    studentId: number,
    subjectId: number,
    period = this.selectedPeriod(),
  ): string {
    return `${period}-${studentId}-${subjectId}`;
  }

  loadEvaluations(): void {
    const group = this.selectedGroup();
    if (!group) return;

    const period = this.selectedPeriod();
    this.loading.set(true);
    this.subjectEvaluationService
      .getByTutorAssignmentAndPeriod(group.id, period)
      .subscribe({
        next: (res) => {
          if (period !== this.selectedPeriod()) {
            return;
          }

          const enrollments = group.studentEnrollments || [];

          if (enrollments.length === 0) {
            this.errorMessage.set(this.translate.instant('common.errors.noStudentsInGroup'));
            this.students.set([]);
          } else {
            this.errorMessage.set('');

            const studentMap = new Map<number, StudentWithSubjects>();

            enrollments.forEach((e) => {
              if (!e.student?.id) return;
              if (!studentMap.has(e.student.id)) {
                studentMap.set(e.student.id, {
                  id: e.student.id,
                  name: e.student.name,
                  surname: e.student.surname,
                  subjects: [],
                });
              }
              if (e.subject?.id) {
                studentMap.get(e.student.id)!.subjects.push({
                  id: e.subject.id,
                  name: e.subject.name,
                  enrollmentId: e.id,
                });
              }
            });

            this.students.set(Array.from(studentMap.values()));
          }

          this.evaluationsMap.clear();
          (res.data ?? []).forEach((evaluation) => {
            const studentId = evaluation.studentEnrollment?.idStudent;
            const subjectId = evaluation.studentEnrollment?.idSubject;
            if (studentId && subjectId) {
              const key = this.getEvaluationKey(studentId, subjectId, evaluation.period);
              this.evaluationsMap.set(key, evaluation);
            }
          });

          this.loading.set(false);
        },
        error: (err) => {
          if (period !== this.selectedPeriod()) {
            return;
          }
          console.error('Error al cargar evaluaciones:', err);
          this.errorMessage.set(resolveApiError(this.translate, err, 'common.errors.loadNotes'));
          this.loading.set(false);
        },
      });
  }

  getGradeValue(studentId: number, subjectId: number): number | string {
    const key = this.getEvaluationKey(studentId, subjectId);
    return this.evaluationsMap.get(key)?.value ?? '';
  }

  onGradeChange(studentId: number, subjectId: number, enrollmentId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);

    if (!isNaN(value) && value < 1) {
      value = 1;
      input.value = '1';
    }
    if (!isNaN(value) && value > 10) {
      value = 10;
      input.value = '10';
    }

    const key = this.getEvaluationKey(studentId, subjectId);
    const current = this.evaluationsMap.get(key);
    if (current) {
      current.value = isNaN(value) ? undefined : value;
    } else {
      this.evaluationsMap.set(key, {
        id: 0,
        idStudentEnrollment: enrollmentId,
        period: this.selectedPeriod(),
        value: isNaN(value) ? undefined : value,
      });
    }
  }

  saveGrades(): void {
    const studentsList = this.students();
    const evaluationsToSave: CreateSubjectEvaluationRequest[] = [];
    let allGraded = true;

    for (const student of studentsList) {
      for (const subject of student.subjects) {
        const key = this.getEvaluationKey(student.id, subject.id);
        const evaluation = this.evaluationsMap.get(key);

        if (
          !evaluation ||
          evaluation.value === undefined ||
          evaluation.value === null ||
          isNaN(evaluation.value)
        ) {
          allGraded = false;
          break;
        }

        evaluationsToSave.push({
          idStudentEnrollment: subject.enrollmentId,
          period: this.selectedPeriod(),
          value: Number(evaluation.value),
          observations: evaluation.observations ?? null,
        });
      }
      if (!allGraded) break;
    }

    if (!allGraded) {
      this.errorMessage.set(this.translate.instant('common.errors.allGradesRequired'));
      setTimeout(() => this.errorMessage.set(''), 5000);
      return;
    }

    this.saving.set(true);
    this.subjectEvaluationService
      .bulkUpsertSubjectEvaluations({ evaluations: evaluationsToSave })
      .subscribe({
        next: () => {
          this.successMessage.set(this.translate.instant('grades.savedSuccess'));
          this.saving.set(false);
          setTimeout(() => this.successMessage.set(''), 3000);
          this.loadEvaluations();
        },
        error: (err) => {
          console.error('Error al guardar evaluaciones:', err);
          const errorMsg =
            err.error?.message ||
            err.error?.errors?.formErrors?.[0] ||
            this.translate.instant('common.errors.saveNotes');
          this.errorMessage.set(errorMsg);
          this.saving.set(false);
        },
      });
  }

  getAverage(studentId: number): string {
    const student = this.students().find((s) => s.id === studentId);
    if (!student?.subjects?.length) return '0';

    let sum = 0;
    let count = 0;

    student.subjects.forEach((sub) => {
      const val = this.getGradeValue(studentId, sub.id);
      if (val !== '' && !isNaN(Number(val))) {
        sum += Number(val);
        count++;
      }
    });

    return count > 0 ? (sum / count).toFixed(2) : '0';
  }
}

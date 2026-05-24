import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '../../../../../core/models/course';
import { CourseAssignmentsContext } from '../../../../../core/models/course-assignments/course-assignments-context.model';
import { AssignmentsService } from '../../../../../core/services/admin/entities/assignments.service';

/** Pasos del asistente: primero ciclo, después nivel/grade. */
type WizardStep = 1 | 2;

/**
 * Wizard ciclo → grade para crear asignaciones docentes (CURSO-97).
 */
@Component({
  selector: 'app-course-assignments-wizard',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './course-assignments-wizard.component.html',
  styleUrl: './course-assignments-wizard.component.scss',
})
export class CourseAssignmentsWizardComponent implements OnInit {
  /** Servicio que carga los grades disponibles para un ciclo. */
  private readonly assignmentsService = inject(AssignmentsService);

  /** Ciclos disponibles recibidos desde el listado de cursos. */
  readonly courses = input.required<Course[]>();

  /** Cancela el asistente completo. */
  readonly cancel = output<void>();

  /** Emite el contexto seleccionado para abrir el grid de asignaciones. */
  readonly completed = output<CourseAssignmentsContext>();

  /** Paso actual del wizard. */
  readonly step = signal<WizardStep>(1);

  /** Ciclo seleccionado en el primer paso. */
  readonly selectedCourseId = signal<number | null>(null);

  /** Grade seleccionado en el segundo paso. */
  readonly selectedGrade = signal<string | null>(null);

  /** Grades devueltos por backend para el ciclo seleccionado. */
  readonly grades = signal<string[]>([]);

  /** Estado de carga de grades. */
  readonly loadingGrades = signal(false);

  /** Error o ausencia de grades para el ciclo seleccionado. */
  readonly gradesError = signal(false);

  /** Activa mensajes cuando se intenta avanzar sin selección. */
  readonly showValidation = signal(false);

  /** Si solo hay un ciclo, lo preselecciona para reducir pasos. */
  ngOnInit(): void {
    if (this.courses().length === 1) {
      this.selectCourse(this.courses()[0].id);
    }
  }

  /** Nombre del ciclo seleccionado para mostrarlo en el segundo paso. */
  selectedCourseName(): string {
    const id = this.selectedCourseId();
    if (id == null) {
      return '';
    }
    return this.courses().find((c) => c.id === id)?.name ?? '';
  }

  /** Retrocede de grade a ciclo o cancela si ya está en el primer paso. */
  onBack(): void {
    if (this.step() === 2) {
      this.step.set(1);
      this.selectedGrade.set(null);
      this.showValidation.set(false);
      return;
    }
    this.cancel.emit();
  }

  /** Selecciona ciclo y carga los grades disponibles para ese ciclo. */
  selectCourse(idCourse: number): void {
    if (!idCourse || Number.isNaN(idCourse)) {
      this.selectedCourseId.set(null);
      this.grades.set([]);
      return;
    }
    this.selectedCourseId.set(idCourse);
    this.selectedGrade.set(null);
    this.grades.set([]);
    this.gradesError.set(false);
    this.showValidation.set(false);
    this.loadingGrades.set(true);

    this.assignmentsService.getGradesByCourse(idCourse).subscribe((res) => {
      this.loadingGrades.set(false);
      if (!res.success || res.data.length === 0) {
        this.gradesError.set(true);
        this.grades.set([]);
        return;
      }
      this.grades.set(res.data);
    });
  }

  /** Avanza al paso de grade validando que haya ciclo y oferta disponible. */
  goToGradeStep(): void {
    if (this.selectedCourseId() == null) {
      this.showValidation.set(true);
      return;
    }
    if (this.grades().length === 0 && !this.loadingGrades()) {
      this.gradesError.set(true);
      return;
    }
    this.step.set(2);
    this.showValidation.set(false);
  }

  /** Selecciona el grade que delimitará las asignaturas del grid. */
  selectGrade(grade: string): void {
    this.selectedGrade.set(grade);
    this.showValidation.set(false);
  }

  /** Confirma el contexto ciclo+grade y abre el grid de asignaciones. */
  confirmGrade(): void {
    const idCourse = this.selectedCourseId();
    const grade = this.selectedGrade();
    if (idCourse == null || !grade) {
      this.showValidation.set(true);
      return;
    }
    this.completed.emit({
      idCourse,
      courseName: this.selectedCourseName(),
      grade,
    });
  }

  /** Muestra grades numéricos como ordinales (`1º`, `2º`). */
  gradeLabel(grade: string): string {
    const normalized = grade.trim();
    if (/^\d+$/.test(normalized)) {
      return `${normalized}º`;
    }
    return grade;
  }
}

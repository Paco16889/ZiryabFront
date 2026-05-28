import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { Subject } from '../../../../../core/models/subject';
import { BotonConfirmarStudentComponent } from '../../../botones/boton-confirmar-student/boton-confirmar-student.component';
import { Student } from '../../../../../core/models/student';
import {
  EnrollmentConfirmErrorCode,
  StudentRegistrationService,
} from '../../../../../core/services/admin/student-registration.service';
import { SelectedStudentService } from '../../../../../core/services/admin/selected-student.service';
import { normalizeGradeValue } from '../../../../../core/utils/week-schedule-assignment-filters';

/**
 * Paso 3 del wizard de matriculación: elegir ciclo, grupo y asignaturas
 * antes de confirmar el alta en backend (EQ-311 / EQ-313).
 */
@Component({
  selector: 'app-set-registration',
  imports: [FormsModule, BotonConfirmarStudentComponent, TranslateModule],
  templateUrl: './set-registration.component.html',
  styleUrl: './set-registration.component.scss',
})
export class SetRegistrationComponent {
  /** Catálogo de ciclos formativos. */
  private readonly courseService = inject(CourseService);

  /** Catálogo de grupos académicos. */
  private readonly groupService = inject(GroupService);

  /** Asignaturas por ciclo y selección para matricular. */
  private readonly subjectService = inject(SubjectService);

  /** Confirmación de matrícula (alumno nuevo o existente). */
  private readonly studentRegService = inject(StudentRegistrationService);

  /** Mensajes de error i18n del paso 3. */
  private readonly translate = inject(TranslateService);

  /** Alumno/borrador activo y estado del wizard. */
  readonly studentSelectedService = inject(SelectedStudentService);

  /** Ciclos cargados desde `CourseService`. */
  readonly courses = this.courseService.courses;

  /** Grupos cargados desde `GroupService`. */
  readonly groups = this.groupService.groups;

  /** Ciclo seleccionado en el desplegable. */
  selectedCicloId: number | null = null;

  /** Grupo donde se matriculará al alumno. */
  selectedGroupId: number | null = null;

  /** Asignaturas del ciclo elegido (todas las ofertas). */
  asignaturasPorCiclo: Subject[] | null = null;

  /** Asignaturas marcadas para la matrícula. */
  selectedSubjects: Subject[] = [];

  /** Oferta completa activa (solo un grade a la vez); null = selección suelta. */
  activeFullOfferGrade: string | null = null;

  /** Nombre del alumno o borrador mostrado en cabecera. */
  enrollmentTargetLabel = '';

  /** Confirmación de matrícula en curso. */
  readonly isSaving = signal(false);

  /** Mensaje de error traducido tras fallo al guardar. */
  readonly saveError = signal<string | null>(null);

  /** Listado de alumnos (legacy del contenedor padre). */
  @Input() students: Student[] = [];

  /** Cierra el wizard tras matrícula exitosa. */
  @Output() closeForm = new EventEmitter<void>();

  /** Carga catálogos y etiqueta del objetivo de matrícula. */
  ngOnInit(): void {
    this.courseService.loadCourses();
    this.groupService.loadGroups();
    this.subjectService.loadSubjects();
    this.enrollmentTargetLabel = this.studentSelectedService.enrollmentTargetLabel();
  }

  /** Limpia asignaturas y oferta completa seleccionada. */
  private resetSubjectSelection(): void {
    this.selectedSubjects = [];
    this.activeFullOfferGrade = null;
  }

  /** Al cambiar ciclo, resetea grupo y asignaturas. */
  eligeCiclo(): void {
    this.selectedGroupId = null;
    this.asignaturasPorCiclo = null;
    this.resetSubjectSelection();
  }

  /** Carga asignaturas del ciclo cuando hay ciclo y grupo válidos. */
  eligeGrupo(): void {
    if (this.selectedCicloId == null || this.selectedGroupId == null) {
      this.asignaturasPorCiclo = null;
      this.resetSubjectSelection();
      return;
    }

    this.asignaturasPorCiclo = this.subjectService.loadByCourse(this.selectedCicloId);
    this.resetSubjectSelection();
  }

  /** Grades distintos presentes en la oferta del ciclo. */
  availableFullOfferGrades(): string[] {
    const grades = new Set<string>();
    for (const subject of this.asignaturasPorCiclo ?? []) {
      grades.add(normalizeGradeValue(subject.grade));
    }
    return [...grades].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  /** Asignaturas de un grade concreto dentro del ciclo. */
  private subjectsForGrade(grade: string): Subject[] {
    const gradeNorm = normalizeGradeValue(grade);
    return (this.asignaturasPorCiclo ?? []).filter(
      (subject) => normalizeGradeValue(subject.grade) === gradeNorm,
    );
  }

  /** Indica si la oferta completa de un grade está activa. */
  isFullOfferSelected(grade: string): boolean {
    return this.activeFullOfferGrade === normalizeGradeValue(grade);
  }

  /** Marca o desmarca todas las asignaturas de un grade. */
  toggleFullOffer(grade: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const gradeNorm = normalizeGradeValue(grade);

    if (input.checked) {
      this.activeFullOfferGrade = gradeNorm;
      this.selectedSubjects = [...this.subjectsForGrade(gradeNorm)];
      return;
    }

    if (this.activeFullOfferGrade === gradeNorm) {
      this.resetSubjectSelection();
    }
  }

  /** Comprueba si una asignatura está en `selectedSubjects`. */
  isSubjectSelected(subject: Subject): boolean {
    return this.selectedSubjects.some((s) => s.id === subject.id);
  }

  /** Añade o quita una asignatura de la selección manual. */
  onToggleSubject(subject: Subject, event: Event): void {
    const input = event.target as HTMLInputElement;

    if (this.activeFullOfferGrade !== null) {
      this.activeFullOfferGrade = null;
      this.selectedSubjects = [];
    }

    if (input.checked) {
      this.selectedSubjects.push(subject);
    } else {
      this.selectedSubjects = this.selectedSubjects.filter((s) => s.id !== subject.id);
    }
  }

  /** EQ-313: cerrar wizard solo tras respuesta OK; mantener UI bloqueada mientras guarda. */
  onConfirmRegistration(): void {
    if (this.isSaving() || this.selectedGroupId == null) {
      return;
    }

    this.saveError.set(null);
    this.subjectService.setSelectedSubjects(this.selectedSubjects);

    this.isSaving.set(true);
    this.studentSelectedService.enrollmentInProgress.set(true);

    this.studentRegService.confirmEnrollment(this.selectedGroupId).subscribe({
      next: () => {
        this.finishSaving();
        this.closeForm.emit();
      },
      error: (err: unknown) => {
        this.finishSaving();
        this.saveError.set(this.resolveSaveErrorMessage(err));
      },
    });
  }

  /** Restaura flags de guardado en curso. */
  private finishSaving(): void {
    this.isSaving.set(false);
    this.studentSelectedService.enrollmentInProgress.set(false);
  }

  /** Traduce códigos de `EnrollmentConfirmErrorCode` a mensaje de UI. */
  private resolveSaveErrorMessage(err: unknown): string {
    const code =
      err instanceof Error ? (err.message as EnrollmentConfirmErrorCode) : 'REGISTRATION_FAILED';

    if (code === 'STUDENT_CREATE_FAILED') {
      return this.translate.instant('studentEnrollment.setRegistration.saveErrorStudent');
    }
    if (code === 'NO_SUBJECTS' || code === 'NO_STUDENT') {
      return this.translate.instant('studentEnrollment.setRegistration.saveErrorGeneric');
    }
    return this.translate.instant('studentEnrollment.setRegistration.saveErrorRegistration');
  }
}

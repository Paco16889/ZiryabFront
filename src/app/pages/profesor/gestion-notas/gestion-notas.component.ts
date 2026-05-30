import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GradeService } from '../../../core/services/profesor/grade.service';
import { TeacherTeachingContextService } from '../../../core/services/profesor/teacher-teaching-context.service';
import { AuthService } from '../../../core/services/auth.service';
import { EvaluationPeriod, Grade, CreateGradeRequest, TutoredCourseGroup } from '../../../core/models/grade';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../core/i18n/api-error.util';

/** Alumno con sus asignaturas matriculadas para la tabla de notas del profesor. */
interface StudentWithSubjects {
  /** Identificador del alumno. */
  id: number;
  /** Nombre del alumno. */
  name: string;
  /** Apellido del alumno. */
  surname: string;
  /** Asignaturas del alumno dentro del grupo tutorado. */
  subjects: {
    /** Identificador de asignatura. */
    id: number;
    /** Nombre de asignatura. */
    name: string;
    /** Matrícula que recibirá la nota. */
    enrollmentId: number;
  }[];
}

/** Pantalla de profesor para introducir notas por grupo y periodo. */
@Component({
  selector: 'app-gestion-notas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BotonAtrasComponent, TranslateModule],
  templateUrl: './gestion-notas.component.html',
  styleUrl: './gestion-notas.component.scss'
})
export class GestionNotasComponent implements OnInit {
  /** Servicio de calificaciones. */
  private gradeService = inject(GradeService);
  private teachingContext = inject(TeacherTeachingContextService);
  private authService = inject(AuthService);
  /** Constructor de formularios, reservado para controles reactivos. */
  private fb = inject(FormBuilder);
  /** Traducciones de mensajes. */
  private readonly translate = inject(TranslateService);

  public selectedGroup = signal<TutoredCourseGroup | null>(null);
  public selectedPeriod = signal<EvaluationPeriod>(EvaluationPeriod.FIRST_TRIMESTER);
  /** Periodos disponibles para selector. */
  public periods = Object.values(EvaluationPeriod);
  
  /** Alumnos agrupados con asignaturas del grupo. */
  public students = signal<StudentWithSubjects[]>([]);
  /** Mapa editable de notas indexado por periodo, alumno y asignatura. */
  public gradesMap = new Map<string, Grade>(); 

  /** Estado de carga de grupos/notas. */
  public loading = signal<boolean>(false);
  /** Estado de guardado bulk. */
  public saving = signal<boolean>(false);
  /** Mensaje de éxito temporal. */
  public successMessage = signal<string>('');
  /** Mensaje de error visible. */
  public errorMessage = signal<string>('');

  /** Carga grupos tutorizados al montar la pantalla. */
  ngOnInit(): void {
    this.loadGroups();
  }

  /** Carga grupos donde el profesor actúa como tutor. */
  loadGroups(): void {
    const teacherId = this.authService.getUserId();
    if (!teacherId) {
      this.errorMessage.set(this.translate.instant('common.errors.userNotIdentified'));
      return;
    }
    this.loading.set(true);
    this.teachingContext.getMyTutoredGroups(teacherId).subscribe({
      next: (groups) => {
        if (groups.length > 0) {
          this.selectedGroup.set(groups[0]);
          this.loadGrades();
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

  /** Cambia el periodo y recarga notas del grupo seleccionado. */
  onPeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPeriod.set(select.value as EvaluationPeriod);
    if (this.selectedGroup()) {
      this.loadGrades();
    }
  }

  /** Genera una clave estable para localizar una nota en el mapa editable. */
  private getGradeKey(studentId: number, subjectId: number, period = this.selectedPeriod()): string {
    return `${period}-${studentId}-${subjectId}`;
  }

  /** Carga notas del grupo/periodo y construye la tabla por alumno-asignatura. */
  loadGrades(): void {
    const group = this.selectedGroup();
    if (!group) return;

    const period = this.selectedPeriod();
    this.loading.set(true);
    this.gradeService.getGradesByCourseGroupAndPeriod(group.id, period).subscribe({
      next: (res) => {
        if (period !== this.selectedPeriod()) {
          return;
        }

        console.log('Notas del grupo recibidas:', res.data);
        
        const enrollments = group.studentEnrollments || [];
        
        if (enrollments.length === 0) {
          this.errorMessage.set(this.translate.instant('common.errors.noStudentsInGroup'));
          this.students.set([]);
        } else {
          this.errorMessage.set('');
          
          // Agrupar asignaturas por alumno
          const studentMap = new Map<number, StudentWithSubjects>();
          
          enrollments.forEach((e) => {
            if (!studentMap.has(e.student!.id)) {
              studentMap.set(e.student!.id, {
                id: e.student!.id,
                name: e.student!.name,
                surname: e.student!.surname,
                subjects: []
              });
            }
            studentMap.get(e.student!.id)!.subjects.push({
              id: e.subject!.id,
              name: e.subject!.name,
              enrollmentId: e.id
            });
          });

          this.students.set(Array.from(studentMap.values()));
        }

        // Mapear notas existentes
        this.gradesMap.clear();
        res.data.forEach((grade: Grade) => {
          const studentId = grade.studentEnrollment?.idStudent;
          const subjectId = grade.studentEnrollment?.idSubject;
          if (studentId && subjectId) {
            const key = this.getGradeKey(studentId, subjectId, grade.period);
            this.gradesMap.set(key, grade);
          }
        });

        this.loading.set(false);
      },
      error: (err) => {
        if (period !== this.selectedPeriod()) {
          return;
        }

        console.error('Error al cargar notas:', err);
        this.errorMessage.set(resolveApiError(this.translate, err, 'common.errors.loadNotes'));
        this.loading.set(false);
      }
    });
  }

  /** Devuelve el valor visible de una nota en la tabla. */
  getGradeValue(studentId: number, subjectId: number): number | string {
    const key = this.getGradeKey(studentId, subjectId);
    return this.gradesMap.get(key)?.value || '';
  }

  /** Actualiza localmente una nota, limitándola al rango 1-10. */
  onGradeChange(studentId: number, subjectId: number, enrollmentId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value);
    
    // la nota minima debe ser 1 (si o si)
    if (!isNaN(value) && value < 1) {
      value = 1;
      input.value = '1';
    }
    
    // la nota maxima debe ser 10 (si o si)
    if (!isNaN(value) && value > 10) {
      value = 10;
      input.value = '10';
    }
    
    const key = this.getGradeKey(studentId, subjectId);
    
    const currentGrade = this.gradesMap.get(key);
    if (currentGrade) {
      currentGrade.value = isNaN(value) ? undefined : value;
    } else {
      this.gradesMap.set(key, {
        id: 0,
        idStudentEnrollment: enrollmentId,
        period: this.selectedPeriod(),
        value: isNaN(value) ? undefined : value,
        idTeacher: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Grade);
    }
  }

  /** Valida que todas las celdas tengan nota y guarda en lote. */
  saveGrades(): void {
    const studentsList = this.students();
    const gradesToSave: CreateGradeRequest[] = [];
    let allGraded = true;

    for (const student of studentsList) {
      for (const subject of student.subjects) {
        const key = this.getGradeKey(student.id, subject.id);
        const grade = this.gradesMap.get(key);
        
        if (!grade || grade.value === undefined || grade.value === null || isNaN(grade.value)) {
          console.warn(`Asignatura sin calificar: Alumno ${student.name}, Asignatura ${subject.name}`);
          allGraded = false;
          break;
        }
        
        gradesToSave.push({
          idStudentEnrollment: subject.enrollmentId,
          period: this.selectedPeriod(),
          value: Number(grade.value),
          observations: grade.observations
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
    this.gradeService.bulkUpsertGrades({ grades: gradesToSave }).subscribe({
      next: () => {
        this.successMessage.set(this.translate.instant('grades.savedSuccess'));
        this.saving.set(false);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        console.error('Error al guardar notas:', err);
        const errorMsg =
          err.error?.message ||
          err.error?.errors?.formErrors?.[0] ||
          this.translate.instant('common.errors.saveNotes');
        this.errorMessage.set(errorMsg);
        this.saving.set(false);
      }
    });
  }

  /** Calcula la media de un alumno en el periodo seleccionado. */
  getAverage(studentId: number): string {
    const student = this.students().find(s => s.id === studentId);
    if (!student || !student.subjects || student.subjects.length === 0) return '0';
    
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

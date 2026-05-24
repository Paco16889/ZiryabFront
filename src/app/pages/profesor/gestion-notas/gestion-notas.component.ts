import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GradeService } from '../../../core/services/profesor/grade.service';
import { EvaluationPeriod, Grade, CreateGradeRequest } from '../../../core/models/grade';
import { Group } from '../../../core/models/group';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../core/i18n/api-error.util';

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

@Component({
  selector: 'app-gestion-notas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BotonAtrasComponent, TranslateModule],
  templateUrl: './gestion-notas.component.html',
  styleUrl: './gestion-notas.component.scss'
})
export class GestionNotasComponent implements OnInit {
  private gradeService = inject(GradeService);
  private fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);

  public groups = signal<Group[]>([]);
  public selectedGroup = signal<Group | null>(null);
  public selectedPeriod = signal<EvaluationPeriod>(EvaluationPeriod.FIRST_TRIMESTER);
  public periods = Object.values(EvaluationPeriod);
  
  public students = signal<StudentWithSubjects[]>([]);
  public gradesMap = new Map<string, Grade>(); 

  public loading = signal<boolean>(false);
  public saving = signal<boolean>(false);
  public successMessage = signal<string>('');
  public errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.loading.set(true);
    this.gradeService.getTutoredGroups().subscribe({
      next: (res) => {
        console.log('Grupos tutorados recibidos:', res.data);
        if (res.data && res.data.length > 0) {
          // Seleccionamos el primer grupo (según el usuario, solo hay uno)
          this.selectedGroup.set(res.data[0]);
          this.loadGrades();
        } else {
          this.errorMessage.set(this.translate.instant('common.errors.noTutorGroups'));
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar grupos:', err);
        this.errorMessage.set(resolveApiError(this.translate, err, 'common.errors.loadTutorGroups'));
        this.loading.set(false);
      }
    });
  }

  onPeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPeriod.set(select.value as EvaluationPeriod);
    if (this.selectedGroup()) {
      this.loadGrades();
    }
  }

  private getGradeKey(studentId: number, subjectId: number, period = this.selectedPeriod()): string {
    return `${period}-${studentId}-${subjectId}`;
  }

  loadGrades(): void {
    const group = this.selectedGroup();
    if (!group) return;

    const period = this.selectedPeriod();
    this.loading.set(true);
    this.gradeService.getGradesByGroupAndPeriod(group.id, period).subscribe({
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

  getGradeValue(studentId: number, subjectId: number): number | string {
    const key = this.getGradeKey(studentId, subjectId);
    return this.gradesMap.get(key)?.value || '';
  }

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

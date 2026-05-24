import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradeService } from '../../../core/services/profesor/grade.service';
import { EvaluationPeriod, MyGradesResponse } from '../../../core/models/grade';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../core/i18n/api-error.util';

/** Pantalla del alumno para consultar sus calificaciones por asignatura y periodo. */
@Component({
  selector: 'app-mis-evaluaciones',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent, TranslateModule],
  templateUrl: './mis-notas.component.html',
  styleUrl: './mis-notas.component.scss'
})
export class MisNotasComponent implements OnInit {
  /** Servicio que consulta las notas del alumno autenticado. */
  private gradeService = inject(GradeService);
  /** Traducciones de errores y etiquetas. */
  private readonly translate = inject(TranslateService);

  /** Notas agrupadas por asignatura. */
  public subjectsGrades = signal<MyGradesResponse[]>([]);
  /** Periodos evaluables que se muestran como columnas. */
  public periods = Object.values(EvaluationPeriod);
  /** Estado de carga inicial. */
  public loading = signal<boolean>(true);
  /** Mensaje de error traducido. */
  public errorMessage = signal<string>('');

  /** Carga las notas al entrar en la pantalla. */
  ngOnInit(): void {
    this.loadMyGrades();
  }

  /** Solicita las notas del alumno al backend y actualiza el estado de la tabla. */
  loadMyGrades(): void {
    this.loading.set(true);
    this.gradeService.getMyGrades().subscribe({
      next: (res) => {
        // En el backend se devuelve { enrollmentId, subjectId, grades }
        this.subjectsGrades.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(resolveApiError(this.translate, err, 'common.errors.loadGrades'));
        this.loading.set(false);
      }
    });
  }

  /** Devuelve la nota de una asignatura para un periodo, o `-` si no existe. */
  getGradeForPeriod(subject: MyGradesResponse, period: string): string {
    const grade = subject.grades.find((g) => g.period === period);
    return grade ? (grade.value?.toString() || '-') : '-';
  }

  /** Calcula la media visible de todas las asignaturas para un periodo. */
  getAverageForPeriod(period: string): string {
    const subjects = this.subjectsGrades();
    if (subjects.length === 0) return '0';
    
    let sum = 0;
    let count = 0;
    
    subjects.forEach(sub => {
      const val = this.getGradeForPeriod(sub, period);
      if (val !== '-' && !isNaN(Number(val))) {
        sum += Number(val);
        count++;
      }
    });
    
    return count > 0 ? (sum / count).toFixed(2) : '0';
  }
}

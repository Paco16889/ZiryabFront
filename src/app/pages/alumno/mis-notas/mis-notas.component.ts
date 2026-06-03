import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectEvaluationService } from '../../../core/services/profesor/subject-evaluation.service';
import { EvaluationPeriod } from '../../../core/models/grade';
import { MySubjectEvaluationsByEnrollment } from '../../../core/models/subject-evaluation';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../core/i18n/api-error.util';

/** Pantalla del alumno para consultar sus evaluaciones por asignatura y periodo. */
@Component({
  selector: 'app-mis-evaluaciones',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent, TranslateModule],
  templateUrl: './mis-notas.component.html',
  styleUrl: './mis-notas.component.scss'
})
export class MisNotasComponent implements OnInit {
  private readonly subjectEvaluationService = inject(SubjectEvaluationService);
  private readonly translate = inject(TranslateService);

  public subjectsGrades = signal<MySubjectEvaluationsByEnrollment[]>([]);
  public periods = Object.values(EvaluationPeriod);
  public loading = signal<boolean>(true);
  public errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadMyEvaluations();
  }

  loadMyEvaluations(): void {
    this.loading.set(true);
    this.subjectEvaluationService.getMySubjectEvaluations().subscribe({
      next: (res) => {
        this.subjectsGrades.set(res.data ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(resolveApiError(this.translate, err, 'common.errors.loadGrades'));
        this.loading.set(false);
      },
    });
  }

  getGradeForPeriod(subject: MySubjectEvaluationsByEnrollment, period: string): string {
    const evaluation = subject.evaluations.find((e) => e.period === period);
    return evaluation?.value != null ? evaluation.value.toString() : '-';
  }

  getAverageForPeriod(period: string): string {
    const subjects = this.subjectsGrades();
    if (subjects.length === 0) return '0';

    let sum = 0;
    let count = 0;

    subjects.forEach((sub) => {
      const val = this.getGradeForPeriod(sub, period);
      if (val !== '-' && !isNaN(Number(val))) {
        sum += Number(val);
        count++;
      }
    });

    return count > 0 ? (sum / count).toFixed(2) : '0';
  }
}

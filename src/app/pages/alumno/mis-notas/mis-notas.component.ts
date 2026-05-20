import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradeService } from '../../../core/services/profesor/grade.service';
import { EvaluationPeriod, MyGradesResponse } from '../../../core/models/grade';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mis-evaluaciones',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent, TranslateModule],
  templateUrl: './mis-notas.component.html',
  styleUrl: './mis-notas.component.scss'
})
export class MisNotasComponent implements OnInit {
  private gradeService = inject(GradeService);

  public subjectsGrades = signal<MyGradesResponse[]>([]);
  public periods = Object.values(EvaluationPeriod);
  public loading = signal<boolean>(true);
  public errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadMyGrades();
  }

  loadMyGrades(): void {
    this.loading.set(true);
    this.gradeService.getMyGrades().subscribe({
      next: (res) => {
        // En el backend se devuelve { enrollmentId, subjectId, grades }
        this.subjectsGrades.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar tus notas');
        this.loading.set(false);
      }
    });
  }

  getGradeForPeriod(subject: MyGradesResponse, period: string): string {
    const grade = subject.grades.find((g) => g.period === period);
    return grade ? (grade.value?.toString() || '-') : '-';
  }

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

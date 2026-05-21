import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AuthService } from '../../../core/services/auth.service';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { CardGridComponent, CardItem } from '../../shared/card-grid/card-grid.component';
import { TeacherSubjectAssignmentRow } from '../../../core/models/teacher/subjectforteacher';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * Componente que muestra las asignaturas asignadas al profesor autenticado.
 */
@Component({
  selector: 'app-clases-profesor',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent, CardGridComponent, TranslateModule],
  templateUrl: './clases-profesor.component.html',
  styleUrl: './clases-profesor.component.scss'
})
export class ClasesProfesorComponent implements OnInit {

  private navegador = inject(NavigationService);
  private router = inject(Router);
  private clasesService = inject(ClasesService);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  public asignaturasCards = signal<CardItem[]>([]);
  private asignaturasOriginales = signal<TeacherSubjectAssignmentRow[]>([]);
  public loading = signal<boolean>(true);
  public errorMessage = signal<string>('');

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (user && user.id) {
      this.clasesService.getAsignaturasProfesor(user.id).subscribe({
        next: (response) => {
          if (response.data.length === 0) {
            this.errorMessage.set(this.translate.instant('teacherClasses.noAssigned'));
          }
          this.asignaturasOriginales.set(response.data);
          this.construirCards();
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set(this.translate.instant('teacherClasses.errorConnection'));
          this.loading.set(false);
        }
      });
    } else {
      this.errorMessage.set(this.translate.instant('teacherClasses.errorUser'));
      this.loading.set(false);
      this.navegador.toComponent('login');
    }
  }

  private construirCards(): void {
    const cards: CardItem[] = this.asignaturasOriginales().map((item) => ({
      id: item.subject.id,
      assignmentId: item.id,
      title: item.subject.name,
      subtitleTopLabel: 'teacherClasses.courseLabel',
      subtitleTopValue: item.subject?.course?.name || '-',
      subtitleBottomLabel: 'teacherClasses.groupLabel',
      subtitleBottomValue: item.group?.name || '-',
      actionLabel: 'teacherClasses.manageSyllabus',
      secondaryActionLabel: 'teacherClasses.classMenu',
    }));
    this.asignaturasCards.set(cards);
  }

  handleCardAction(item: CardItem): void {
    if (item.title) {
      this.router.navigate(
        [`temario-profesor/${item.title.toLowerCase()}`],
        { queryParams: { subjectId: item.id } }
      );
    }
  }

  handleSecondaryCardAction(item: CardItem): void {
    if (item.assignmentId) {
      this.router.navigate(['/menu-clase', item.assignmentId]);
    }
  }
}

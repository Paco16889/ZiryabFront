import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { AuthService } from '../../../core/services/auth.service';
import { TeacherTeachingContextService } from '../../../core/services/profesor/teacher-teaching-context.service';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { CardGridComponent, CardItem } from '../../shared/card-grid/card-grid.component';
import { TeacherAssignmentContextRow } from '../../../core/models/teacher/teacher-assignment-context';
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

  /** Navegación común para volver a login si no hay sesión. */
  private navegador = inject(NavigationService);
  /** Router usado para abrir temario o menú de clase. */
  private router = inject(Router);
  /** Asignaciones titulares + sustituciones activas. */
  private teachingContext = inject(TeacherTeachingContextService);
  /** Servicio de sesión para obtener el profesor autenticado. */
  private authService = inject(AuthService);
  /** Traducciones de errores y etiquetas. */
  private readonly translate = inject(TranslateService);

  /** Tarjetas de asignaturas que se muestran al profesor. */
  public asignaturasCards = signal<CardItem[]>([]);
  /** Asignaciones originales usadas para reconstruir tarjetas. */
  private asignaturasOriginales = signal<TeacherAssignmentContextRow[]>([]);
  /** Estado de carga inicial. */
  public loading = signal<boolean>(true);
  /** Mensaje de error visible. */
  public errorMessage = signal<string>('');

  /** Carga las asignaturas asignadas al profesor autenticado. */
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (user && user.id) {
      this.teachingContext.getMyAssignmentRows(user.id).subscribe({
        next: (rows) => {
          if (rows.length === 0) {
            this.errorMessage.set(this.translate.instant('common.errors.noSubjectsAssigned'));
          }
          this.asignaturasOriginales.set(rows);
          this.construirCards();
          this.loading.set(false);
        },
        error: () => {
          this.errorMessage.set(this.translate.instant('common.errors.connection'));
          this.loading.set(false);
        }
      });
    } else {
      this.errorMessage.set(this.translate.instant('common.errors.userNotIdentified'));
      this.loading.set(false);
      this.navegador.toComponent('login');
    }
  }

  /** Convierte asignaciones docente-asignatura-grupo en tarjetas reutilizables. */
  private construirCards(): void {
    const cards: CardItem[] = this.asignaturasOriginales().map((item) => ({
      id: item.subject.id,
      assignmentId: item.id,
      title: item.subject.name,
      subtitleTopLabel: 'teacherClasses.labels.course',
      subtitleTopValue: item.subject?.course?.name || 'General',
      subtitleBottomLabel: 'teacherClasses.labels.group',
      subtitleBottomValue: item.group?.name || 'Varios',
      actionLabel: 'teacherClasses.manageSyllabus',
      secondaryActionLabel: 'teacherClasses.classMenu',
      badgeKey: item.isSubstituting ? 'teacherClasses.substitutingBadge' : undefined,
      badgeParams: item.isSubstituting
        ? { name: item.titularTeacherName ?? '—' }
        : undefined,
    }));
    this.asignaturasCards.set(cards);
  }

  /** Abre el temario de la asignatura seleccionada. */
  handleCardAction(item: CardItem): void {
    if (item.title) {
      this.router.navigate(
        [`temario-profesor/${item.title.toLowerCase()}`],
        {
          queryParams: {
            subjectId: item.id,
            ...(item.assignmentId ? { assignmentId: item.assignmentId } : {}),
          },
        },
      );
    }
  }

  /** Abre el menú de clase usando la asignación docente concreta. */
  handleSecondaryCardAction(item: CardItem): void {
    if (item.assignmentId) {
      this.router.navigate(['/menu-clase', item.assignmentId]);
    }
  }
}

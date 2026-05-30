import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { StudentAbsencesModalComponent } from './student-absences-modal/student-absences-modal.component';
import { AssistanceService } from '../../../core/services/alumno/assistance.service';
import { AssistanceItem } from '../../../core/models/assistance';
import { AuthService } from '../../../core/services/auth.service';
import { TeacherTeachingContextService } from '../../../core/services/profesor/teacher-teaching-context.service';
import { environment } from '../../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../core/i18n/api-error.util';

/**
 * Componente que muestra las faltas pendientes de justificar enviadas por los alumnos al profesor.
 */
@Component({
  selector: 'app-ficha-profesor',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent, StudentAbsencesModalComponent, TranslateModule],
  templateUrl: './ficha-profesor.component.html',
  styleUrl: './ficha-profesor.component.scss'
})
export class FichaProfesorComponent implements OnInit {

  private assistanceService = inject(AssistanceService);
  private authService = inject(AuthService);
  private teachingContext = inject(TeacherTeachingContextService);
  private route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  public loading = signal<boolean>(true);
  public statusMessage = signal<{text: string, type: 'error' | 'success' | 'info'} | null>(null);
  public justificacionesPendientes = signal<AssistanceItem[]>([]);
  public isAbsencesModalOpen = signal<boolean>(false);
  public apiUrl = environment.apiUrl;

  private assignmentId: number | null = null;
  private allowedSubjectNames = new Set<string>();

  ngOnInit(): void {
    const param = this.route.snapshot.queryParamMap.get('assignmentId');
    if (param) {
      this.assignmentId = Number(param);
    }
    this.cargarJustificacionesPendientes();
  }

  cargarJustificacionesPendientes(): void {
    const teacherId = this.authService.getUserId();
    if (!teacherId) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.teachingContext.ensureLoaded(teacherId).subscribe({
      next: (rows) => {
        const scope = this.assignmentId != null
          ? rows.filter((r) => r.id === this.assignmentId)
          : rows;
        this.allowedSubjectNames = new Set(
          scope.map((r) => r.subject.name.toLowerCase()),
        );
        this.loadAssistances();
      },
      error: () => this.loadAssistances(),
    });
  }

  private loadAssistances(): void {
    this.assistanceService.getAllAssistances().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const pendientes = res.data.filter((a) => {
            const subjectName =
              a.session?.schedule?.teacherAssignment?.subject?.name?.toLowerCase();
            if (
              this.allowedSubjectNames.size > 0 &&
              subjectName &&
              !this.allowedSubjectNames.has(subjectName)
            ) {
              return false;
            }
            return (
              (a.justificationUri || a.justificationStatus === 'PENDING') &&
              a.status !== 'EXCUSED'
            );
          });
          this.justificacionesPendientes.set(pendientes);

          if (pendientes.length === 0) {
            this.statusMessage.set({
              text: this.translate.instant('teacherPages.justifications.noPending'),
              type: 'info',
            });
          } else {
            this.statusMessage.set(null);
          }
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar justificaciones', err);
        this.statusMessage.set({
          text: resolveApiError(this.translate, err, 'common.errors.loadJustifications'),
          type: 'error',
        });
        this.loading.set(false);
      },
    });
  }

  verJustificante(uri: string): void {
    const fullUrl = uri.startsWith('http') ? uri : `${this.apiUrl.replace('/api', '')}${uri}`;
    window.open(fullUrl, '_blank');
  }

  aceptarJustificacion(assistanceId: number): void {
    this.loading.set(true);
    this.assistanceService.justifyAbsence(assistanceId).subscribe({
      next: (res) => {
        if (res.success) {
          this.statusMessage.set({
            text: this.translate.instant('teacherPages.justifications.successAccept'),
            type: 'success',
          });
          this.justificacionesPendientes.update((list) =>
            list.filter((a) => a.id !== assistanceId),
          );
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al justificar', err);
        this.statusMessage.set({
          text: resolveApiError(this.translate, err, 'fichaProfesor.justifyError'),
          type: 'error',
        });
        this.loading.set(false);
      },
    });
  }

  rechazarJustificacion(assistanceId: number): void {
    this.loading.set(true);
    this.assistanceService.rejectJustification(assistanceId).subscribe({
      next: (res) => {
        if (res.success) {
          this.statusMessage.set({
            text: this.translate.instant('teacherPages.justifications.successReject'),
            type: 'info',
          });
          this.justificacionesPendientes.update((list) =>
            list.filter((a) => a.id !== assistanceId),
          );
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al rechazar', err);
        this.statusMessage.set({
          text: resolveApiError(this.translate, err, 'fichaProfesor.rejectError'),
          type: 'error',
        });
        this.loading.set(false);
      },
    });
  }
}

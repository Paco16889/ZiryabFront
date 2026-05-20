import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { TeacherJustificationService } from '../../../core/services/profesor/teacher-justification.service';
import { PendingJustification } from '../../../core/models/assistance';

/**
 * Listado de justificantes pendientes para que el profesor los acepte o rechace.
 */
@Component({
  selector: 'app-justificaciones-falta',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslateModule, BotonAtrasComponent],
  templateUrl: './justificaciones-falta.component.html',
  styleUrl: './justificaciones-falta.component.scss',
})
export class JustificacionesFaltaComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly justificationService = inject(TeacherJustificationService);

  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly actionError = signal('');
  readonly processingId = signal<number | null>(null);
  readonly items = signal<PendingJustification[]>([]);

  private idTeacherAssignment = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idTeacherAssignment');
    this.idTeacherAssignment = id ? +id : 0;
    this.loadPending();
  }

  loadPending(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    const assignmentId = this.idTeacherAssignment > 0 ? this.idTeacherAssignment : undefined;

    this.justificationService.getPendingJustifications(assignmentId).subscribe({
      next: (res) => {
        if (res.success) {
          this.items.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('teacherJustifications.errors.load');
        this.loading.set(false);
      },
    });
  }

  openDocument(item: PendingJustification): void {
    if (item.justificationUri) {
      window.open(this.justificationService.documentUrl(item.justificationUri), '_blank');
    }
  }

  accept(item: PendingJustification): void {
    this.runAction(item.id, () => this.justificationService.acceptJustification(item.id));
  }

  reject(item: PendingJustification): void {
    this.runAction(item.id, () => this.justificationService.rejectJustification(item.id));
  }

  private runAction(id: number, request: () => ReturnType<TeacherJustificationService['acceptJustification']>): void {
    this.actionError.set('');
    this.processingId.set(id);
    request().subscribe({
      next: () => {
        this.items.update((list) => list.filter((x) => x.id !== id));
        this.processingId.set(null);
      },
      error: () => {
        this.actionError.set('teacherJustifications.errors.action');
        this.processingId.set(null);
      },
    });
  }

  statusLabel(status: PendingJustification['status']): string {
    const map: Record<PendingJustification['status'], string> = {
      ABSENT: 'teacherJustifications.status.absent',
      LATE: 'teacherJustifications.status.late',
      PRESENT: 'teacherJustifications.status.present',
      EXCUSED: 'teacherJustifications.status.excused',
    };
    return map[status] ?? status;
  }
}

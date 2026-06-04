import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClassSession } from '../../../../../core/models/class-sessions';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import {
  matchesClassSessionFilters,
  statusesFromClassSessions,
  weekDaysFromClassSessions,
} from '../../../../../core/utils/class-session-filter.util';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { ClassSessionCancelDialogComponent } from '../class-session-cancel-dialog/class-session-cancel-dialog.component';
import { ClassSessionCreateFormComponent } from '../class-session-create-form/class-session-create-form.component';
import { ClassSessionListItemComponent } from '../class-session-list-item/class-session-list-item.component';

/** Listado administrativo de sesiones de clase con creación y suspensión masiva. */
@Component({
  selector: 'app-class-session-list',
  imports: [
    ClassSessionListItemComponent,
    ClassSessionCreateFormComponent,
    BotonCreateComponent,
    ClassSessionCancelDialogComponent,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './class-session-list.component.html',
  styleUrl: './class-session-list.component.scss',
})
export class ClassSessionListComponent implements OnInit {
  /** Servicio que mantiene la cache de sesiones. */
  private readonly sessionService = inject(ClassSessionService);
  /** Modal global usado para detectar borrados completados. */
  private readonly modalDeleteService = inject(ModalDeleteService);
  /** Modal global usado para detectar ediciones completadas. */
  private readonly modalUpdateService = inject(ModalEditService);

  /** Todas las sesiones cargadas desde el servicio. */
  readonly allSessions = signal<ClassSession[]>([]);
  /** Controla si se muestra el formulario de creación. */
  showCreateForm = false;
  /** Controla el diálogo de suspensión por periodo. */
  showCancelDialog = false;
  /** Número de sesiones suspendidas en la última operación correcta. */
  suspendSuccessCount: number | null = null;

  readonly filterDateFrom = signal('');
  readonly filterDateTo = signal('');
  readonly filterWeekDay = signal<number | null>(null);
  readonly filterStatus = signal<string | null>(null);

  readonly weekDayOptions = computed(() => weekDaysFromClassSessions(this.allSessions()));

  readonly statusOptions = computed(() => statusesFromClassSessions(this.allSessions()));

  readonly filteredSessions = computed(() =>
    this.allSessions().filter((s) =>
      matchesClassSessionFilters(s, {
        dateFrom: this.filterDateFrom() || null,
        dateTo: this.filterDateTo() || null,
        weekDay: this.filterWeekDay(),
        status: this.filterStatus(),
      }),
    ),
  );

  readonly hasActiveFilters = computed(
    () =>
      !!this.filterDateFrom() ||
      !!this.filterDateTo() ||
      this.filterWeekDay() != null ||
      this.filterStatus() != null,
  );

  /** Sincroniza lista y recargas tras acciones de modales genéricos. */
  constructor() {
    effect(() => {
      this.allSessions.set(this.sessionService.classSessions());
    });
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        this.sessionService.loadSessions();
      }
    });
    effect(() => {
      const updateModalState = this.modalUpdateService.modalState();
      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        this.sessionService.loadSessions();
      }
    });
  }

  /** Carga inicial de sesiones. */
  ngOnInit(): void {
    this.sessionService.loadSessions();
  }

  /** Etiqueta i18n del día de la semana (1–7). */
  weekDayLabel(day: number): string {
    return `weekScheduleBuilder.days.${day}`;
  }

  /** Muestra el formulario de creación. */
  openCreateForm(): void {
    this.showCreateForm = true;
  }

  /** Oculta el formulario de creación. */
  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  /** Cierra el formulario y recarga tras crear una sesión. */
  onSessionCreated(): void {
    this.closeCreateForm();
    this.sessionService.loadSessions();
  }

  /** Abre el diálogo de suspensión masiva limpiando el resultado anterior. */
  openCancelDialog(): void {
    this.suspendSuccessCount = null;
    this.showCancelDialog = true;
  }

  /** Cierra el diálogo de suspensión masiva. */
  closeCancelDialog(): void {
    this.showCancelDialog = false;
  }

  /** Recarga sesiones y muestra el contador tras suspender en bloque. */
  onSessionsSuspended(count: number): void {
    this.showCancelDialog = false;
    this.suspendSuccessCount = count;
    this.sessionService.loadSessions();
  }

  /** Restablece todos los filtros del listado. */
  clearFilters(): void {
    this.filterDateFrom.set('');
    this.filterDateTo.set('');
    this.filterWeekDay.set(null);
    this.filterStatus.set(null);
  }
}

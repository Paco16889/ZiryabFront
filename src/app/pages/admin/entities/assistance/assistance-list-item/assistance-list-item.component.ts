import { Component, inject, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  Assistance,
  AssistanceDeleteResponse,
  AssistanceStatus,
  AssistanceUpdateResponse,
} from '../../../../../core/models/assistance';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { GenericListItemComponent } from '../../../generic-list-item/generic-list-item.component';
import {
  AssistanceService,
  AssistanceUpdatePayload,
} from '../../../../../core/services/admin/entities/assistance.service';

/** Etiquetas en castellano para estados de asistencia usados por el CRUD admin. */
const STATUS_LABELS: Record<AssistanceStatus, string> = {
  [AssistanceStatus.PRESENT]: 'Presente',
  [AssistanceStatus.ABSENT]: 'Ausente',
  [AssistanceStatus.LATE]: 'Tarde',
  [AssistanceStatus.EXCUSED]: 'Justificado',
};

/** Fila del listado admin de asistencias basada en el componente genérico. */
@Component({
  selector: 'app-assistance-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './assistance-list-item.component.html',
  styleUrl: './assistance-list-item.component.scss',
})
export class AssistanceListItemComponent {
  /** Servicio usado por el componente genérico para detalle, edición y borrado. */
  private readonly assistanceService = inject(AssistanceService);

  /** Registro de asistencia que se muestra en esta fila. */
  @Input({ required: true }) assistance!: Assistance;

  /** Configuración del item genérico: campos, edición de estado y acciones CRUD. */
  readonly assistanceConfig: ListItemConfig<
    Assistance,
    AssistanceUpdatePayload,
    AssistanceUpdateResponse,
    AssistanceDeleteResponse
  > = {
    fields: [
      {
        key: 'session',
        label: 'Sesión',
        order: 1,
        format: (s: { date?: string }) => (s?.date ? s.date.split('T')[0] : '—'),
      },
      {
        key: 'studentEnrollment',
        label: 'Matrícula',
        order: 2,
        format: (e: { id?: number; student?: { name?: string; surname?: string } }) => {
          if (e?.student) {
            return [e.student.name, e.student.surname].filter(Boolean).join(' ');
          }
          return e?.id != null ? `#${e.id}` : '—';
        },
      },
      {
        key: 'status',
        order: 3,
        format: (s: AssistanceStatus) => STATUS_LABELS[s] ?? s,
      },
    ],
    actions: { edit: true, delete: true, detail: true },
    layout: { responsive: false },
    editFields: [
      {
        name: 'status',
        label: 'Estado',
        fieldType: 'select',
        validators: [Validators.required],
        options: Object.values(AssistanceStatus).map((s) => ({
          value: s,
          label: STATUS_LABELS[s],
        })),
      },
    ],
    entityType: 'el registro de asistencia',
    entityNameFormat: (a: Assistance) =>
      `Asistencia ${a.session?.date?.split('T')[0] ?? a.id}`,
    getByIdFn: (id: number) => this.assistanceService.getAssistanceById(id),
    updateFn: (data: AssistanceUpdatePayload) => this.assistanceService.updateAssistance(data),
    deleteFn: (id: number) => this.assistanceService.deleteAssistance(id),
  };

  /** Configuración de la vista de detalle de asistencia. */
  readonly assistanceDetailConfig: ViewDetailConfig<Assistance> = {
    fields: [
      {
        key: 'status',
        type: 'text',
        label: 'Estado: ',
        format: (s: AssistanceStatus) => STATUS_LABELS[s] ?? String(s),
      },
      { key: 'session.date', type: 'text', label: 'Sesión: ' },
      { key: 'studentEnrollment.id', type: 'text', label: 'Matrícula ID: ' },
    ],
  };
}

import { Component, inject, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  ClassSession,
  ClassSessionDeleteResponse,
  ClassSessionUpdateResponse,
} from '../../../../../core/models/class-sessions';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { GenericListItemComponent } from '../../../generic-list-item/generic-list-item.component';
import {
  ClassSessionService,
  ClassSessionUpdatePayload,
} from '../../../../../core/services/admin/entities/class-session.service';

@Component({
  selector: 'app-class-session-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './class-session-list-item.component.html',
  styleUrl: './class-session-list-item.component.scss',
})
export class ClassSessionListItemComponent {
  private readonly sessionService = inject(ClassSessionService);

  @Input({ required: true }) classSession!: ClassSession;

  readonly classSessionConfig: ListItemConfig<
    ClassSession,
    ClassSessionUpdatePayload,
    ClassSessionUpdateResponse,
    ClassSessionDeleteResponse
  > = {
    fields: [
      {
        key: 'date',
        className: 'font-medium',
        order: 1,
        format: (v: string) => (v ? v.split('T')[0] : '—'),
      },
      { key: 'status', label: 'Estado', order: 2 },
      { key: 'schedule.startTime', label: 'Inicio', order: 3 },
      { key: 'schedule.finishTime', label: 'Fin', order: 4 },
    ],
    actions: { edit: true, delete: true, detail: true },
    layout: { responsive: false },
    editFields: [
      {
        name: 'date',
        label: 'Fecha',
        type: 'date',
        validators: [Validators.required],
      },
      { name: 'status', label: 'Estado', type: 'text' },
      { name: 'appointments', label: 'Anotaciones', type: 'text' },
    ],
    entityType: 'la sesión',
    entityNameFormat: (s: ClassSession) => s.date?.split('T')[0] ?? `Sesión ${s.id}`,
    getByIdFn: (id: number) => this.sessionService.getSessionById(id),
    updateFn: (data: ClassSessionUpdatePayload) => this.sessionService.updateSession(data),
    deleteFn: (id: number) => this.sessionService.deleteSession(id),
  };

  readonly classSessionDetailConfig: ViewDetailConfig<ClassSession> = {
    fields: [
      { key: 'date', type: 'text', label: 'Fecha: ', className: 'text-xl font-bold' },
      { key: 'status', type: 'text', label: 'Estado: ' },
      { key: 'appointments', type: 'text', label: 'Anotaciones: ' },
      { key: 'createdAt', type: 'text', label: 'Creada: ' },
    ],
  };
}

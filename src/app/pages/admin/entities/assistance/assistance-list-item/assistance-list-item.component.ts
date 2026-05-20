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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-assistance-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './assistance-list-item.component.html',
  styleUrl: './assistance-list-item.component.scss',
})
export class AssistanceListItemComponent {
  private readonly assistanceService = inject(AssistanceService);
  private readonly translate = inject(TranslateService);

  @Input({ required: true }) assistance!: Assistance;

  readonly assistanceConfig: ListItemConfig<
    Assistance,
    AssistanceUpdatePayload,
    AssistanceUpdateResponse,
    AssistanceDeleteResponse
  > = {
    fields: [
      {
        key: 'session',
        label: this.translate.instant('lists.assistances.fields.session'),
        order: 1,
        format: (s: { date?: string }) => (s?.date ? s.date.split('T')[0] : '—'),
      },
      {
        key: 'studentEnrollment',
        label: this.translate.instant('lists.assistances.fields.enrollment'),
        order: 2,
        format: (e: { id?: number; student?: { name?: string; surname?: string } }) => {
          if (e?.student) {
            return [e.student.name, e.student.surname].filter(Boolean).join(' ');
          }
          return e?.id != null
            ? this.translate.instant('adminPages.assistance.enrollmentFallback', { id: e.id })
            : '—';
        },
      },
      {
        key: 'status',
        order: 3,
        format: (s: AssistanceStatus) => this.getStatusLabel(s),
      },
    ],
    actions: { edit: true, delete: true, detail: true },
    layout: { responsive: false },
    editFields: [
      {
        name: 'status',
        label: this.translate.instant('lists.assistances.fields.status'),
        fieldType: 'select',
        validators: [Validators.required],
        options: Object.values(AssistanceStatus).map((s) => ({
          value: s,
          label: this.getStatusLabel(s),
        })),
      },
    ],
    entityType: this.translate.instant('entities.assistance.singular'),
    entityNameFormat: (a: Assistance) =>
      `Asistencia ${a.session?.date?.split('T')[0] ?? a.id}`,
    getByIdFn: (id: number) => this.assistanceService.getAssistanceById(id),
    updateFn: (data: AssistanceUpdatePayload) => this.assistanceService.updateAssistance(data),
    deleteFn: (id: number) => this.assistanceService.deleteAssistance(id),
  };

  readonly assistanceDetailConfig: ViewDetailConfig<Assistance> = {
    fields: [
      {
        key: 'status',
        type: 'text',
        label: this.translate.instant('lists.assistances.fields.status'),
        format: (s: AssistanceStatus) => this.getStatusLabel(s) ?? String(s),
      },
      {
        key: 'session.date',
        type: 'text',
        label: this.translate.instant('lists.assistances.fields.session'),
      },
      {
        key: 'studentEnrollment.id',
        type: 'text',
        label: this.translate.instant('adminPages.assistance.enrollmentId'),
      },
    ],
  };

  private getStatusLabel(status: AssistanceStatus): string {
    const keyByStatus: Record<AssistanceStatus, string> = {
      [AssistanceStatus.PRESENT]: 'teacherPages.attendance.status.present',
      [AssistanceStatus.ABSENT]: 'teacherPages.attendance.status.absent',
      [AssistanceStatus.LATE]: 'teacherPages.attendance.status.late',
      [AssistanceStatus.EXCUSED]: 'teacherPages.attendance.status.excused',
    };
    return this.translate.instant(keyByStatus[status] ?? status);
  }
}

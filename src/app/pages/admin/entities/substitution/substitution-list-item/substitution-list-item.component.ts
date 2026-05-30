import { Component, inject, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  AssignmentSubstitution,
  SubstitutionTeacherAssignment,
  SubstitutionTeacherRef,
} from '../../../../../core/models/assignment-substitution';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { AssignmentSubstitutionsService } from '../../../../../core/services/admin/entities/assignment-substitutions.service';
import { GenericListItemComponent } from '../../../generic-list-item/generic-list-item.component';

/** Fila del listado admin de sustituciones (`app-generic-list-item`, patrón CRUD admin). */
@Component({
  selector: 'app-substitution-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './substitution-list-item.component.html',
  styleUrl: './substitution-list-item.component.scss',
})
export class SubstitutionListItemComponent {
  private readonly substitutionService = inject(AssignmentSubstitutionsService);
  private readonly translate = inject(TranslateService);

  @Input({ required: true }) substitution!: AssignmentSubstitution;

  readonly substitutionConfig: ListItemConfig<
    AssignmentSubstitution,
    never,
    never,
    never
  > = {
    fields: [
      {
        key: 'teacherAssignment.teacher',
        label: this.translate.instant('lists.substitutions.colTitular'),
        order: 1,
        className: 'font-semibold text-purple-700 dark:text-purple-300',
        format: (t: SubstitutionTeacherRef | '') => this.teacherName(t),
      },
      {
        key: 'substitute',
        label: this.translate.instant('lists.substitutions.colSubstitute'),
        order: 2,
        format: (t: SubstitutionTeacherRef | '') => this.teacherName(t),
      },
      {
        key: 'teacherAssignment',
        label: this.translate.instant('lists.substitutions.colClass'),
        order: 3,
        format: (a: SubstitutionTeacherAssignment | '') => this.classLabel(a),
      },
      {
        key: 'startDate',
        label: this.translate.instant('lists.substitutions.colStart'),
        order: 4,
        format: (d: string | null) => this.formatDate(d),
      },
      {
        key: 'endDate',
        label: this.translate.instant('lists.substitutions.colEnd'),
        order: 5,
        format: (d: string | null) => this.formatEndWithStatus(d),
      },
    ],
    actions: { edit: false, delete: false, detail: true },
    layout: { responsive: false },
    entityType: this.translate.instant('lists.substitutions.entityType'),
    entityNameFormat: (s) => this.rowTitle(s),
    getByIdFn: (id) => this.substitutionService.getById(id),
  };

  readonly substitutionDetailConfig: ViewDetailConfig<AssignmentSubstitution> = {
    fields: [
      {
        key: 'teacherAssignment.teacher',
        type: 'text',
        label: this.translate.instant('lists.substitutions.colTitular') + ': ',
        format: (t: SubstitutionTeacherRef) => this.teacherName(t),
      },
      {
        key: 'substitute',
        type: 'text',
        label: this.translate.instant('lists.substitutions.colSubstitute') + ': ',
        format: (t: SubstitutionTeacherRef) => this.teacherName(t),
      },
      {
        key: 'teacherAssignment',
        type: 'text',
        label: this.translate.instant('lists.substitutions.colClass') + ': ',
        format: (a: SubstitutionTeacherAssignment) => this.classLabel(a),
      },
      {
        key: 'startDate',
        type: 'text',
        label: this.translate.instant('lists.substitutions.colStart') + ': ',
        format: (d: string | null) => this.formatDate(d),
      },
      {
        key: 'endDate',
        type: 'text',
        label: this.translate.instant('lists.substitutions.colEnd') + ': ',
        format: (d: string | null) => this.formatDate(d),
      },
      {
        key: 'notes',
        type: 'text',
        label: this.translate.instant('lists.substitutions.notes') + ': ',
        format: (n: string | null) => n?.trim() || '—',
      },
      {
        key: 'createdAt',
        type: 'text',
        label: 'Creado: ',
        format: (d: string) => this.formatDate(d),
      },
    ],
  };

  private teacherName(teacher?: SubstitutionTeacherRef | '' | null): string {
    if (!teacher || typeof teacher !== 'object' || !teacher.name) {
      return '—';
    }
    return `${teacher.name} ${teacher.surname ?? ''}`.trim();
  }

  private classLabel(assignment?: SubstitutionTeacherAssignment | '' | null): string {
    if (!assignment || typeof assignment !== 'object') {
      return '—';
    }
    const grade = assignment.subject?.grade ?? '';
    const gradeLabel = /^\d+$/.test(grade) ? `${grade}º` : grade || '—';
    const subject = assignment.subject?.name ?? '—';
    const group = assignment.group?.name ?? '—';
    const course = assignment.subject?.course?.name ?? '—';
    return `${gradeLabel} · ${subject} · ${group} · ${course}`;
  }

  private formatDate(value: string | null | undefined): string {
    if (!value) {
      return '—';
    }
    return value.split('T')[0];
  }

  private formatEndWithStatus(endDate: string | null): string {
    const date = this.formatDate(endDate);
    const status =
      endDate == null
        ? this.translate.instant('lists.substitutions.badgeActive')
        : this.translate.instant('lists.substitutions.badgeClosed');
    return endDate == null ? status : `${date} · ${status}`;
  }

  private rowTitle(s: AssignmentSubstitution): string {
    const titular = this.teacherName(s.teacherAssignment?.teacher);
    const sub = this.teacherName(s.substitute);
    return `${titular} → ${sub}`;
  }
}

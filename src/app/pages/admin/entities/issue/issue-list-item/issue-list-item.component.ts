import { Component, inject, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import {
  Issue,
  IssueAudience,
  IssueDeleteResponse,
  IssueUpdateResponse,
} from '../../../../../core/models/issue';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { AuthService } from '../../../../../core/services/auth.service';
import {
  AdminIssueService,
  IssueUpdatePayload,
} from '../../../../../core/services/admin/entities/issue.service';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { GenericListItemComponent } from '../../../generic-list-item/generic-list-item.component';

const AUDIENCE_LABELS: Record<IssueAudience, string> = {
  CENTER: 'Todo el centro',
  ALL_TEACHERS: 'Todos los profesores',
  ALL_STUDENTS: 'Todos los alumnos',
  GROUP: 'Grupo (turno)',
  COURSE: 'Ciclo y/o curso',
  SUBJECT_GROUP: 'Ciclo, curso, grupo y/o asignatura',
  TEACHER: 'Profesor',
  ASSIGNMENT: 'Asignación docente concreta',
  TARGETED: 'Audiencia acotada',
};

const AUDIENCE_OPTIONS = (Object.keys(AUDIENCE_LABELS) as IssueAudience[]).map((value) => ({
  value,
  label: AUDIENCE_LABELS[value],
}));

/**
 * Fila de anuncio en el listado admin (patrón task-list-item).
 */
@Component({
  selector: 'app-issue-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './issue-list-item.component.html',
  styleUrl: './issue-list-item.component.scss',
})
export class IssueListItemComponent {
  private readonly issueService = inject(AdminIssueService);
  private readonly authService = inject(AuthService);
  private readonly groupService = inject(GroupService);
  private readonly courseService = inject(CourseService);
  private readonly subjectService = inject(SubjectService);

  @Input({ required: true }) issue!: Issue;

  private readonly baseConfig: Omit<
    ListItemConfig<Issue, IssueUpdatePayload, IssueUpdateResponse, IssueDeleteResponse>,
    'actions'
  > = {
    fields: [
      { key: 'title', className: 'font-medium', order: 1 },
      {
        key: 'audience',
        label: 'Audiencia',
        order: 2,
        format: (value: IssueAudience) => AUDIENCE_LABELS[value] ?? value,
      },
      {
        key: 'isPublished',
        label: 'Publicado',
        order: 3,
        format: (value: boolean) => (value ? 'Sí' : 'No'),
      },
      {
        key: 'createdAt',
        label: 'Creado',
        order: 4,
        format: (value: string) => (value ? value.split('T')[0] : '—'),
      },
    ],
    layout: { responsive: false },
    editFields: [
      {
        name: 'title',
        label: 'Título',
        type: 'text',
        validators: [Validators.required, Validators.maxLength(120)],
        errorMessage: 'El título es obligatorio',
      },
      {
        name: 'body',
        label: 'Cuerpo',
        type: 'text',
        validators: [Validators.required, Validators.maxLength(2000)],
        errorMessage: 'El cuerpo es obligatorio',
      },
      {
        name: 'audience',
        label: 'Audiencia',
        fieldType: 'select',
        validators: [Validators.required],
        options: AUDIENCE_OPTIONS,
      },
      {
        name: 'idGroup',
        label: 'Grupo',
        fieldType: 'select',
        optionsObservable: this.groupService.getAllGroups().pipe(
          map((res) => (res.success ? res.data : [])),
        ),
        optionValueKey: 'id',
        optionLabelKey: 'name',
      },
      {
        name: 'idCourse',
        label: 'Ciclo',
        fieldType: 'select',
        optionsObservable: this.courseService.getAllCourses().pipe(
          map((res) => (res.success ? res.data : [])),
        ),
        optionValueKey: 'id',
        optionLabelKey: 'name',
      },
      {
        name: 'idSubject',
        label: 'Asignatura',
        fieldType: 'select',
        optionsObservable: this.subjectService.getAllSubjects().pipe(
          map((res) => (res.success ? res.data : [])),
        ),
        optionValueKey: 'id',
        optionLabelKey: 'name',
      },
      {
        name: 'attachmentUrl',
        label: 'URL adjunto',
        type: 'text',
      },
      {
        name: 'isPublished',
        label: 'Publicado',
        fieldType: 'select',
        options: [
          { value: true, label: 'Sí' },
          { value: false, label: 'No' },
        ],
      },
      {
        name: 'publishAt',
        label: 'Publicación',
        type: 'date',
      },
      {
        name: 'expiresAt',
        label: 'Expiración',
        type: 'date',
      },
    ],
    entityType: 'el anuncio',
    entityNameFormat: (i: Issue) => i.title,
    getByIdFn: (id: number) => this.issueService.getIssueById(id),
    updateFn: (data: IssueUpdatePayload) => this.issueService.updateIssue(data),
    deleteFn: (id: number) => this.issueService.deleteIssue(id),
  };

  readonly issueDetailConfig: ViewDetailConfig<Issue> = {
    fields: [
      { key: 'title', type: 'text', label: 'Título: ', className: 'text-xl font-bold' },
      { key: 'body', type: 'text', label: 'Cuerpo: ' },
      {
        key: 'audience',
        type: 'text',
        label: 'Audiencia: ',
        format: (value: IssueAudience) => AUDIENCE_LABELS[value] ?? String(value),
      },
      {
        key: 'emitterType',
        type: 'text',
        label: 'Tipo emisor: ',
        format: (value: string) => (value === 'ADMIN' ? 'Administración' : 'Profesor'),
      },
      { key: 'emitterId', type: 'text', label: 'ID emisor: ' },
      {
        key: 'isPublished',
        type: 'text',
        label: 'Publicado: ',
        format: (value: boolean) => (value ? 'Sí' : 'No'),
      },
      { key: 'attachmentUrl', type: 'text', label: 'Adjunto: ' },
      { key: 'publishAt', type: 'text', label: 'Publicación: ' },
      { key: 'expiresAt', type: 'text', label: 'Expiración: ' },
      { key: 'createdAt', type: 'text', label: 'Creado: ' },
    ],
  };

  get issueConfig(): ListItemConfig<
    Issue,
    IssueUpdatePayload,
    IssueUpdateResponse,
    IssueDeleteResponse
  > {
    const canManage = this.canManage();
    return {
      ...this.baseConfig,
      actions: { edit: canManage, delete: canManage, detail: true },
    };
  }

  private canManage(): boolean {
    const role = this.authService.getUserRole();
    const userId = this.authService.getUserId();
    if (!role || userId == null) {
      return false;
    }
    if (role === 'ADMIN') {
      return true;
    }
    if (role === 'TEACHER' && this.issue.emitterType === 'TEACHER') {
      return this.issue.emitterId === userId;
    }
    return false;
  }
}

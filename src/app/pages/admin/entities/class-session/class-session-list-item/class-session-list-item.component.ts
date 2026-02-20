import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import { ClassSession, ClassSessionUpdateRequest } from '../../../../../core/models/class-sessions';
import { ClassSessionServiceService } from '../../../../../core/services/admin/entities/class-session-service.service';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';

@Component({
  selector: 'app-class-session-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './class-session-list-item.component.html',
  styleUrl: './class-session-list-item.component.scss'
})
export class ClassSessionListItemComponent {

  @Input() classSession!: ClassSession;
  @Output() sessionUpdated = new EventEmitter<ClassSessionUpdateRequest>();
  @Output() sessionDeleted = new EventEmitter<number>();

  constructor(
    private classSessionService: ClassSessionServiceService
  ) {}

  // ✅ Getter que se evalúa cada vez que se accede
  get subjectConfig(): ListItemConfig<ClassSession> {
    return {
      fields: [
        { 
          key: 'name',
          className: 'font-medium'
        }
      ],
      actions: {
        edit: true,
        delete: true,
        detail: true
      },
      layout: {
        responsive: false
      },
      editFields: [
        {
          name: 'date',
          label: 'Fecha',
          type: 'text',
          placeholder: 'Nombre de la asignatura',
          validators: [Validators.required],
          errorMessage: 'La fecha es requerida'
        },
        {
          name: 'idCourse',
          label: 'Ciclo',
          fieldType: 'select',
          placeholder: 'Selecciona un ciclo',
          validators: [Validators.required],
          errorMessage: 'Debes seleccionar un ciclo',
          optionsObservable: this.classSessionService.getAllSessions().pipe(
            map(res => res.data)
          ),
          optionValueKey: 'id',
          optionLabelKey: 'name'
        }
      ],
      entityType: 'la Sesión',
      entityNameFormat: (classSession: ClassSession) => classSession.date,
      getByIdFn: (id: number) => this.classSessionService.getSubjectbyId(id),
      updateFn: (data: any) => this.classSessionService.updateSubject(data.id, data),
      deleteFn: (id: number) => this.classSessionService.deleteSubject(id)
    };
  }

  subjectDetailConfig: ViewDetailConfig<ClassSession> = {
        fields: [
          {
            key: 'id',
            type: 'text',
            format: (value) => `${value}`,
            className: 'text-xl font-bold',
            label: 'Id de la Sesión:'
          },
          {
            key: 'date',
            type: 'text',
            format: (value) => `${value}`,
            className: 'text-xl font-bold',
            label: 'Fecha: '
          },
          {
            key: 'schedule.id',
            type: 'text',
            format: (value) => `${value}`,
            className: 'text-xl font-bold',
            label: 'Horario:'
          }
      ]
      };
}

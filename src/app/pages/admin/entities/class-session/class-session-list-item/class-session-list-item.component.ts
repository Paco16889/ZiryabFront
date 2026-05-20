import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import {
  ClassSession,
  ClassSessionDeleteResponse,
  ClassSessionUpdateRequest,
  ClassSessionUpdateResponse,
} from '../../../../../core/models/class-sessions';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';

/**
 * Componente que representa un elemento del listado de sesiones de clase.
 * Configura los campos a mostrar, las acciones disponibles y la vista de detalle
 * para el componente genérico GenericListItemComponent.
 * ATENCIÓN: varios nombres de métodos y propiedades hacen referencia a Subject
 * en lugar de ClassSession, pendiente de corregir.
 */
@Component({
  selector: 'app-class-session-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './class-session-list-item.component.html',
  styleUrl: './class-session-list-item.component.scss'
})
export class ClassSessionListItemComponent {

   /**
   * Sesión de clase a mostrar en el elemento de lista.
   */
  @Input() classSession!: ClassSession;

    /**
   * Evento emitido cuando la sesión ha sido actualizada.
   */
  @Output() sessionUpdated = new EventEmitter<ClassSessionUpdateRequest>();

  /**
   * Evento emitido cuando la sesión ha sido eliminada, incluye su identificador.
   */
  @Output() sessionDeleted = new EventEmitter<number>();


   /**
   * @param classSessionService - Servicio que gestiona las operaciones con sesiones de clase,
   * usado para las funciones getByIdFn, updateFn y deleteFn de la configuración
   */
  constructor(
    private classSessionService: ClassSessionService
  ) {}

  
  /**
   * Configuración del elemento de lista de la sesión de clase.
   * Definida como getter para garantizar que las referencias a this sean correctas.
   * ATENCIÓN: el getter está mal nombrado como subjectConfig, el HTML lo referencia
   * como classSessionConfig por lo que el componente está roto, pendiente de corregir.
   * ATENCIÓN: los editFields y métodos del servicio están copiados de AsignaturaListItemComponent
   * y no corresponden a ClassSession, pendiente de corregir.
   */
  get classSessionConfig(): ListItemConfig<
    ClassSession,
    ClassSessionUpdateRequest,
    ClassSessionUpdateResponse,
    ClassSessionDeleteResponse
  > {
    return {
      fields: [
        {
          key: 'date',
          className: 'font-medium',
        },
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
      getByIdFn: (id: number) => this.classSessionService.getSessionById(id),
      updateFn: (data: any) => this.classSessionService.updateSession(data.id, data),
      deleteFn: (id: number) => this.classSessionService.deleteSession(id)
    };
  }

    /**
   * Configuración de la vista de detalle de la sesión de clase.
   * Muestra el identificador, la fecha y el horario asociado.
   * ATENCIÓN: mal nombrada como subjectDetailConfig, debería ser classSessionDetailConfig.
   */
  classSessionDetailConfig: ViewDetailConfig<ClassSession> = {
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

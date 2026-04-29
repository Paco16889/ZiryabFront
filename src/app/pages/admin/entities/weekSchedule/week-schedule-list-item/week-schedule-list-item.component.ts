import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WeekSchedule, WeekScheduleUpdateRequest } from '../../../../../core/models/week-schedule';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { WeekScheduleService } from '../../../../../core/services/admin/entities/week-schedule.service';
import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";

/**
 * Componente que representa un elemento del listado de franjas horarias semanales.
 * Configura los campos a mostrar y la vista de detalle para el componente genérico
 * GenericListItemComponent. Las acciones de edición y eliminación están deshabilitadas
 * ya que su gestión está pendiente de implementación.
 */
@Component({
  selector: 'app-week-schedule-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './week-schedule-list-item.component.html',
  styleUrl: './week-schedule-list-item.component.scss'
})
export class WeekScheduleListItemComponent {


  /**
   * Franja horaria semanal a mostrar en el elemento de lista.
   */
    @Input() schedule!: WeekSchedule;

     /**
   * Evento emitido cuando la franja horaria ha sido actualizada.
   */
  @Output() scheduleUpdated = new EventEmitter<WeekScheduleUpdateRequest>();

   /**
   * Evento emitido cuando la franja horaria ha sido eliminada, incluye su identificador.
   */
  @Output() scheduleDeleted = new EventEmitter<number>();

   /**
   * Evento emitido cuando la franja horaria ha sido eliminada, incluye su identificador.
   */
  constructor(
    private weekScheduleService: WeekScheduleService
  ){

  }

   /**
   * Configuración del elemento de lista de la franja horaria semanal.
   * Definida como getter para garantizar que las referencias a this sean correctas.
   * Solo muestra el detalle, las acciones de edición y eliminación están deshabilitadas.
   * ATENCIÓN: los editFields están copiados de AsignaturaListItemComponent y no corresponden
   * a WeekSchedule, pendiente de corregir cuando se implementen las acciones de edición.
   */
  get scheduleConfig(): ListItemConfig<WeekSchedule> {
    return {
      fields: [
        { 
          key: 'weekDay',
          className: 'font-medium',
          order: 1
        },
        {
          key: 'startTime',
          className: 'font-medium',
          order: 2
        }
      ],
      actions: {
        edit: false,
        delete: false,
        detail: true
      },
      layout: {
        responsive: false
      },
      editFields: [
        {
          name: 'name',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Nombre de la asignatura',
          validators: [Validators.required],
          errorMessage: 'El nombre es requerido'
        },
        {
          name: 'idCourse',
          label: 'Ciclo',
          fieldType: 'select',
          placeholder: 'Selecciona un ciclo',
          validators: [Validators.required],
          errorMessage: 'Debes seleccionar un ciclo',
          optionsObservable: this.weekScheduleService.getAllSchedules().pipe(
            map(res => res.data)
          ),
          optionValueKey: 'id',
          optionLabelKey: 'name'
        }
      ],
      entityType: 'El Horario Semanal',
      entityNameFormat: (schedule: WeekSchedule) => schedule.startTime,
      getByIdFn: (id: number) => this.weekScheduleService.getWeekSchedulebyId(id),
      updateFn: (data: any) => this.weekScheduleService.updateSchedule(data.id, data),
      deleteFn: (id: number) => this.weekScheduleService.deleteSchedule(id)
    };
  }

    /**
   * Configuración de la vista de detalle de la franja horaria semanal.
   * Muestra el día de la semana, hora de inicio y hora de finalización.
   */
   scheduleDetailConfig: ViewDetailConfig<WeekSchedule> = {
          fields: [
            {
              key: 'weekDay',
              type: 'text',
              format: (value) => `${value}`,
              className: 'text-xl font-bold',
              label: 'Día de la semana:'
            },
            {
              key: 'startTime',
              type: 'text',
              format: (value) => `${value}`,
              className: 'text-xl font-bold',
              label: 'Hora de Inicio: '
            },
            {
              key: 'finishTime',
              type: 'text',
              format: (value) => `${value}`,
              className: 'text-xl font-bold',
              label: 'Hora de Finalización:'
            }
        ]
        };
        
}

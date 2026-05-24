import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WeekSchedule, WeekScheduleDeleteResponse, WeekScheduleUpdateRequest, WeekScheduleUpdateResponse } from '../../../../../core/models/week-schedule';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { Validators } from '@angular/forms';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { WeekScheduleService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule.service';
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

  /** Servicio CRUD usado por el item genérico para detalle, edición y borrado. */
  private readonly weekScheduleService = inject(WeekScheduleService);

  /** Traduce campos visibles del listado y opciones de edición. */
  private readonly translate = inject(TranslateService);

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

  /** Traduce un número de día al literal usado por el builder (`weekScheduleBuilder.days.*`). */
  private dayLabel(day: number): string {
    return this.translate.instant(`weekScheduleBuilder.days.${day}`);
  }

  /**
   * Configuración del elemento de lista de la franja horaria semanal.
   * Definida como getter para garantizar que las referencias a this sean correctas.
   * Solo muestra el detalle, las acciones de edición y eliminación están deshabilitadas.
   * ATENCIÓN: los editFields están copiados de AsignaturaListItemComponent y no corresponden
   * a WeekSchedule, pendiente de corregir cuando se implementen las acciones de edición.
   */
  get scheduleConfig(): ListItemConfig<WeekSchedule, WeekScheduleUpdateRequest, WeekScheduleUpdateResponse, WeekScheduleDeleteResponse> {
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
          name: 'weekDay',
          label: this.translate.instant('weekScheduleBuilder.weekDay'),
          fieldType: 'select',
          placeholder: this.translate.instant('common.placeholders.selectOption'),
          validators: [Validators.required],
          errorMessage: this.translate.instant('common.validation.required'),
          options: [1, 2, 3, 4, 5, 6, 7].map((value) => ({
            label: this.dayLabel(value),
            value,
          })),
          optionValueKey: 'value',
          optionLabelKey: 'label'
        },
        {
          name: 'startTime',
          label: this.translate.instant('weekScheduleBuilder.startTime'),
          type: 'time',
          placeholder: 'Ej: 09:00',
          validators: [Validators.required],
          errorMessage: this.translate.instant('common.validation.required')
        },
        {
          name: 'finishTime',
          label: this.translate.instant('weekScheduleBuilder.endTime'),
          type: 'time',
          placeholder: 'Ej: 10:00',
          validators: [Validators.required],
          errorMessage: this.translate.instant('common.validation.required')
        }
      ],
      entityType: 'El Horario Semanal',
      entityNameFormat: (schedule: WeekSchedule) => schedule.startTime,
      getByIdFn: (id: number) => this.weekScheduleService.getWeekSchedulebyId(id),
      updateFn: (data: WeekScheduleUpdateRequest) => this.weekScheduleService.updateSchedule(data.id, data),
      deleteFn: (id: number) => this.weekScheduleService.deleteSchedule(id)
    };
  }

  /**
   * Configuración de la vista de detalle de la franja horaria semanal.
   * Muestra el día de la semana, hora de inicio y hora de finalización.
   */
  get scheduleDetailConfig(): ViewDetailConfig<WeekSchedule> {
    return {
      fields: [
        {
          key: 'weekDay',
          type: 'text',
          format: (value: string) => `${value}`,
          className: 'text-xl font-bold',
          label: this.translate.instant('weekScheduleBuilder.weekDay') + ':'
        },
        {
          key: 'startTime',
          type: 'text',
          format: (value: string) => `${value}`,
          className: 'text-xl font-bold',
          label: this.translate.instant('weekScheduleBuilder.startTime') + ': '
        },
        {
          key: 'finishTime',
          type: 'text',
          format: (value: string) => `${value}`,
          className: 'text-xl font-bold',
          label: this.translate.instant('weekScheduleBuilder.endTime') + ':'
        }
      ]
    };
  }
}

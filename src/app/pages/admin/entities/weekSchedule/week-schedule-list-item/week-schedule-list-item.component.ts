import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WeekSchedule, WeekScheduleUpdateRequest } from '../../../../../core/models/week-schedule';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { WeekScheduleServiceService } from '../../../../../core/services/admin/entities/week-schedule-service.service';
import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";

@Component({
  selector: 'app-week-schedule-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './week-schedule-list-item.component.html',
  styleUrl: './week-schedule-list-item.component.scss'
})
export class WeekScheduleListItemComponent {
    @Input() schedule!: WeekSchedule;
  @Output() scheduleUpdated = new EventEmitter<WeekScheduleUpdateRequest>();
  @Output() scheduleDeleted = new EventEmitter<number>();

  constructor(
    private weekScheduleService: WeekScheduleServiceService
  ){

  }

  // ✅ Getter que se evalúa cada vez que se accede
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

import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { WeekSchedule, WeekScheduleUpdateRequest } from '../../../../../core/models/week-schedule';
import { WeekScheduleServiceService } from '../../../../../core/services/admin/entities/week-schedule-service.service';
import { ModalEditServiceService } from '../../../../../core/services/UI/modal-edit-service.service';
import { ModalDeleteServiceService } from '../../../../../core/services/UI/modal-delete-service.service';
import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";
import { WeekScheduleListItemComponent } from "../week-schedule-list-item/week-schedule-list-item.component";

@Component({
  selector: 'app-week-schedule-list',
  imports: [BotonCreateComponent, WeekScheduleListItemComponent],
  templateUrl: './week-schedule-list.component.html',
  styleUrl: './week-schedule-list.component.scss'
})
export class WeekScheduleListComponent {



   schedules: WeekSchedule[] = []

  showCreateForm = false;
  constructor(private weekScheduleService: WeekScheduleServiceService,
    private modalUpdateService: ModalEditServiceService,
    private modalDeleteService: ModalDeleteServiceService) {

      effect(() => {this.schedules = weekScheduleService.schedules()
          console.log('📦 Schedules actualizados:', this.schedules);
      console.log('📦 Cantidad:', this.schedules.length);
      })
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.modalUpdateService.modalState();
     

      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.weekScheduleService.loadSchedules();
      }

      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.weekScheduleService.loadSchedules();
      }
    });
  }

  ngOnInit(): void {
    this.weekScheduleService.loadSchedules();
  }




  openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onScheduleCreated() {
    this.closeCreateForm();
    this.weekScheduleService.loadSchedules();
  }


}

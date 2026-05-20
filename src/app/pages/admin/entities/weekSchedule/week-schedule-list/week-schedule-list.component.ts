import { Component, effect, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WeekSchedule, WeekScheduleUpdateRequest } from '../../../../../core/models/week-schedule';
import { WeekScheduleService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";
import { WeekScheduleListItemComponent } from "../week-schedule-list-item/week-schedule-list-item.component";
import { TranslateModule } from '@ngx-translate/core';
import { WeekScheduleBuilderComponent } from '../week-schedule-builder/week-schedule-builder.component';

/**
 * Componente que muestra el listado de franjas horarias semanales del sistema.
 * Gestiona la visualización del listado, la apertura del constructor de creación
 * y la recarga automática de la lista tras operaciones de eliminación, actualización o alta.
 */
@Component({
  selector: 'app-week-schedule-list',
  imports: [BotonCreateComponent, WeekScheduleListItemComponent, TranslateModule, WeekScheduleBuilderComponent],
  templateUrl: './week-schedule-list.component.html',
  styleUrl: './week-schedule-list.component.scss'
})
export class WeekScheduleListComponent implements OnInit {


  /**
   * Listado de franjas horarias semanales a mostrar, sincronizado con la signal del servicio.
   */
   schedules: WeekSchedule[] = []

     /**
   * Controla la visibilidad del formulario de creación de franjas horarias.
   */
  showCreateForm = false;

    /**
   * @param weekScheduleService - Servicio que gestiona las operaciones con franjas horarias
   * @param modalUpdateService - Servicio del modal de edición, usado para detectar
   * cuando una actualización se completa y recargar la lista
   * @param modalDeleteService - Servicio del modal de eliminación, usado para detectar
   * cuando una eliminación se completa y recargar la lista
   */
  constructor(private weekScheduleService: WeekScheduleService,
    private modalUpdateService: ModalEditService,
    private modalDeleteService: ModalDeleteService) {

      effect(() => {
        this.schedules = this.weekScheduleService.schedules();
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

  /**
   * Carga el listado de franjas horarias al inicializar el componente.
   */
  ngOnInit(): void {
    this.weekScheduleService.loadSchedules();
  }



/**
   * Muestra el formulario de creación de franjas horarias.
   */
  openCreateForm() {
    this.showCreateForm = true;
  }

   /**
   * Oculta el formulario de creación de franjas horarias.
   */
  closeCreateForm() {
    this.showCreateForm = false;
  }
  
  /**
   * Cierra el formulario de creación y recarga el listado de franjas horarias.
   * Se llama cuando el formulario de creación notifica que se ha creado una franja horaria.
   */
  onScheduleCreated() {
    this.closeCreateForm();
    this.weekScheduleService.loadSchedules();
  }


}

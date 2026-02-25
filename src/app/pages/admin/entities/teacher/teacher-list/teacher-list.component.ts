import { Component, effect } from '@angular/core';
import { Teacher, TeacherUpdateResponse } from '../../../../../core/models/teacher';
import { TeachersServiceService } from '../../../../../core/services/admin/entities/teachers-service.service';
import { TeacherListItemComponent } from '../teacher-list-item/teacher-list-item.component';
import { TeacherCreateFormComponent } from '../teacher-create-form/teacher-create-form.component';
import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteServiceService } from '../../../../../core/services/UI/modal-delete-service.service';
import { ModalEditServiceService } from '../../../../../core/services/UI/modal-edit-service.service';


/**
 * Componente que muestra el listado de profesores del sistema.
 * Gestiona la visualización del listado, la apertura del formulario de creación
 * y la recarga automática de la lista tras operaciones de eliminación o actualización.
 */
@Component({
  selector: 'app-teacher-list',
  imports: [TeacherListItemComponent, TeacherCreateFormComponent, BotonCreateComponent, TranslateModule],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss'
})
export class TeacherListComponent {

    /**
   * Listado de profesores a mostrar, sincronizado con la signal del servicio.
   */
    teachers: Teacher[] = [];

      /**
   * Controla la visibilidad del formulario de creación de profesores.
   */
    showCreateForm = false;

      /**
   * @param teacherService - Servicio que gestiona las operaciones con profesores
   * @param modalDeleteService - Servicio del modal de eliminación, usado para detectar
   * cuando una eliminación se completa y recargar la lista
   * @param updateModalService - Servicio del modal de edición, usado para detectar
   * cuando una actualización se completa y recargar la lista
   */
    constructor(private teacherService: TeachersServiceService,
      private modalDeleteService: ModalDeleteServiceService,
      private updateModalService: ModalEditServiceService
    ){
      effect(() => {
        this.teachers = teacherService.teachers();
      })//actualizar lista despues de editar falta
      effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.updateModalService.modalState();
      
      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.teacherService.loadTeachers();
      }
      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.teacherService.loadTeachers();
      }
    });
      
    }
    
    /**
   * Carga el listado de profesores al inicializar el componente.
   */
  ngOnInit() {
    this.teacherService.loadTeachers();
  }
  
  
 /**
   * Muestra el formulario de creación de profesores.
   */
  openCreateForm() {
    this.showCreateForm = true;
  }

   /**
   * Oculta el formulario de creación de profesores.
   */
  closeCreateForm() {
    this.showCreateForm = false;
  }

   /**
   * Cierra el formulario de creación y recarga el listado de profesores.
   * Se llama cuando el formulario de creación notifica que se ha creado un profesor.
   */
  onTeacherCreated() {
    this.closeCreateForm();
    this.teacherService.loadTeachers();
  }

  

}

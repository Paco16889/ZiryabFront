import { Component, effect, OnInit } from '@angular/core';
import { CourseListItemComponent } from '../course-list-item/course-list-item.component';
import { Course, CourseByIdResponse } from '../../../../../core/models/course';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { CourseCreateFormComponent } from '../course-create-form/course-create-form.component';
import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que muestra el listado de ciclos académicos del sistema.
 * Gestiona la visualización del listado, la apertura del formulario de creación
 * y la recarga automática de la lista tras operaciones de eliminación o actualización.
 */
@Component({
  selector: 'app-course-list',
  imports: [CourseListItemComponent, CourseCreateFormComponent, BotonCreateComponent, TranslateModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {

    /**
   * Listado de ciclos académicos a mostrar, sincronizado con la signal del servicio.
   */
    courses: Course[] = [];
    
 /**
   * Controla la visibilidad del formulario de creación de ciclos académicos.
   */
  showCreateForm = false;  

   /**
   * @param courseService - Servicio que gestiona las operaciones con ciclos académicos
   * @param modalDeleteService - Servicio del modal de eliminación, usado para detectar
   * cuando una eliminación se completa y recargar la lista
   * @param modalUpdateService - Servicio del modal de edición, usado para detectar
   * cuando una actualización se completa y recargar la lista.
   */
      constructor(private courseService: CourseService,
        private modalDeleteService: ModalDeleteService,
        private modalUpdateService: ModalEditService)
      {
        effect(() => {
          this.courses = this.courseService.courses();
        })
        effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.modalUpdateService.modalState();
      
    
      
      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.courseService.loadCourses();
      }

      if(!updateModalState.isOpen && updateModalState.showSuccess) {
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.courseService.loadCourses();
      }
    });
      }
    
       /**
   * Carga el listado de ciclos académicos al inicializar el componente.
   */
      ngOnInit():void {

        this.courseService.loadCourses();
       
      }
     



  
/**
   * Muestra el formulario de creación de ciclos académicos.
   */
  openCreateForm() {
    this.showCreateForm = true;
  }


  /**
   * Oculta el formulario de creación de ciclos académicos.
   */
  closeCreateForm() {
    this.showCreateForm = false;
  }

   /**
   * Cierra el formulario de creación y recarga el listado de ciclos académicos.
   * Se llama cuando el formulario de creación notifica que se ha creado un ciclo.
   */
  onCourseCreated() {
    this.closeCreateForm();
    this.courseService.loadCourses(); // Recarga la lista
  }

}

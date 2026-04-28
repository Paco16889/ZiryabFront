import { Component, effect, Input, OnInit } from '@angular/core';
import { StudentsService } from '../../../../../core/services/admin/entities/students.service';
import { Student } from '../../../../../core/models/student';
import { ListItemComponent } from '../list-item/list-item.component';

import { StudentEnrollmentComponent } from "../student-enrollment/student-enrollment.component";
import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";

import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';

/**
 * Componente que muestra el listado de estudiantes del sistema.
 * Gestiona la visualización del listado, la apertura del formulario de creación
 * y la recarga automática de la lista tras operaciones de eliminación o actualización.
 */
@Component({
  selector: 'app-list',
  imports: [ListItemComponent, StudentEnrollmentComponent, BotonCreateComponent, TranslateModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

  /**
   * Listado de estudiantes a mostrar, sincronizado con la signal del servicio.
   */
  students: Student[] = [];
  
 /**
   * Controla la visibilidad del formulario de creación de estudiantes.
   */
   showCreateForm = false;
   
     /**
   * @param studentService - Servicio que gestiona las operaciones con estudiantes
   * @param deleteModalService - Servicio del modal de eliminación, usado para detectar
   * cuando una eliminación se completa y recargar la lista
   * @param updateModalService - Servicio del modal de edición, usado para detectar
   * cuando una actualización se completa y recargar la lista
   */
  constructor(
    private studentService: StudentsService, 
    private deleteModalService: ModalDeleteService,
    private updateModalService: ModalEditService
  ){
    effect(() => {this.students = studentService.students()})
    //Effect que escucha cambios en el modal
    
    effect(() => {
      const deleteModalState = this.deleteModalService.modalState();
      const updateModalState = this.updateModalService.modalState();
      
      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.studentService.loadStudents();
      }

      if(!updateModalState.isOpen && updateModalState.showSuccess){
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.studentService.loadStudents();
      }
    });

  }

  /**
   * Carga el listado de estudiantes al inicializar el componente.
   */
  ngOnInit():void {
    this.studentService.loadStudents();
  }

 

   /**
   * Muestra el formulario de creación de estudiantes.
   */ 
openCreateForm() {
  this.showCreateForm = true;
}

 /**
   * Oculta el formulario de creación de estudiantes.
   */
closeCreateForm() {
  this.showCreateForm = false;
}

  /**
   * Cierra el formulario de creación y recarga el listado de estudiantes.
   * Se llama cuando el formulario de creación notifica que se ha creado un estudiante.
   */
  onStudentCreated() {
    this.closeCreateForm();
    this.studentService.loadStudents(); // Recarga la lista
  }

 

 
}

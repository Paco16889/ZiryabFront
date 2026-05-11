import { Component, effect } from '@angular/core';
import { ClassSessionListItemComponent } from "../class-session-list-item/class-session-list-item.component";
import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";
import { ClassSession } from '../../../../../core/models/class-sessions';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';

/**
 * Componente que muestra el listado de sesiones de clase del sistema.
 * Gestiona la visualización del listado, la apertura del formulario de creación
 * y la recarga automática de la lista tras operaciones de eliminación o actualización.
 * ATENCIÓN: el formulario de creación no está implementado todavía.
 */
@Component({
  selector: 'app-class-session-list',
  imports: [ClassSessionListItemComponent, BotonCreateComponent],
  templateUrl: './class-session-list.component.html',
  styleUrl: './class-session-list.component.scss'
})
export class ClassSessionListComponent {

  /**
   * Listado de sesiones de clase a mostrar, sincronizado con la signal del servicio.
   */
  classSessions: ClassSession[] = []

    /**
   * Controla la visibilidad del formulario de creación de sesiones de clase.
   */
  showCreateForm = false;

    /**
   * @param classSessionService - Servicio que gestiona las operaciones con sesiones de clase
   * @param modalUpdateService - Servicio del modal de edición, usado para detectar
   * cuando una actualización se completa y recargar la lista
   * @param modalDeleteService - Servicio del modal de eliminación, usado para detectar
   * cuando una eliminación se completa y recargar la lista
   */
  constructor(private classSessionService: ClassSessionService,
    private modalUpdateService: ModalEditService,
    private modalDeleteService: ModalDeleteService) {

      effect(() => {this.classSessions = classSessionService.classSessions()})
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.modalUpdateService.modalState();
     

      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.classSessionService.loadSessions();
      }

      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.classSessionService.loadSessions();
      }
    });
  }

    /**
   * Carga el listado de sesiones de clase al inicializar el componente.
   */
  ngOnInit(): void {
    this.classSessionService.loadSessions();
  }



/**
   * Muestra el formulario de creación de sesiones de clase.
   */
  openCreateForm() {
    this.showCreateForm = true;
  }

    /**
   * Oculta el formulario de creación de sesiones de clase.
   */
  closeCreateForm() {
    this.showCreateForm = false;
  }

   /**
   * Cierra el formulario de creación y recarga el listado de sesiones de clase.
   * ATENCIÓN: método mal nombrado, debería llamarse onSessionCreated.
   */
  onSubjectCreated() {
    this.closeCreateForm();
    this.classSessionService.loadSessions();
  }

}

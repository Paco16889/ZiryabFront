import { Component, effect } from '@angular/core';
import { GroupListItemComponent } from '../group-list-item/group-list-item.component';
import { Group } from '../../../../../core/models/group';
import { GroupServiceService } from '../../../../../core/services/admin/entities/group-service.service';
import { GroupCreateFormComponent } from '../group-create-form/group-create-form.component';
import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteServiceService } from '../../../../../core/services/UI/modal-delete-service.service';
import { ModalEditServiceService } from '../../../../../core/services/UI/modal-edit-service.service';

/**
 * Componente que muestra el listado de grupos del sistema.
 * Gestiona la visualización del listado, la apertura del formulario de creación
 * y la recarga automática de la lista tras operaciones de eliminación o actualización.
 */
@Component({
  selector: 'app-group-list',
  imports: [GroupListItemComponent, GroupCreateFormComponent, BotonCreateComponent, TranslateModule],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss'
})
export class GroupListComponent {

  /**
   * Listado de grupos a mostrar, sincronizado con la signal del servicio.
   */
  groups: Group[] = [];

  /**
   * Controla la visibilidad del formulario de creación de grupos.
   */
  showCreateForm = false;

    /**
   * @param groupService - Servicio que gestiona las operaciones con grupos
   * @param modalDeleteService - Servicio del modal de eliminación, usado para detectar
   * cuando una eliminación se completa y recargar la lista
   * @param modalUpdateService - Servicio del modal de edición, usado para detectar
   * cuando una actualización se completa y recargar la lista
   */
  constructor(private groupService: GroupServiceService,
    private modalDeleteService: ModalDeleteServiceService<unknown>,
    private modalUpdateService: ModalEditServiceService<unknown, unknown, unknown>
  ) {
    effect(() => {
      this.groups = this.groupService.groups();
    })
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();

      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.groupService.loadGroups();
      }
    });

    effect(() => {
      const updateModalState = this.modalUpdateService.modalState();

      console.log(
        'MODAL STATE Update:',
        'isOpen:', updateModalState.isOpen,
        'showSuccess:', updateModalState.showSuccess,
        'isUpdating:', updateModalState.isUpdating
      );
      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.groupService.loadGroups();
      }
    });



  }

  /**
   * Carga el listado de grupos al inicializar el componente.
   */
  ngOnInit(): void {
    this.groupService.loadGroups();
  }

 /**
   * Muestra el formulario de creación de grupos.
   */
  openCreateForm() {
    this.showCreateForm = true;
  }

   /**
   * Oculta el formulario de creación de grupos.
   */
  closeCreateForm() {
    this.showCreateForm = false;
  }

  /**
   * Cierra el formulario de creación y recarga el listado de grupos.
   * Se llama cuando el formulario de creación notifica que se ha creado un grupo.
   */
  onGroupCreated() {
    this.closeCreateForm();
    this.groupService.loadGroups();
  }

  /**
   * Recarga el listado cuando un grupo es eliminado desde el list-item.
   * @param groupId - ID del grupo eliminado
   */
  onGroupDeleted(groupId: number): void {
    this.groupService.loadGroups();
  }

  /**
   * Recarga el listado cuando un grupo es actualizado desde el list-item.
   * @param groupId - ID del grupo actualizado
   */
  onGroupUpdated(groupId: number): void {
    this.groupService.loadGroups();
  }

}

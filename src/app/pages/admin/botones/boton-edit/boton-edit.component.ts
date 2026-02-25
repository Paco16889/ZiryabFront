import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalEditServiceService } from '../../../../core/services/UI/modal-edit-service.service';
import { EditFieldConfig } from '../../../../core/configs/edit-modal-config';

/**
 * Componente que representa el botón de edición de una entidad.
 * Al pulsarlo abre el modal de edición mediante el ModalEditServiceService,
 * sin necesidad de emitir eventos al componente padre.
 */

@Component({
  selector: 'app-boton-edit',
  imports: [],
  templateUrl: './boton-edit.component.html',
  styleUrl: './boton-edit.component.scss'
})
export class BotonEditComponent {


/**
   * Identificador único de la entidad a editar.
   */
  @Input() id!: number;

  /**
   * Nombre de la entidad a mostrar en el título del modal.
   */
  @Input() name!: string;

   /**
   * Tipo de la entidad, usado en los mensajes del modal, por ejemplo 'student' o 'course'.
   */
  @Input() type!: string;

   /**
   * Datos actuales de la entidad para prerellenar el formulario de edición.
   */
  @Input() entityData : any;

   /**
   * Configuración de los campos editables del formulario.
   */
  @Input() fields: EditFieldConfig[] = [];

  /**
   * Función que ejecuta la petición de actualización al backend.
   * Se pasa desde el componente padre y se delega al modal para su ejecución.
   */
  @Input() updateFn!: (data: any) => Observable<any>;

  /**
   * @param updateModalService - Servicio que gestiona el estado y ciclo de vida del modal de edición
   */
  constructor(private updateModalService: ModalEditServiceService) {

  }

    /**
   * Abre el modal de edición con los datos de la entidad actual.
   */
  onClick() {
      console.log('🔹 BotonEdit click', { id: this.id, name: this.name, entityData: this.entityData });

    this.updateModalService.openModal({
      id: this.id,
      name: this.name,
      type: this.type,
      updateFn: this.updateFn,
      entityData: this.entityData,
      fields: this.fields
    });
  }

  /*editField(str: string){
    console.log(`estas editando el campo ${str}.`);
  }*/
}

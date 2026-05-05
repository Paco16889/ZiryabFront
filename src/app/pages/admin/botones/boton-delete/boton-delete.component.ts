import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';

/**
 * Componente que representa el botón de eliminación de una entidad.
 * Al pulsarlo abre el modal de confirmación de eliminación mediante el ModalDeleteServiceService,
 * sin necesidad de emitir eventos al componente padre.
 */
@Component({
  selector: 'app-boton-delete',
  imports: [],
  templateUrl: './boton-delete.component.html',
  styleUrl: './boton-delete.component.scss'
})
export class BotonDeleteComponent<R> {

  /**
   * Identificador único de la entidad a eliminar.
   */
  @Input() id!: number;

/**
   * Nombre de la entidad a mostrar en el mensaje de confirmación del modal.
   */
  @Input() name!: string;

  /**
   * Tipo de la entidad, usado en los mensajes del modal, por ejemplo 'student' o 'course'.
   */
  @Input() type!: string;

  /**
   * Función que ejecuta la petición de eliminación al backend.
   * Se pasa desde el componente padre y se delega al modal para su ejecución.
   */
  @Input() deleteFn!: (id: number) => Observable<R>;

  /**
   * Inicializa el componente.
   * @param deleteModalService - Servicio que gestiona el estado y ciclo de vida del modal de eliminación
   */
  constructor(private deleteModalService: ModalDeleteServiceService<R>) {}
  
  /**
   * Abre el modal de confirmación de eliminación con los datos de la entidad actual.
   */
  onClick() {
    // ✅ Llama al servicio directamente (sin @Output)
    this.deleteModalService.openModal({
      id: this.id,
      name: this.name,
      type: this.type,
      deleteFn: this.deleteFn
    });
  }
}

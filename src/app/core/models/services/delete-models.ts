import { Observable } from "rxjs";

/**
 * Representa el estado del modal de confirmación de eliminación.
 * Todos los campos excepto isOpen son opcionales ya que solo se
 * rellenan cuando el modal está abierto.
 */
export interface DeleteModalState {
  /** Indica si el modal está visible */
  isOpen: boolean;
  /** Identificador de la entidad a eliminar */
  entityId?: number;
  /** Nombre de la entidad a eliminar para mostrar en el modal */
  entityName?: string;
    /** Tipo de entidad a eliminar, por ejemplo 'student', 'course' */
  entityType?: string;
    /** Indica si la petición de eliminación está en curso */
  isDeleting?: boolean;
   /** Indica si la eliminación se ha completado con éxito */
  showSuccess?: boolean;
  /** Mensaje de error a mostrar si la eliminación falla */
  errorMessage?: string;
}

/**
 * Configuración necesaria para abrir el modal de eliminación.
 * Encapsula tanto los datos de la entidad como la función de borrado
 * a ejecutar cuando el usuario confirme la acción.
 * @example
 * const request: DeleteRequest = {
 *   id: ID_ENTIDAD,
 *   name: 'NOMBRE_ENTIDAD',
 *   type: 'TIPO_ENTIDAD',
 *   deleteFn: (id) => this.miServicio.delete(id)
 * };
 */
export interface DeleteRequest<R> {
  /** Identificador único de la entidad a eliminar */
  id: number;
  /** Nombre de la entidad a mostrar en el mensaje de confirmación */
  name: string;
  /** Tipo de entidad, usado en los mensajes del modal */
  type: string;
  /** Función que ejecuta la petición de eliminación al backend */
  deleteFn: (id: number) => Observable<R>;
}
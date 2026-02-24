import { Observable } from "rxjs";
import { EditFieldConfig } from "../../configs/edit-modal-config";


/**
 * Representa el estado del modal de edición.
 * Todos los campos excepto isOpen son opcionales ya que solo se
 * rellenan cuando el modal está abierto.
 */
export interface UpdateModalState {

  /** Indica si el modal está visible */
  isOpen: boolean;
  /** Identificador de la entidad a actualizar */
  entityId?: number;
  /** Nombre de la entidad a actualizar para mostrar en el modal */
  entityName?: string;
  /** Tipo de entidad a actualizar, por ejemplo 'student', 'course' */
  entityType?: string;
  /** Datos actuales de la entidad para prerellenar el formulario */
  entityData?: any;
  /** Configuración de los campos editables del formulario */
  fields?: EditFieldConfig[];
  /** Indica si la petición de actualización está en curso */
  isUpdating?: boolean;
  /** Indica si la actualización se ha completado con éxito */
  showSuccess?: boolean;
  /** Mensaje de error a mostrar si la actualización falla */
  errorMessage?: string;
}

/**
 * Configuración necesaria para abrir el modal de edición.
 * Encapsula los datos de la entidad, la configuración de campos del formulario
 * y la función de actualización a ejecutar cuando el usuario confirme los cambios.
 * @example
 * const request: UpdateRequest = {
 *   id: ID_ENTIDAD,
 *   name: 'NOMBRE_ENTIDAD',
 *   type: 'TIPO_ENTIDAD',
 *   entityData: DATOS_ACTUALES,
 *   fields: CONFIGURACION_CAMPOS,
 *   updateFn: (data) => this.miServicio.update(data)
 * };
 */
export interface UpdateRequest {
    /** Identificador único de la entidad a actualizar */
  id: number;
  /** Nombre de la entidad a mostrar en el título del modal */
  name: string;
  /** Tipo de entidad, usado en los mensajes del modal */
  type: string;
  /** Datos actuales de la entidad para prerellenar el formulario */
  entityData: any;
  /** Configuración de los campos editables del formulario */
  fields: EditFieldConfig[];
  /** Función que ejecuta la petición de actualización al backend */
  updateFn: (data: any) => Observable<any>;
}
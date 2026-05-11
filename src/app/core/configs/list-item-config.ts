// core/models/generic-list-item-config.ts

import { Observable } from "rxjs";
import { EditFieldConfig } from "./edit-modal-config";

/**
 * Configuración de un campo individual dentro de un elemento de lista genérico.
 * Define cómo se muestra y formatea cada campo de la entidad en la vista de lista.
 */
export interface ListItemFieldConfig {
  /** Clave del objeto de la entidad, por ejemplo 'name' o 'email' */
  key: string;
  /** Etiqueta visible del campo, opcional */
  label?: string;
  /** Clases CSS adicionales a aplicar al campo */
  className?: string;
  /** Función de formateo para transformar el valor antes de mostrarlo */
  format?: (value: any) => string;
  /** Si es true el campo se oculta en dispositivos móviles */
  hideOnMobile?: boolean;
  /** Orden de aparición del campo en la lista */
  order?: number;
}

/**
 * Configuración completa de un elemento de lista genérico.
 * Permite definir los campos a mostrar, las acciones disponibles, el layout,
 * y las funciones de servicio para operar con la entidad.
 * @template T - Tipo de la entidad que representa el elemento de lista
 * @example
 * const config: ListItemConfig<Student> = {
 *   fields: [
 *     { key: 'name', label: 'Nombre' },
 *     { key: 'email', label: 'Correo' }
 *   ],
 *   actions: { edit: true, delete: true, detail: true },
 *   entityType: 'el estudiante',
 *   entityNameFormat: (s) => `${s.name} ${s.surname}`
 * };
 */
export interface ListItemConfig<T, U, R, S> {
  /** Configuración de los campos a mostrar en el elemento de lista */
  fields: ListItemFieldConfig[];
  /** Configuración de las acciones disponibles para la entidad */
  actions?: {
    /** Muestra el botón de edición */
    edit?: boolean;
    /** Muestra el botón de eliminación */
    delete?: boolean;
    /** Muestra el botón de detalle */
    detail?: boolean;
  };
  /** Configuración del layout del elemento de lista */
  layout?: {
    /** Clases CSS del contenedor principal */
    containerClass?: string;
    /** Clases CSS del contenedor de campos */
    fieldsContainerClass?: string;
    /** Clases CSS del contenedor de acciones */
    actionsContainerClass?: string;
    /** Si es true usa grid en dispositivos móviles */
    responsive?: boolean;
  };
  /** Componente Angular a usar para la vista de detalle */
  detailComponent?: any;
  /** Configuración de los campos del formulario de edición */
  editFields?: EditFieldConfig[];
  /** Función que obtiene la entidad por su identificador */
  getByIdFn?: (id: number) => any;
  /** Función que ejecuta la actualización de la entidad */
  updateFn?: (data: U) => Observable<R>;
  /** Función que ejecuta la eliminación de la entidad */
  deleteFn?: (id: number) => Observable<S>;
  /** Texto descriptivo del tipo de entidad para los mensajes del modal */
  entityType?: string;
  /** Función que genera el nombre representativo de la entidad para mostrar en los modales */
  entityNameFormat?: (entity: T) => string;
}

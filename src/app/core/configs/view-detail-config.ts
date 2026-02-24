// core/models/generic-view-detail-config.ts



/**
 * Configuración de un campo individual dentro de la vista de detalle genérica.
 * Define cómo se muestra y formatea cada campo de la entidad en la vista de detalle.
 * Soporta rutas anidadas en la clave, por ejemplo 'course.name'.
 */
export interface ViewDetailFieldConfig {
  /** Clave del campo en el objeto de la entidad, soporta notación anidada como 'course.name' */
  key: string;
  /** Etiqueta visible del campo, por ejemplo 'DNI:' o 'Email:' */
  label?: string;
  /** Función de formateo para transformar el valor antes de mostrarlo */
  format?: (value: any) => string;
  /** Clases CSS adicionales a aplicar al campo */
  className?: string;
  /** Tipo de campo para determinar su representación visual */
  type?: 'text' | 'title' | 'list';
  /** Orden de aparición del campo en la vista de detalle */
  order?: number;
}

/**
 * Configuración completa de la vista de detalle genérica.
 * Permite definir los campos a mostrar, el layout y las listas anidadas
 * de relaciones de la entidad, como las asignaturas de un ciclo.
 * @template T - Tipo de la entidad que representa la vista de detalle
 * @example
 * const config: ViewDetailConfig<Course> = {
 *   fields: [
 *     { key: 'name', label: 'Nombre', type: 'title' },
 *     { key: 'description', label: 'Descripción', type: 'text' }
 *   ],
 *   nestedLists: [
 *     {
 *       key: 'subjects',
 *       title: 'Asignaturas',
 *       itemKey: 'name'
 *     }
 *   ]
 * };
 */
export interface ViewDetailConfig<T> {
  /** Configuración de los campos a mostrar en la vista de detalle */
  fields: ViewDetailFieldConfig[];
  /** Configuración del layout de la vista de detalle */
  layout?: {
    /** Clases CSS del contenedor principal */
    containerClass?: string;
    /** Clases CSS para los campos de tipo título */
    titleClass?: string;
    /** Clases CSS para los campos de tipo texto */
    fieldClass?: string;
  };
  /** Configuración de las listas anidadas de relaciones de la entidad */
  nestedLists?: {
    /** Clave del array en el objeto de la entidad, por ejemplo 'subjects' */
    key: string;
    /** Título de la lista anidada, por ejemplo 'Asignaturas' */
    title?: string;
    /** Propiedad de cada elemento del array a mostrar, por ejemplo 'name' */
    itemKey: string;
    /** Función de formateo personalizado para cada elemento de la lista */
    itemFormat?: (item: any) => string;
  }[];
}
//MEY8HyQiP5 contra seña para email estudiante5@ziryab.es
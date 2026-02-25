import { Component, Input } from '@angular/core';
import { ViewDetailConfig, ViewDetailFieldConfig } from '../../../core/configs/view-detail-config';

/**
 * Componente genérico que muestra la vista de detalle de cualquier entidad del sistema.
 * Renderiza los campos configurados y las listas anidadas de relaciones.
 * @template T - Tipo de la entidad a mostrar en el detalle
 */
@Component({
  selector: 'app-generic-view-detail',
  imports: [],
  templateUrl: './generic-view-detail.component.html',
  styleUrl: './generic-view-detail.component.scss'
})
export class GenericViewDetailComponent<T> {

   /**
   * Entidad cuyos datos se muestran en la vista de detalle.
   */
  @Input() item!: T;

  /**
   * Configuración de la vista de detalle con campos y layout.
   */
  @Input() config!: ViewDetailConfig<T>;

   /**
   * Obtiene el valor de un campo de la entidad.
   * Soporta notación anidada separada por puntos, por ejemplo 'course.name'.
   * @param item - Entidad de la que obtener el valor
   * @param key - Clave del campo, soporta notación anidada
   * @returns El valor del campo o cadena vacía si no existe
   */
  getFieldValue(item: T, key: string): any {
    const keys = key.split('.');
    let value: any = item;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return '';
      }
    }
    
    return value;
  }

   /**
   * Obtiene el valor formateado de un campo según su configuración.
   * @param item - Entidad de la que obtener el valor
   * @param fieldConfig - Configuración del campo
   * @returns El valor formateado como cadena de texto
   */
  getFormattedValue(item: T, fieldConfig: ViewDetailFieldConfig): string {
    const value = this.getFieldValue(item, fieldConfig.key);
    
    if (fieldConfig.format) {
      return fieldConfig.format(value);
    }
    
    return value?.toString() || '';
  }

    /**
   * Obtiene el array anidado de una relación de la entidad.
   * @param item - Entidad de la que obtener el array
   * @param key - Clave del array en la entidad
   * @returns El array de elementos o array vacío si no existe
   */
  getNestedArray(item: T, key: string): any[] {
    const value = this.getFieldValue(item, key);
    return Array.isArray(value) ? value : [];
  }

 /**
   * Devuelve las clases CSS del contenedor principal de la vista de detalle.
   */
  get containerClass(): string {
    return this.config.layout?.containerClass || 'flex flex-col gap-2 p-4 bg-gray-100 rounded';
  }

   /**
   * Devuelve las clases CSS de los campos de tipo título.
   */
  get titleClass(): string {
    return this.config.layout?.titleClass || 'text-xl font-bold';
  }

   /**
   * Devuelve las clases CSS de los campos de tipo texto.
   */
  get fieldClass(): string {
    return this.config.layout?.fieldClass || 'text-sm';
  }
}

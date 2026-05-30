import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { GenericEditModalComponent } from "../modales/generic-edit-modal/generic-edit-modal.component";
import { GenericDeleteModalComponent } from "../modales/generic-delete-modal/generic-delete-modal.component";
import { BotonEditComponent } from "../botones/boton-edit/boton-edit.component";
import { BotonDeleteComponent } from "../botones/boton-delete/boton-delete.component";
import { BotonViewdetailComponent } from "../botones/boton-viewdetail/boton-viewdetail.component";
import { ListItemConfig, ListItemFieldConfig } from '../../../core/configs/list-item-config';
import { GenericViewDetailComponent } from '../generic-view-detail/generic-view-detail.component';
import { ViewDetailConfig } from '../../../core/configs/view-detail-config';
import { WithId } from '../../../core/models/withId';

/**
 * Componente genérico que representa un elemento de una lista.
 * Soporta visualización de campos configurables, acciones de edición,
 * eliminación y vista de detalle para cualquier entidad del sistema.
 * @template T - Tipo de la entidad que debe tener al menos un campo id
 */

@Component({
  selector: 'app-generic-list-item',
  imports: [ BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, GenericViewDetailComponent],
  templateUrl: './generic-list-item.component.html',
  styleUrl: './generic-list-item.component.scss'
})
export class GenericListItemComponent<T extends WithId, U, R, S> {

  /**
   * Entidad a mostrar en el elemento de lista.
   */
  @Input() item!: T;  

  /**
   * Configuración del elemento de lista con campos, acciones y layout.
   */
  @Input() config!: ListItemConfig<T, U, R, S>;  

  /**
   * Configuración opcional de la vista de detalle de la entidad.
   */
  @Input() detailConfig?: ViewDetailConfig<T>
  
  
  
  

   /**
   * Entidad actualmente seleccionada para mostrar su detalle.
   * Es null cuando no hay ningún detalle abierto.
   */
  selectedItem: T | null = null;  

    /**
   * Entidad actualmente seleccionada para editar.
   */
  itemToEdit: U | null = null;  
  

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
        value = value[k];
      } else {
        return '';
      }
    }
    
    return value;
  }

   /**
   * Obtiene el valor formateado de un campo según su configuración.
   * Si el campo tiene función de formato la aplica, si no devuelve el valor como texto.
   * @param item - Entidad de la que obtener el valor
   * @param fieldConfig - Configuración del campo
   * @returns El valor formateado como cadena de texto
   */
  getFormattedValue(item: T, fieldConfig: any): string {  // ✅ item: any
    const value = this.getFieldValue(item, fieldConfig.key);
    
    if (fieldConfig.format) {
      return fieldConfig.format(value);
    }
    
    return value?.toString() || '';
  }

  /**
   * Obtiene el nombre representativo de la entidad para mostrar en los modales.
   * Usa la función entityNameFormat de la configuración o el campo name por defecto.
   * @param item - Entidad de la que obtener el nombre
   * @returns Nombre representativo de la entidad
   */
  getEntityName(item: T): string {  // ✅ item: any
    if (this.config.entityNameFormat) {
      return this.config.entityNameFormat(item);
    }
    
    // Por defecto, intenta usar 'name'
    return this.getFieldValue(item, 'name');
  }

    /**
   * Alterna la vista de detalle de un elemento.
   * Si el elemento ya está seleccionado lo cierra, si no llama al backend para obtener sus datos.
   * @param itemId - Identificador del elemento cuyo detalle se quiere mostrar
   */
  toggleDetail(itemId: number) {
    if (this.selectedItem && this.getFieldValue(this.selectedItem, 'id') === itemId) {
      this.selectedItem = null;
      return;
    }

    if (this.config.getByIdFn) {
      this.config.getByIdFn(itemId).subscribe({
        next: (res: any) => this.selectedItem = res.data,  // ✅ data: any
        error: (err: any) => console.error('Error al obtener detalle:', err)
      });
    }
  }

 

  /**
   * Formatea los campos de tipo fecha de una entidad para su uso en inputs de formulario.
   * Convierte el formato ISO a formato YYYY-MM-DD requerido por los inputs de tipo date.
   * @param item - Entidad cuyos campos de fecha se van a formatear
   * @returns Copia de la entidad con los campos de fecha formateados
   */
    private formatDateFields(item: any): any {  // ✅ item: any, return: any
    const formatted = { ...item };
    
    if (this.config.editFields) {
      this.config.editFields.forEach(field => {
        if (field.type === 'date' && formatted[field.name]) {
          const dateValue = formatted[field.name];
          formatted[field.name] = this.formatDateForInput(dateValue);
        }
      });
    }
    
    return formatted;
  }

    /**
   * Convierte una fecha en formato ISO al formato YYYY-MM-DD para inputs de tipo date.
   * @param isoDate - Fecha en formato ISO
   * @returns Fecha en formato YYYY-MM-DD o cadena vacía si no hay fecha
   */
  private formatDateForInput(isoDate: string): string {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
  }

 

  /**
   * Indica si el elemento tiene alguna acción disponible.
   */
  get hasActions(): boolean {
    return !!(this.config.actions?.edit || this.config.actions?.delete || this.config.actions?.detail);
  }

   /**
   * Devuelve las clases CSS del contenedor principal del elemento.
   * Usa las clases de la configuración o las clases por defecto.
   */
  get containerClass(): string {
    return this.config.layout?.containerClass || 
           'm-2 flex items-stretch overflow-hidden rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 shadow-sm';
  }

  /**
   * Devuelve las clases del bloque interno de contenido del item.
   * Replica la estructura visual tipo task-group-item con fondo suave.
   */
  get contentClass(): string {
    return 'flex flex-1 flex-col gap-2 bg-purple-50/50 dark:bg-gray-900 px-4 py-3 md:flex-row md:items-center md:justify-between';
  }

  /**
   * Devuelve las clases CSS del contenedor de campos del elemento.
   * Usa las clases de la configuración o las clases por defecto.
   */
  get fieldsContainerClass(): string {
    return this.config.layout?.fieldsContainerClass || 
           'flex flex-col gap-1 text-gray-800 dark:text-purple-100 md:flex-row md:flex-wrap md:gap-4';
  }

  /**
   * Devuelve las clases CSS del contenedor de acciones del elemento.
   * En móvil reparte el ancho entre botones (grid); en desktop fila compacta.
   */
  get actionsContainerClass(): string {
    if (this.config.layout?.actionsContainerClass) {
      return this.config.layout.actionsContainerClass;
    }

    const actionCount = [
      this.config.actions?.edit,
      this.config.actions?.delete,
      this.config.actions?.detail,
    ].filter(Boolean).length;

    const mobileCols =
      actionCount <= 1 ? 'grid-cols-1' : actionCount === 2 ? 'grid-cols-2' : 'grid-cols-3';

    return `grid ${mobileCols} gap-2 w-full md:flex md:w-auto md:gap-2`;
  }


 /**
   * Devuelve las clases CSS de un campo incluyendo la ocultación en móvil si procede.
   * @param field - Configuración del campo
   * @returns Cadena de clases CSS a aplicar al campo
   */

getFieldClasses(field: ListItemFieldConfig): string {
  let classes = field.className || '';

  if (!classes.includes('dark:')) {
    if (classes.includes('text-gray-700')) {
      classes += ' dark:text-purple-200';
    } else if (classes.includes('text-purple-700')) {
      classes += ' dark:text-purple-300';
    } else if (classes.includes('font-bold') || classes.includes('font-medium')) {
      classes += ' dark:text-purple-100';
    }
  }

  if (field.hideOnMobile) {
    classes += ' hidden md:block';
  }

  return classes;
}
}

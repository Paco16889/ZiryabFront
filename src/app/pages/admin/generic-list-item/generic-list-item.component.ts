import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { GenericEditModalComponent } from "../modales/generic-edit-modal/generic-edit-modal.component";
import { GenericDeleteModalComponent } from "../modales/generic-delete-modal/generic-delete-modal.component";
import { BotonEditComponent } from "../botones/boton-edit/boton-edit.component";
import { BotonDeleteComponent } from "../botones/boton-delete/boton-delete.component";
import { BotonViewdetailComponent } from "../botones/boton-viewdetail/boton-viewdetail.component";
import { ListItemConfig, ListItemFieldConfig } from '../../../core/configs/list-item-config';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-generic-list-item',
  imports: [GenericEditModalComponent, BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, NgTemplateOutlet],
  templateUrl: './generic-list-item.component.html',
  styleUrl: './generic-list-item.component.scss'
})
export class GenericListItemComponent {

  @Input() item!: any;  
  @Input() config!: ListItemConfig<any>;  
  @Input() detailTemplate?: TemplateRef<any>;
  
  @Output() itemUpdated = new EventEmitter<any>();  
  

  // Estado interno
  selectedItem: any | null = null;  
  itemToEdit: any | null = null;  
  

  // Obtener valor de un campo usando la clave (soporta propiedades anidadas)
  getFieldValue(item: any, key: string): any { 
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

  // Formatear un campo según su configuración
  getFormattedValue(item: any, fieldConfig: any): string {  // ✅ item: any
    const value = this.getFieldValue(item, fieldConfig.key);
    
    if (fieldConfig.format) {
      return fieldConfig.format(value);
    }
    
    return value?.toString() || '';
  }

  // Obtener el nombre de la entidad para mostrar en modales
  getEntityName(item: any): string {  // ✅ item: any
    if (this.config.entityNameFormat) {
      return this.config.entityNameFormat(item);
    }
    
    // Por defecto, intenta usar 'name'
    return this.getFieldValue(item, 'name');
  }

  // ==================== DETAIL ====================
  toggleDetail(itemId: number) {
    if (this.selectedItem && this.getFieldValue(this.selectedItem, 'id') === itemId) {
      this.selectedItem = null;
      return;
    }

    if (this.config.getByIdFn) {
      this.config.getByIdFn(itemId).subscribe({
        next: (data: any) => this.selectedItem = data,  // ✅ data: any
        error: (err: any) => console.error('Error al obtener detalle:', err)
      });
    }
  }

  // ==================== EDIT ====================
  toggleEdit(itemId: number) {
    if (this.config.getByIdFn) {
      this.config.getByIdFn(itemId).subscribe({
        next: (response: any) => {  // ✅ response: any
          this.itemToEdit = this.formatDateFields(response);
        },
        error: (err: any) => console.error('Error al obtener item para editar:', err)
      });
    }
  }

  closeEditModal() {
    this.itemToEdit = null;
  }

  onItemUpdated(updatedItem: any) {  // ✅ updatedItem: any
    this.closeEditModal();
    this.itemUpdated.emit(updatedItem);
  }

  // Helper para formatear fechas antes de enviar al modal
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

  private formatDateForInput(isoDate: string): string {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
  }

 

  // Getters para usar en el template
  get hasActions(): boolean {
    return !!(this.config.actions?.edit || this.config.actions?.delete || this.config.actions?.detail);
  }

  get containerClass(): string {
    return this.config.layout?.containerClass || 
           'flex flex-col md:flex-row md:justify-between md:items-center m-2 bg-purple-300 rounded px-2 py-2 gap-2';
  }

  get fieldsContainerClass(): string {
    return this.config.layout?.fieldsContainerClass || 
           'flex flex-col md:flex-row md:gap-4';
  }

  get actionsContainerClass(): string {
  // Si hay una clase personalizada, úsala
  if (this.config.layout?.actionsContainerClass) {
    return this.config.layout.actionsContainerClass;
  }
  
  // Si responsive es TRUE, usa grid en móvil
  if (this.config.layout?.responsive === true) {
    return 'grid grid-cols-3 gap-2 w-full md:flex md:w-auto md:gap-1';
  }
  
  // Si responsive es FALSE (o undefined), usa flex siempre
  return 'flex gap-1 py-1';
}

  // En generic-list-item.component.ts

getFieldClasses(field: ListItemFieldConfig): string {
  let classes = field.className || '';
  
  // Si debe ocultarse en móvil, añadimos la clase de Tailwind
  if (field.hideOnMobile) {
    classes += ' hidden md:block';
  }
  
  return classes;
}
}

import { Component, Input } from '@angular/core';
import { ViewDetailConfig, ViewDetailFieldConfig } from '../../../core/configs/view-detail-config';

@Component({
  selector: 'app-generic-view-detail',
  imports: [],
  templateUrl: './generic-view-detail.component.html',
  styleUrl: './generic-view-detail.component.scss'
})
export class GenericViewDetailComponent {
  @Input() item!: any;
  @Input() config!: ViewDetailConfig<any>;

  // Obtener valor de un campo (soporta propiedades anidadas)
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
  getFormattedValue(item: any, fieldConfig: ViewDetailFieldConfig): string {
    const value = this.getFieldValue(item, fieldConfig.key);
    
    if (fieldConfig.format) {
      return fieldConfig.format(value);
    }
    
    return value?.toString() || '';
  }

  // Obtener array anidado
  getNestedArray(item: any, key: string): any[] {
    const value = this.getFieldValue(item, key);
    return Array.isArray(value) ? value : [];
  }

  // Clases por defecto
  get containerClass(): string {
    return this.config.layout?.containerClass || 'flex flex-col gap-2 p-4 bg-gray-100 rounded';
  }

  get titleClass(): string {
    return this.config.layout?.titleClass || 'text-xl font-bold';
  }

  get fieldClass(): string {
    return this.config.layout?.fieldClass || 'text-sm';
  }
}

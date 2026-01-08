// core/models/generic-list-item-config.ts

import { EditFieldConfig } from "./edit-modal-config";

export interface ListItemFieldConfig {
  key: string;                    // Clave del objeto (ej: 'name', 'email')
  label?: string;                 // Label opcional
  className?: string;             // Clases CSS específicas
  format?: (value: any) => string; // Función para formatear
  hideOnMobile?: boolean;         // Ocultar en móvil
  order?: number;                 // Orden de aparición
}

export interface ListItemConfig<T> {
  // Campos a mostrar en el list-item
  fields: ListItemFieldConfig[];
  
  // Configuración de acciones
  actions?: {
    edit?: boolean;
    delete?: boolean;
    detail?: boolean;
  };
  
  // Configuración de layout
  layout?: {
    containerClass?: string;
    fieldsContainerClass?: string;
    actionsContainerClass?: string;
    responsive?: boolean; // Si es true, usa grid en móvil
  };
  
  // Componente de detalle a usar
  detailComponent?: any;
  
  // Campos para edit modal
  editFields?: EditFieldConfig[];
  
  // Funciones de servicio
  getByIdFn?: (id: number) => any;
  updateFn?: (data: any) => any;
  deleteFn?: (id: number) => any;
  
  // Textos personalizados
  entityType?: string; // "el estudiante", "el profesor"
  entityNameFormat?: (entity: T) => string; // Cómo formar el nombre para mostrar
}
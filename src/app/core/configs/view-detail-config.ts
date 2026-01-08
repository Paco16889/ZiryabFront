// core/models/generic-view-detail-config.ts

export interface ViewDetailFieldConfig {
  key: string;                    // Clave del objeto (ej: 'name', 'email', 'course.name')
  label?: string;                 // Label opcional (ej: 'DNI:', 'Email:')
  format?: (value: any) => string; // Función para formatear el valor
  className?: string;             // Clases CSS específicas
  type?: 'text' | 'title' | 'list'; // Tipo de campo
  order?: number;                 // Orden de aparición
}

export interface ViewDetailConfig<T> {
  // Campos a mostrar
  fields: ViewDetailFieldConfig[];
  
  // Configuración de layout
  layout?: {
    containerClass?: string;      // Clases del contenedor principal
    titleClass?: string;          // Clases para títulos
    fieldClass?: string;          // Clases para campos normales
  };
  
  // Para listas anidadas (como subjects en course)
  nestedLists?: {
    key: string;                  // Clave del array (ej: 'subjects')
    title?: string;               // Título de la lista (ej: 'Asignaturas')
    itemKey: string;              // Qué propiedad mostrar de cada item (ej: 'name')
    itemFormat?: (item: any) => string; // Formato personalizado
  }[];
}
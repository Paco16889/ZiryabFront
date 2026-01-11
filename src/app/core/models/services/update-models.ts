import { Observable } from "rxjs";
import { EditFieldConfig } from "../../configs/edit-modal-config";

export interface UpdateModalState {

  isOpen: boolean;
  entityId?: number;
  entityName?: string;
  entityType?: string;
  entityData?: any;  // ← Datos para el formulario
  fields?: EditFieldConfig[];  // ← Configuración de campos
  isUpdating?: boolean;
  showSuccess?: boolean;
  errorMessage?: string;
}

export interface UpdateRequest {
  id: number;
  name: string;
  type: string;
  entityData: any;
  fields: EditFieldConfig[];
  updateFn: (data: any) => Observable<any>;
}
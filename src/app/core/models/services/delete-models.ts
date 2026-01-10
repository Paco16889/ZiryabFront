import { Observable } from "rxjs";

export interface DeleteModalState {
  isOpen: boolean;
  entityId?: number;
  entityName?: string;
  entityType?: string;
  isDeleting?: boolean;
  showSuccess?: boolean;
  errorMessage?: string;
}

export interface DeleteRequest {
  id: number;
  name: string;
  type: string;
  deleteFn: (id: number) => Observable<any>;
}
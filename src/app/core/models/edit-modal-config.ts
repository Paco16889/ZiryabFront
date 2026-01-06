import { ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";

export interface EditFieldConfig {
  name: string;
  label: string;
  type?: string; // 'text', 'email', 'date', 'number'
  placeholder?: string;
  validators?: ValidatorFn[];
  errorMessage?: string;
  maxlength?: number;

  fieldType?: 'input' | 'select';  // Tipo de campo
  options?: { value: any; label: string }[];  // Opciones del dropdown
  optionsObservable?: Observable<any[]>;  // Para cargar opciones async
  optionValueKey?: string;  // Ej: 'id'
  optionLabelKey?: string;  // Ej: 'name'
}
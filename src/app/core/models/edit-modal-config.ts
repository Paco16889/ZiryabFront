import { ValidatorFn } from "@angular/forms";

export interface EditFieldConfig {
  name: string;
  label: string;
  type?: string; // 'text', 'email', 'date', 'number'
  placeholder?: string;
  validators?: ValidatorFn[];
  errorMessage?: string;
  maxlength?: number;
}
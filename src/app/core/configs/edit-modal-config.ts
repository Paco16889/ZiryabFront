import { ValidatorFn } from "@angular/forms";
import { Observable } from "rxjs";

// configs/edit-modal-config.ts

/**
 * Configuración de un campo del formulario de edición del modal.
 * Permite definir tanto campos de texto simples como selectores con opciones
 * estáticas o cargadas de forma asíncrona desde la API.
 * @example
 * const campo: EditFieldConfig = {
 *   name: 'NOMBRE_CAMPO',
 *   label: 'ETIQUETA_CAMPO',
 *   type: 'text',
 *   placeholder: 'PLACEHOLDER_CAMPO',
 *   fieldType: 'input',
 *   optionValueKey: 'id',
 *   optionLabelKey: 'name',
 *   optionsObservable: OBSERVABLE_OPCIONES
 * };
 */
export interface EditFieldConfig {
  /** Nombre del campo, debe coincidir con la clave del objeto de datos */
  name: string;
  /** Etiqueta visible del campo en el formulario */
  label: string;
  /** Tipo del input HTML: 'text', 'email', 'date', 'number' */
  type?: string;
  /** Texto de ayuda que se muestra cuando el campo está vacío */
  placeholder?: string;
  /** Array de validadores de Angular Forms a aplicar al campo */
  validators?: ValidatorFn[];
  /** Mensaje de error a mostrar cuando la validación falla */
  errorMessage?: string;
  /** Longitud máxima permitida para campos de texto */
  maxlength?: number;
  /** Tipo de campo del formulario: input de texto o selector desplegable */
  fieldType?: 'input' | 'select';
  /** Opciones estáticas para el selector desplegable */
  options?: { value: any; label: string }[];
  /** Observable que carga las opciones del selector de forma asíncrona */
  optionsObservable?: Observable<any[]>;
  /** Clave del objeto de opciones que se usa como valor del selector */
  optionValueKey?: string;
  /** Clave del objeto de opciones que se usa como etiqueta del selector */
  optionLabelKey?: string;
}
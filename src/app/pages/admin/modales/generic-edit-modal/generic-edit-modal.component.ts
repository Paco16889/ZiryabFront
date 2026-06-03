import { Component, DestroyRef, effect, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditFieldConfig } from '../../../../core/configs/edit-modal-config';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalEditService } from '../../../../core/services/UI/modal-edit.service';
import { WithId } from '../../../../core/models/withId';

/**
 * Componente genérico que representa el modal de edición de una entidad.
 * Genera el formulario dinámicamente a partir de la configuración de campos recibida.
 * Soporta campos de texto y selectores con opciones estáticas o asíncronas.
 * Muestra tres estados: formulario, actualizando y éxito.
 * Se sincroniza con el ModalEditService mediante un effect
 * para reflejar el estado actual del proceso de actualización.
 *
 * @typeParam T - Entidad en edición con `id` y campos mostrados en el formulario.
 * @typeParam U - Payload enviado al backend en la actualización (incluye `id`).
 * @typeParam R - Tipo de la respuesta HTTP de la función de actualización.
 */
@Component({
  selector: 'app-generic-edit-modal',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './generic-edit-modal.component.html',
  styleUrl: './generic-edit-modal.component.scss'
})
export class GenericEditModalComponent<T extends WithId & Record<string, unknown>, U, R> implements OnInit {
  /** Nombre de tipo de entidad usado en títulos y mensajes del modal. */
  @Input() entityType!: string;

  /** Nombre concreto de la entidad editada. */
  @Input() entityName!: string;

  /** Datos actuales con los que se precarga el formulario. */
  @Input() entityData!: T;

  /** Campos editables que definen controles, validadores y opciones. */
  @Input() fields!: EditFieldConfig[];

  /** Función de actualización específica de la entidad. */
  @Input() updateFunction!: (data: U) => Observable<R>;

  /** FormGroup generado dinámicamente desde `fields`. */
  editForm!: FormGroup;

  /** Indica que se está ejecutando la actualización. */
  isUpdating = false;

  /** Muestra estado de éxito antes del autocierre del modal. */
  showSuccess = false;

  /** Mensaje de error devuelto por el servicio modal. */
  errorMessage = '';

  /** Opciones cargadas para campos select. */
  fieldOptions: { [key: string]: { value: unknown; label: string }[] } = {};

  /** Estado de carga por campo select con opciones asíncronas. */
  loadingOptions: { [key: string]: boolean } = {};

  /** Ciclo de vida usado para cancelar suscripciones de opciones asíncronas. */
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Crea el formulario y sincroniza el estado visual con ModalEditService.
   * @param fb Constructor de formularios reactivos.
   * @param editModalService Servicio que orquesta el estado global del modal.
   */
  constructor(
    private fb: FormBuilder,
    private editModalService: ModalEditService
  ) {
    effect(() => {
      const modalState = this.editModalService.modalState();
      this.isUpdating = modalState.isUpdating!;
      this.showSuccess = modalState.showSuccess!;
      this.errorMessage = modalState.errorMessage!;
    });
  }

  /** Genera el formulario y carga opciones de selects al inicializar el modal. */
  ngOnInit() {
    const group: Record<string, unknown> = {};
    this.fields.forEach(f => {
      group[f.name] = [this.initialControlValue(f), f.validators || []];

      if (f.fieldType === 'select') {
        this.loadSelectOptions(f);
      }
    });
    this.editForm = this.fb.group(group);
  }

  /**
   * Valor inicial del control según tipo de campo.
   * Los numéricos conservan number; el resto usa cadena vacía si falta valor.
   */
  private initialControlValue(field: EditFieldConfig): unknown {
    const raw = this.entityData[field.name];
    if (field.type === 'number') {
      return raw === null || raw === undefined ? null : raw;
    }
    return raw ?? '';
  }

  /**
   * Convierte campos `type: 'number'` del formulario a number para el PATCH.
   * Los inputs HTML devuelven string; el backend (Zod) espera number (EQ-323).
   */
  private normalizeNumericFields(
    formValue: Record<string, unknown>,
  ): Record<string, unknown> {
    const normalized = { ...formValue };
    for (const field of this.fields) {
      if (field.type !== 'number') {
        continue;
      }
      const raw = normalized[field.name];
      if (raw === '' || raw === null || raw === undefined) {
        normalized[field.name] = null;
        continue;
      }
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) {
        normalized[field.name] = parsed;
      }
    }
    return normalized;
  }

  /**
   * Resuelve opciones estáticas o asíncronas para un campo select.
   * @param field Configuración del campo select cuyas opciones hay que cargar.
   */
  private loadSelectOptions(field: EditFieldConfig) {
    if (field.options) {
      this.fieldOptions[field.name] = field.options;
      return;
    }

    if (field.optionsObservable) {
      this.loadingOptions[field.name] = true;

      field.optionsObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => {
          this.fieldOptions[field.name] = data.map(item => ({
            value: item[field.optionValueKey || 'id'],
            label: item[field.optionLabelKey || 'name']
          }));
          this.loadingOptions[field.name] = false;
        },
        error: (err) => {
          console.error(`Error cargando opciones para ${field.name}:`, err);
          this.loadingOptions[field.name] = false;
        }
      });
    }
  }

  /** Valida el formulario y delega la actualización al servicio global. */
  onSubmit() {
    if (this.editForm.invalid) return;
    const updateData = {
      id: this.entityData.id,
      ...this.normalizeNumericFields(this.editForm.value as Record<string, unknown>),
    } as U;

    this.editModalService.confirmUpdate(updateData);
  }

  /** Cierra el modal descartando cambios pendientes. */
  onClose() {
    this.editModalService.closeModal();
  }
}

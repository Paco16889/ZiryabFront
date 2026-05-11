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
 */
@Component({
  selector: 'app-generic-edit-modal',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './generic-edit-modal.component.html',
  styleUrl: './generic-edit-modal.component.scss'
})
export class GenericEditModalComponent<T extends WithId & Record<string, unknown>, U, R> implements OnInit {
  @Input() entityType!: string;

  @Input() entityName!: string;

  @Input() entityData!: T;

  @Input() fields!: EditFieldConfig[];

  @Input() updateFunction!: (data: U) => Observable<R>;

  editForm!: FormGroup;

  isUpdating = false;

  showSuccess = false;

  errorMessage = '';

  fieldOptions: { [key: string]: { value: unknown; label: string }[] } = {};

  loadingOptions: { [key: string]: boolean } = {};

  private readonly destroyRef = inject(DestroyRef);

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

  ngOnInit() {
    const group: Record<string, unknown> = {};
    this.fields.forEach(f => {
      group[f.name] = [this.entityData[f.name] || '', f.validators || []];

      if (f.fieldType === 'select') {
        this.loadSelectOptions(f);
      }
    });
    this.editForm = this.fb.group(group);
  }

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

  onSubmit() {
    if (this.editForm.invalid) return;
    const updateData = {
      id: this.entityData.id,
      ...this.editForm.value
    } as U;

    this.editModalService.confirmUpdate(updateData);
  }

  onClose() {
    this.editModalService.closeModal();
  }
}

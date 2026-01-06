import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditFieldConfig } from '../../../../core/models/edit-modal-config';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-generic-edit-modal',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './generic-edit-modal.component.html',
  styleUrl: './generic-edit-modal.component.scss'
})
export class GenericEditModalComponent {
   @Input() entityType!: string; // "estudiante", "asignatura", "ciclo"
  @Input() entityName!: string; // El nombre específico
  @Input() entityData!: any; // Datos de la entidad a editar
  @Input() fields!: EditFieldConfig[]; // Configuración de campos
  @Input() updateFunction!: (data: any) => Observable<any>; // Función de update del servicio
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() entityUpdated = new EventEmitter<any>();

  editForm!: FormGroup;
  isUpdating = false;
  showSuccess = false;
  errorMessage = '';

  fieldOptions: { [key: string]: { value: any; label: string }[] } = {};
  loadingOptions: { [key: string]: boolean } = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const group: any = {};
    this.fields.forEach(f => {
      group[f.name] = [this.entityData[f.name] || '', f.validators || []];
      
      // 🆕 Cargar opciones para selects
      if (f.fieldType === 'select') {
        this.loadSelectOptions(f);
      }
    });
    this.editForm = this.fb.group(group);
  }

  private loadSelectOptions(field: EditFieldConfig) {
    // Si ya tiene opciones estáticas
    if (field.options) {
      this.fieldOptions[field.name] = field.options;
      return;
    }

    // Si tiene un observable para cargar opciones
    if (field.optionsObservable) {
      this.loadingOptions[field.name] = true;
      
      field.optionsObservable.subscribe({
        next: (data) => {
          // Transforma los datos al formato { value, label }
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
    if (this.editForm.valid) {
      this.isUpdating = true;
      this.errorMessage = '';

      const updatedData = { 
      id: this.entityData.id,  // Mantienes el id
      ...this.editForm.value   // Solo lo que está en el formulario
    };

      this.updateFunction(updatedData).subscribe({
        next: (response) => {
          this.showSuccess = true;
          this.isUpdating = false;
          
          setTimeout(() => {
            this.entityUpdated.emit(response.data);
          }, 2000);
        },
        error: (err) => {
          this.isUpdating = false;
          this.errorMessage = err.error?.message || `Error al actualizar ${this.entityType}.`;
        }
      });
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}

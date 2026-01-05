import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditFieldConfig } from '../../../core/models/edit-modal-config';
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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const group: any = {};
    this.fields.forEach(f => {
      group[f.name] = [this.entityData[f.name] || '', f.validators || []];
    });
    this.editForm = this.fb.group(group);
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.isUpdating = true;
      this.errorMessage = '';

      const updatedData = { ...this.entityData, ...this.editForm.value };

      this.updateFunction(updatedData).subscribe({
        next: (response) => {
          this.showSuccess = true;
          this.isUpdating = false;
          
          setTimeout(() => {
            this.entityUpdated.emit(response);
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

import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditFieldConfig } from '../../../../core/configs/edit-modal-config';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ModalEditServiceService } from '../../../../core/services/UI/modal-edit-service.service';

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

  constructor(private fb: FormBuilder, private editModalService: ModalEditServiceService) {
     effect(() => {
      const modalState = this.editModalService.modalState();
      console.log(
    '🧠 MODAL STATE:',
    'isOpen:', modalState.isOpen,
    'showSuccess:', modalState.showSuccess,
    'isDeleting:', modalState.isUpdating
   );
   this.isUpdating = modalState.isUpdating!;
   this.showSuccess = modalState.showSuccess!;
   this.errorMessage = modalState.errorMessage!;
  });
  }

  ngOnInit() {
    const group: any = {};
    console.log('entityData:', this.entityData);
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
    if (this.editForm.invalid) return;
    const updateData = {
    id: this.entityData.id, // ✅ aquí metemos el id
    ...this.editForm.value
  };
     
     console.log('🔹 onSubmit updateData', updateData);
     console.log('y aqui', this.entityData.id);
     this.editModalService.confirmUpdate(updateData); 
  }

  onClose() {
    this.closeModal.emit();
  }
}

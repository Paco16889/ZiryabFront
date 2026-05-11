import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EditFieldConfig } from '../../../../core/configs/edit-modal-config';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ModalEditServiceService } from '../../../../core/services/UI/modal-edit-service.service';
import { WithId } from '../../../../core/models/withId';

/**
 * Componente genérico que representa el modal de edición de una entidad.
 * Genera el formulario dinámicamente a partir de la configuración de campos recibida.
 * Soporta campos de texto y selectores con opciones estáticas o asíncronas.
 * Muestra tres estados: formulario, actualizando y éxito.
 * Se sincroniza con el ModalEditServiceService mediante un effect
 * para reflejar el estado actual del proceso de actualización.
 */
@Component({
  selector: 'app-generic-edit-modal',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './generic-edit-modal.component.html',
  styleUrl: './generic-edit-modal.component.scss'
})
export class GenericEditModalComponent<T extends WithId & Record<string, unknown>, U, R> {

   /**
   * Tipo de la entidad a editar para mostrar en los mensajes del modal,
   * por ejemplo 'estudiante', 'asignatura' o 'ciclo'.
   */
  @Input() entityType!: string; // "estudiante", "asignatura", "ciclo"

   /**
   * Nombre concreto de la entidad a editar para mostrar en el título del modal.
   */
  @Input() entityName!: string; // El nombre específico

  /**
   * Datos actuales de la entidad para prerellenar el formulario de edición.
   */
  @Input() entityData!: T; // Datos de la entidad a editar

   /**
   * Configuración de los campos editables del formulario.
   */
  @Input() fields!: EditFieldConfig[]; // Configuración de campos

  /**
   * Función que ejecuta la petición de actualización al backend.
   */
  @Input() updateFunction!: (data: U) => Observable<R>; // Función de update del servicio
  
    /**
   * Formulario reactivo generado dinámicamente a partir de la configuración de campos.
   */
  editForm!: FormGroup;

  /**
   * Indica si la petición de actualización está en curso.
   */
  isUpdating = false;

  /**
   * Indica si la actualización se ha completado con éxito.
   */
  showSuccess = false;

  /**
   * Mensaje de error a mostrar si la actualización falla.
   */
  errorMessage = '';

  /**
   * Opciones cargadas para los campos de tipo selector, indexadas por nombre de campo.
   */
  fieldOptions: { [key: string]: { value: any; label: string }[] } = {};

  /**
   * Estado de carga de las opciones de cada campo selector, indexado por nombre de campo.
   */
  loadingOptions: { [key: string]: boolean } = {};

    /**
   * @param fb - FormBuilder de Angular para construir el formulario reactivo
   * @param editModalService - Servicio que gestiona el estado del modal de edición.
   * Se suscribe mediante un effect a los cambios de estado para sincronizar
   * las propiedades isUpdating, showSuccess y errorMessage.
   */
  constructor(private fb: FormBuilder, private editModalService: ModalEditServiceService<T, U, R>) {
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

    /**
   * Inicializa el formulario reactivo con los campos y valores configurados.
   * Para los campos de tipo selector inicia la carga de sus opciones.
   */
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

   /**
   * Carga las opciones de un campo selector.
   * Si el campo tiene opciones estáticas las usa directamente.
   * Si tiene un observable las carga de forma asíncrona.
   * ATENCIÓN: la suscripción al observable no se gestiona, puede provocar memory leaks.
   * @param field - Configuración del campo selector
   */
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

   /**
   * Envía el formulario de edición si es válido.
   * Añade el id de la entidad a los datos del formulario antes de enviarlos.
   */
  onSubmit() {
    if (this.editForm.invalid) return;
    const updateData = {
    id: this.entityData.id, // ✅ aquí metemos el id
    ...this.editForm.value
  } as U;
     
     console.log('🔹 onSubmit updateData', updateData);
     console.log('y aqui', this.entityData.id);
     this.editModalService.confirmUpdate(updateData); 
  }

  /**
   * Delega el cierre del modal al servicio del modal.
   */
  onClose() {
    this.editModalService.closeModal();
  }
}

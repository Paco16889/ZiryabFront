import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupServiceService } from '../../../../../core/services/admin/entities/group-service.service';


/**
 * Componente que gestiona el formulario de creación de un nuevo grupo.
 * Valida el formulario y envía los datos al backend para crear el grupo.
 */
@Component({
  selector: 'app-group-create-form',
  imports: [ReactiveFormsModule],
  templateUrl: './group-create-form.component.html',
  styleUrl: './group-create-form.component.scss'
})
export class GroupCreateFormComponent {

   /**
   * Evento emitido cuando el usuario cancela la creación.
   */
  @Output() cancelCreate = new EventEmitter<void>();

   /**
   * Evento emitido cuando el grupo se ha creado correctamente.
   */
  @Output() groupCreated = new EventEmitter<void>();

    /**
   * Formulario reactivo con el campo nombre del grupo.
   */
  createForm : FormGroup;

   /**
   * Indica si la petición de creación está en curso.
   */
  isCreating = false;

   /**
   * Mensaje de error a mostrar si la creación falla.
   */
  errorMessage = '';

    /**
   * Inicializa el componente.
   * @param fb - FormBuilder de Angular para construir el formulario reactivo
   * @param groupService - Servicio que gestiona las operaciones con grupos
   */
  constructor(
    private fb: FormBuilder,
    private groupService: GroupServiceService
  ){
    this.createForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

   /**
   * Valida el formulario y envía los datos al backend para crear el grupo.
   * Si la creación es exitosa emite el evento groupCreated.
   */
onSubmit() {
    if (this.createForm.valid) {
      this.isCreating = true;
      this.errorMessage = '';

      this.groupService.createGroup(this.createForm.value).subscribe({
        next: () => {
          this.groupCreated.emit();
        },
        error: (err) => {
          this.isCreating = false;
          this.errorMessage = err.error?.message || 'Error al crear el grupo';
        }
      });
    }
  }

   /**
   * Emite el evento cancelCreate para cerrar el formulario sin guardar.
   */
  onCancel() {
    this.cancelCreate.emit();
  }

}


  

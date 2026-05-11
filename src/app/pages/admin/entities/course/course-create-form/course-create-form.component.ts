import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';

/**
 * Componente que gestiona el formulario de creación de un nuevo ciclo académico.
 * Valida el formulario y envía los datos al backend para crear el ciclo.
 */
@Component({
  selector: 'app-course-create-form',
  imports: [ReactiveFormsModule],
  templateUrl: './course-create-form.component.html',
  styleUrl: './course-create-form.component.scss'
})
export class CourseCreateFormComponent {

   /**
   * Evento emitido cuando el usuario cancela la creación.
   */
  @Output() cancelCreate = new EventEmitter<void>();

    /**
   * Evento emitido cuando el ciclo se ha creado correctamente.
   */
  @Output() courseCreated = new EventEmitter<void>();

   /**
   * Formulario reactivo con el campo nombre del ciclo académico.
   */
  createForm: FormGroup;

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
   * @param courseService - Servicio que gestiona las operaciones con ciclos académicos
   */
  constructor(
    private fb: FormBuilder,
    private courseService: CourseService
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  /**
   * Valida el formulario y envía los datos al backend para crear el ciclo académico.
   * Si la creación es exitosa emite el evento courseCreated.
   */
  onSubmit() {
    if (this.createForm.valid) {
      this.isCreating = true;
      this.errorMessage = '';

      this.courseService.createCourse(this.createForm.value).subscribe({
        next: () => {
          this.courseCreated.emit();
        },
        error: (err) => {
          this.isCreating = false;
          this.errorMessage = err.error?.message || 'Error al crear el ciclo';
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

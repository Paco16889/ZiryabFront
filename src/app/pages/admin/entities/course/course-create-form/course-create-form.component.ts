import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../../../core/i18n/api-error.util';

/**
 * Componente que gestiona el formulario de creación de un nuevo ciclo académico.
 * Valida el formulario y envía los datos al backend para crear el ciclo.
 */
@Component({
  selector: 'app-course-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './course-create-form.component.html',
  styleUrl: './course-create-form.component.scss'
})
export class CourseCreateFormComponent {
  private readonly translate = inject(TranslateService);

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
          this.errorMessage = resolveApiError(this.translate, err, 'common.errors.createCourse');
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

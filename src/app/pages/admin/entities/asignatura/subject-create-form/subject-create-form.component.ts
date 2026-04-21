import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectServiceService } from '../../../../../core/services/admin/entities/subject-service.service';
import { CourseServiceService } from '../../../../../core/services/admin/entities/course-service.service';
import { CoursesAllResponse } from '../../../../../core/models/course';

/**
 * Componente que gestiona el formulario de creación de una nueva asignatura.
 * Carga los ciclos disponibles al inicializarse para permitir su selección
 * y envía los datos al backend tras validar el formulario.
 */
@Component({
  selector: 'app-subject-create-form',
  imports: [ReactiveFormsModule],
  templateUrl: './subject-create-form.component.html',
  styleUrl: './subject-create-form.component.scss'
})
export class SubjectCreateFormComponent {
    /**
   * Evento emitido cuando el usuario cancela la creación.
   */
  @Output() cancelCreate = new EventEmitter<void>();

   /**
   * Evento emitido cuando la asignatura se ha creado correctamente.
   */
  @Output() subjectCreated = new EventEmitter<void>();

   /**
   * Formulario reactivo con los campos nombre e idCourse.
   */
  createForm: FormGroup;

  /**
   * Listado de ciclos disponibles para el selector del formulario.
   */
  courses: CoursesAllResponse['data'] = [];

   /**
   * Indica si la petición de creación está en curso.
   */
  isCreating = false;


  /**
   * Indica si los ciclos están siendo cargados desde el backend.
   */
  isLoadingCourses = true;

    /**
   * Mensaje de error a mostrar si la creación o la carga de ciclos falla.
   */
  errorMessage = '';

   /**
   * Inicializa el componente.
   * @param fb - FormBuilder de Angular para construir el formulario reactivo
   * @param subjectService - Servicio que gestiona las operaciones con asignaturas
   * @param courseService - Servicio que proporciona los ciclos disponibles para el selector
   */
  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectServiceService,
    private courseService: CourseServiceService
  ) {
    this.createForm = this.fb.group({
  name:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
  grade:       ['', Validators.required],
  hours:       [null, [Validators.min(1), Validators.max(30)]],
  description: ['', Validators.maxLength(255)],
  idCourse:    ['', Validators.required]
});
  }

  /**
   * Carga el listado de ciclos disponibles al inicializar el componente.
   */
  ngOnInit() {
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        this.courses = response.data;
        this.isLoadingCourses = false;
      },
      error: (err) => {
        console.error('Error cargando ciclos:', err);
        this.errorMessage = 'No se pudieron cargar los ciclos';
        this.isLoadingCourses = false;
      }
    });
  }

  /**
   * Valida el formulario y envía los datos al backend para crear la asignatura.
   * Si la creación es exitosa emite el evento subjectCreated.
   */
  onSubmit() {
    if (this.createForm.valid) {
      console.log('Datos a enviar:', this.createForm.value);
      this.isCreating = true;
      this.errorMessage = '';

      this.subjectService.createSubject(this.createForm.value).subscribe({
        next: () => {
          this.subjectCreated.emit();
        },
        error: (err) => {
          this.isCreating = false;
          this.errorMessage = err.error?.message || 'Error al crear la asignatura';
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
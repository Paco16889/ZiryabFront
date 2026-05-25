import { Component, effect, EventEmitter, inject, input, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../../../core/i18n/api-error.util';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { SubjectByIdResponse, SubjectsAllResponse } from '../../../../../core/models/subject';
import { CoursesAllResponse } from '../../../../../core/models/course';

/**
 * Componente que gestiona el formulario de creaci├│n de una nueva asignatura.
 * Carga los ciclos disponibles para asociar la asignatura y env├¡a los datos
 * de creaci├│n al backend tras validar el formulario.
 */
@Component({
  selector: 'app-subject-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './subject-create-form.component.html',
  styleUrl: './subject-create-form.component.scss'
})
export class SubjectCreateFormComponent {
  /** Traducciones de errores al cargar ciclos o crear la asignatura. */
  private readonly translate = inject(TranslateService);

  /** Ciclo preseleccionado al llegar desde ciclos o wizard (CURSO-140). */
  readonly preselectedIdCourse = input<number | null>(null);

    /**
   * Evento emitido cuando el usuario cancela la creaci├│n.
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
   * Indica si la petici├│n de creaci├│n est├í en curso.
   */
  isCreating = false;


  /**
   * Indica si los ciclos est├ín siendo cargados desde el backend.
   */
  isLoadingCourses = true;

    /**
   * Mensaje de error a mostrar si la creaci├│n o la carga de ciclos falla.
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
    private subjectService: SubjectService,
    private courseService: CourseService,) {
    this.createForm = this.fb.group({
  name:        ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
  grade:       ['', Validators.required],
  hours:       [null, [Validators.min(1), Validators.max(30)]],
  description: ['', Validators.maxLength(255)],
  idCourse:    ['', Validators.required]
});
    effect(() => {
      this.applyPreselectedCourse(this.preselectedIdCourse());
    });
  }

  private applyPreselectedCourse(idCourse: number | null): void {
    if (idCourse == null || this.isLoadingCourses || this.courses.length === 0) {
      return;
    }
    if (this.courses.some((c) => c.id === idCourse)) {
      this.createForm.patchValue({ idCourse });
    }
  }

  /**
   * Carga el listado de ciclos disponibles al inicializar el componente.
   */
  ngOnInit() {
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        this.courses = response.data;
        this.isLoadingCourses = false;
        this.applyPreselectedCourse(this.preselectedIdCourse());
      },
      error: (err) => {
        console.error('Error cargando ciclos:', err);
        this.errorMessage = this.translate.instant('adminPages.forms.subject.loadCoursesError');
        this.isLoadingCourses = false;
      }
    });
  }

  /**
   * Valida el formulario y env├¡a los datos al backend para crear la asignatura.
   * Si la creaci├│n es exitosa emite el evento subjectCreated.
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
          this.errorMessage = resolveApiError(this.translate, err, 'common.errors.createSubject');
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

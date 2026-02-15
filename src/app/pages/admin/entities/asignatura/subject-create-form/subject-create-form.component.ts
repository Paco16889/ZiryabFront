import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubjectServiceService } from '../../../../../core/services/admin/entities/subject-service.service';
import { CourseServiceService } from '../../../../../core/services/admin/entities/course-service.service';
import { CoursesAllResponse } from '../../../../../core/models/course';

@Component({
  selector: 'app-subject-create-form',
  imports: [ReactiveFormsModule],
  templateUrl: './subject-create-form.component.html',
  styleUrl: './subject-create-form.component.scss'
})
export class SubjectCreateFormComponent {
  @Output() cancelCreate = new EventEmitter<void>();
  @Output() subjectCreated = new EventEmitter<void>();

  createForm: FormGroup;
  courses: CoursesAllResponse['data'] = []; // ← Tipo correcto
  isCreating = false;
  isLoadingCourses = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectServiceService,
    private courseService: CourseServiceService
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      idCourse: ['', Validators.required]
    });
  }

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

  onCancel() {
    this.cancelCreate.emit();
  }
}
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubjectByIdResponse } from '../../../../core/models/subject';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoursesAllResponse } from '../../../../core/models/course';
import { SubjectServiceService } from '../../../../core/services/admin/subject-service.service';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';

@Component({
  selector: 'app-subject-edit-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './subject-edit-modal.component.html',
  styleUrl: './subject-edit-modal.component.scss'
})
export class SubjectEditModalComponent {
  @Input() subject!: SubjectByIdResponse['data'];
  @Output() closeModal = new EventEmitter<void>();
  @Output() subjectUpdated = new EventEmitter<{ id: number, name: string, idCourse: number }>();

  editForm!: FormGroup;
  courses: CoursesAllResponse['data'] = [];
  isLoadingCourses = true;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectServiceService,
    private courseService: CourseServiceService
  ) {}

  ngOnInit() {
    // Inicializa el formulario con los datos actuales
    this.editForm = this.fb.group({
      name: [this.subject.name, Validators.required],
      idCourse: [this.subject.idCourse, Validators.required]
    });

    // Carga los ciclos para el dropdown
    this.courseService.getAllCourses().subscribe({
      next: (response) => {
        this.courses = response.data;
        this.isLoadingCourses = false;
      },
      error: (err) => {
        console.error('Error cargando ciclos:', err);
        this.isLoadingCourses = false;
      }
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const formData = {
        name: this.editForm.value.name,
        idCourse: Number(this.editForm.value.idCourse)
      };

      this.subjectService.updateSubject(this.subject.id, formData).subscribe({
        next: (response) => {
          this.subjectUpdated.emit(response.data);
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}

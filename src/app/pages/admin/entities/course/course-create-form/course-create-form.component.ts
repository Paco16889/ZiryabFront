import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseServiceService } from '../../../../../core/services/admin/entities/course-service.service';

@Component({
  selector: 'app-course-create-form',
  imports: [ReactiveFormsModule],
  templateUrl: './course-create-form.component.html',
  styleUrl: './course-create-form.component.scss'
})
export class CourseCreateFormComponent {
  @Output() cancelCreate = new EventEmitter<void>();
  @Output() courseCreated = new EventEmitter<void>();

  createForm: FormGroup;
  isCreating = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private courseService: CourseServiceService
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

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

  onCancel() {
    this.cancelCreate.emit();
  }
}

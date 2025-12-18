import { Component } from '@angular/core';
import { CourseByIdResponse } from '../../../../core/models/course';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';

@Component({
  selector: 'app-course-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})

// course-detail.component.ts
export class CourseDetailComponent {
  selectedCourse: CourseByIdResponse['data'] | null = null;
  isEditModalOpen = false;
  editForm: FormGroup;

  constructor(
    private courseService: CourseServiceService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  openEditModal() {
    if (this.selectedCourse) {
      this.editForm.patchValue({ name: this.selectedCourse.name });
      this.isEditModalOpen = true;
    }
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editForm.reset();
  }

  onSubmitEdit() {
    if (this.editForm.valid && this.selectedCourse) {
      this.courseService.updateCourse(this.selectedCourse.id, this.editForm.value)
        .subscribe({
          next: (response) => {
            // Actualiza el nombre localmente sin recargar
            if (this.selectedCourse) {
              this.selectedCourse.name = response.data.name;
            }
            this.closeEditModal();
          },
          error: (err) => console.error('Error al actualizar:', err)
        });
    }
  }
}
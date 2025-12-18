import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CourseByIdResponse } from '../../../../core/models/course';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';

@Component({
  selector: 'app-course-edit-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './course-edit-modal.component.html',
  styleUrl: './course-edit-modal.component.scss'
})
export class CourseEditModalComponent implements OnInit {
  @Input() course!: CourseByIdResponse['data'];
  @Output() closeModal = new EventEmitter<void>();
  @Output() courseUpdated = new EventEmitter<{ id: number, name: string }>();

  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseServiceService
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      name: [this.course.name, Validators.required]
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.courseService.updateCourse(this.course.id, this.editForm.value)
        .subscribe({
          next: (response) => {
            this.courseUpdated.emit(response.data);
          },
          error: (err) => console.error('Error al actualizar:', err)
        });
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
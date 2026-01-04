import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentByIdResponse, StudentUpdateRequest, StudentUpdateResponse } from '../../../../core/models/student';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';

@Component({
  selector: 'app-student-edit-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './student-edit-modal.component.html',
  styleUrl: './student-edit-modal.component.scss'
})
export class StudentEditModalComponent {
  @Input() student!: StudentByIdResponse['data'];
  @Output() closeModal = new EventEmitter<void>();
  @Output() studentUpdated = new EventEmitter<StudentUpdateResponse>();

  studentToUpdate!: StudentUpdateRequest;
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentsServiceService
  ) {}

  ngOnInit() {
    const birthDateFormatted = this.student.birthDate 
      ? new Date(this.student.birthDate).toISOString().split('T')[0] 
      : '';

    this.editForm = this.fb.group({
      email: [this.student.email, [Validators.required, Validators.email]],
      name: [this.student.name, Validators.required],
      surname: [this.student.surname, Validators.required],
      ndSurname: [this.student.ndSurname, Validators.required],
      birthDate: [birthDateFormatted, Validators.required],
      dni: [this.student.dni, [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]]
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      this.studentToUpdate = {
        id: this.student.id,
        email: this.editForm.value.email,
        name: this.editForm.value.name,
        surname: this.editForm.value.surname,
        ndSurname: this.editForm.value.ndSurname,
        birthDate: this.editForm.value.birthDate,
        dni: this.editForm.value.dni
      };

      this.studentService.updateStudent(this.studentToUpdate).subscribe({
        next: (response) => {
          this.studentUpdated.emit(response);
        },
        error: (error) => console.error('Error al actualizar:', error)
      });
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}

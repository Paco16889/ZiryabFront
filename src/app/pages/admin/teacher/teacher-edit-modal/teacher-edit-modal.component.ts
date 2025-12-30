import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeacherByIdResponse, TeacherUpdateRequest, TeacherUpdateResponse } from '../../../../core/models/teacher';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeachersServiceService } from '../../../../core/services/admin/teachers-service.service';

@Component({
  selector: 'app-teacher-edit-modal',
  imports: [ ReactiveFormsModule],
  templateUrl: './teacher-edit-modal.component.html',
  styleUrl: './teacher-edit-modal.component.scss'
})
export class TeacherEditModalComponent {


      @Input() teacher!: TeacherByIdResponse['data'];
      @Output() closeModal = new EventEmitter<void>();
      @Output() teacherUpdated = new EventEmitter<TeacherUpdateResponse>();

      teacherToUpdate!: TeacherUpdateRequest;
      editForm!: FormGroup;

      constructor(
                  private fb: FormBuilder,
                  private teacherService: TeachersServiceService
                  ) {}

       ngOnInit() {
    // Convierte la fecha de formato ISO a YYYY-MM-DD para el input date
    const birthDateFormatted = this.teacher.birthDate 
      ? new Date(this.teacher.birthDate).toISOString().split('T')[0] 
      : '';

    this.editForm = this.fb.group({
      email: [this.teacher.email, [Validators.required, Validators.email]],
      name: [this.teacher.name, Validators.required],
      surname: [this.teacher.surname, Validators.required],
      ndSurname: [this.teacher.ndSurname, Validators.required],
      birthDate: [birthDateFormatted, Validators.required],
      dni: [this.teacher.dni, [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]]
    });
  }

   onSubmit() {
    if (this.editForm.valid) {
      this.teacherToUpdate = {
        id: this.teacher.id,
        email: this.editForm.value.email,
        name: this.editForm.value.name,
        surname: this.editForm.value.surname,
        ndSurname: this.editForm.value.ndSurname,
        birthDate: this.editForm.value.birthDate,
        dni: this.editForm.value.dni
      };

      this.teacherService.updateTeacher(this.teacherToUpdate).subscribe({
        next: (response) => {
          this.teacherUpdated.emit(response);
        },
        error: (error) => console.error('Error al actualizar:', error)
      });
    }
  }

  onClose() {
    this.closeModal.emit();
  }

}

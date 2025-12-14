import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  imports: [ReactiveFormsModule],
  styleUrls: ['./student-register.component.scss']
})
export class StudentRegisterComponent implements OnInit {
  formRegister!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      ndSurname: [''],
      birthDate: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]],
      role: ['student', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.formRegister.valid) {
      const studentData = {
        ...this.formRegister.value,
        birthDate: new Date(this.formRegister.value.birthDate)
      };
      
      console.log('Datos del estudiante:', studentData);
      // Aquí harías la llamada al servicio para registrar
      // this.studentService.register(studentData).subscribe(...)
    }
  }
}
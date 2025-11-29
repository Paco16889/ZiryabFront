import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports:[ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  formRegister: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      ndSurname: [''],
      fechaNacimiento: ['', Validators.required],
      dni: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.formRegister.invalid) return;

    console.log('Datos:', this.formRegister.value);
  }
}

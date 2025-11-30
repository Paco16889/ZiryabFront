import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delete.component.html'
})
export class DeleteComponent {

  // Formulario reactivo
  formSearch: FormGroup;

  constructor(private fb: FormBuilder) {
    // Inicializamos el formulario con un solo control: criteria
    this.formSearch = this.fb.group({
      criteria: ['']  // valor inicial vacío
    });
  }

  // onSubmit simple: solo muestra el criterio seleccionado
  onSubmit() {
    if (this.formSearch.invalid) return;

    console.log('Criterio seleccionado:', this.formSearch.value.criteria);
  }
}

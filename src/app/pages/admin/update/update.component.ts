import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update.component.html'
})
export class UpdateComponent {

  // Formulario reactivo
  formSearch: FormGroup;

  constructor(private fb: FormBuilder) {
    // Inicializamos el formulario con un solo control: criteria
    this.formSearch = this.fb.group({
      criteria: ['']  // valor inicial vacío
    });
  }
  showResult = false;  // controla si se muestra el bloque
  studentResult = {
  email: 'ejemplo@email.com',
  name: 'Juan',
  surname: 'Pérez',
  ndSurname: 'Gómez',
  fechaNacimiento: '2000-01-01',
  dni: '12345678A'
  };

  // onSubmit simple: solo muestra el criterio seleccionado
  onSubmit() {
    if (this.formSearch.invalid) return;
    this.showResult = true;
      //aqui deberia llamar al servicio que busca por el criterio selecionado lanzando el tipo de criterio y el valor
    console.log('Criterio seleccionado:', this.formSearch.value.criteria);
  }
}
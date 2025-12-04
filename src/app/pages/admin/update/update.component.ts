import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BotonEditComponent } from '../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../boton-viewdetail/boton-viewdetail.component';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent],
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
//hacer request by id del item selecionado y mostrar sus campos en inputs modificables**
  // onSubmit simple: solo muestra el criterio seleccionado
  onSubmit() {
    if (this.formSearch.invalid) return;
    this.showResult = true;
      //aqui deberia llamar al servicio que busca por el criterio selecionado lanzando el tipo de criterio y el valor
    console.log('Criterio seleccionado:', this.formSearch.value.criteria);
  }
}

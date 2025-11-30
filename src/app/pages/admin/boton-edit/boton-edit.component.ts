import { Component } from '@angular/core';

@Component({
  selector: 'app-boton-edit',
  imports: [],
  templateUrl: './boton-edit.component.html',
  styleUrl: './boton-edit.component.scss'
})
export class BotonEditComponent {
  onClick(){
    console.log('has hecho click en el boton');
  }

  /*editField(str: string){
    console.log(`estas editando el campo ${str}.`);
  }*/
}

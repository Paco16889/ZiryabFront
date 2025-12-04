import { Component } from '@angular/core';

@Component({
  selector: 'app-boton-delete',
  imports: [],
  templateUrl: './boton-delete.component.html',
  styleUrl: './boton-delete.component.scss'
})
export class BotonDeleteComponent {
  onClick(){
    console.log('Has hecho click enel boton de borrar');
  }
}

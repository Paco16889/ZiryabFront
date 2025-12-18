import { Component } from '@angular/core';

@Component({
  selector: 'app-boton-close',
  imports: [],
  templateUrl: './boton-close.component.html',
  styleUrl: './boton-close.component.scss'
})
export class BotonCloseComponent {


  onClick(){
    console.log('clic en boton close');
  }
}

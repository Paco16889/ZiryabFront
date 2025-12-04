import { Component } from '@angular/core';

@Component({
  selector: 'app-boton-viewdetail',
  imports: [],
  templateUrl: './boton-viewdetail.component.html',
  styleUrl: './boton-viewdetail.component.scss'
})
export class BotonViewdetailComponent {

  onClick() {
    console.log('Has apretado el boton de ver detalle');
  }
}

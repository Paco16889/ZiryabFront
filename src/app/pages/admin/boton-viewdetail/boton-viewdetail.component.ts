import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-boton-viewdetail',
  imports: [],
  templateUrl: './boton-viewdetail.component.html',
  styleUrl: './boton-viewdetail.component.scss'
})
export class BotonViewdetailComponent {
  @Input() id!: number;
  @Output() showDetail = new EventEmitter<number>();

  onClick() {
    console.log(`has apretado el boton de ver detalle del alumno con id ${this.id}`);
    this.showDetail.emit(this.id); 
  }
}

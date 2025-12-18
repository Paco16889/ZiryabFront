import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-boton-delete',
  imports: [],
  templateUrl: './boton-delete.component.html',
  styleUrl: './boton-delete.component.scss'
})
export class BotonDeleteComponent {
  @Input() id!: number;
  @Output() showDelete = new EventEmitter<number>();
  
  onClick(){
    this.showDelete.emit(this.id);
    console.log('Has hecho click enel boton de borrar');
  }
}

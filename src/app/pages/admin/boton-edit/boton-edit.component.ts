import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-boton-edit',
  imports: [],
  templateUrl: './boton-edit.component.html',
  styleUrl: './boton-edit.component.scss'
})
export class BotonEditComponent {



  @Input() id!: number;
  @Output() showEdit = new EventEmitter<number>();

  
  onClick(){
    this.showEdit.emit(this.id);
    console.log('has hecho click en el boton de editar');
  }

  /*editField(str: string){
    console.log(`estas editando el campo ${str}.`);
  }*/
}

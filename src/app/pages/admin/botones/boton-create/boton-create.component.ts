import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';



@Component({
  selector: 'app-boton-create',
  imports: [],
  templateUrl: './boton-create.component.html',
  styleUrl: './boton-create.component.scss'
})
export class BotonCreateComponent {
  
  @Input() label: string = 'Crear';

  // generic-create-button.component.ts
@Output() clickAction = new EventEmitter<void>();



handleClick() {
  this.clickAction.emit();
}
}

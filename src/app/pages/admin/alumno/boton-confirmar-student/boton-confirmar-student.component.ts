import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Student } from '../../../../core/models/student';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-boton-confirmar-student',
  imports: [TranslateModule],
  templateUrl: './boton-confirmar-student.component.html',
  styleUrl: './boton-confirmar-student.component.scss'
})
export class BotonConfirmarStudentComponent {

  @Input() disabled: boolean = false;
  @Output() confirm = new EventEmitter<void>();

  
  
  

  confirmSelection() {
    if (!this.disabled) {
      
      this.confirm.emit();
    }
  }
}

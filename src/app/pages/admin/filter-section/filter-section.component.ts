import { Component } from '@angular/core';
import { BotonCreateComponent } from '../botones/boton-create/boton-create.component';
import { BotonConfirmarStudentComponent } from "../botones/boton-confirmar-student/boton-confirmar-student.component";


@Component({
  selector: 'app-filter-section',
  imports: [ BotonConfirmarStudentComponent],
  templateUrl: './filter-section.component.html',
  styleUrl: './filter-section.component.scss'
})
export class FilterSectionComponent {
  
}

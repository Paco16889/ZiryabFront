import { Component } from '@angular/core';
import { FloatMenuService } from '../../../core/services/float-menu.service';
import { StudentRegisterComponent } from '../student-register/student-register.component';
import { MatricularAlumnoComponent } from '../matricular-alumno/matricular-alumno.component';

@Component({
  selector: 'app-float-menu',
  imports: [StudentRegisterComponent, MatricularAlumnoComponent],
  templateUrl: './float-menu.component.html',
  styleUrl: './float-menu.component.scss'
})
export class FloatMenuComponent {
  constructor(public floatMenuservice:FloatMenuService) {}
}

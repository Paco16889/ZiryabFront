import { Component, Input } from '@angular/core';
import { Subject } from '../../../core/models/subject';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que muestra los datos básicos de una asignatura.
 * Pendiente de revisar su integración en ClasesComponent para modularizar la vista.
 */
@Component({
  selector: 'app-subject',
  imports: [TranslateModule],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss'
})
export class SubjectComponent {
  /**
   * Asignatura cuyos datos se muestran en el componente.
   */
    @Input() subject!: Subject;
}

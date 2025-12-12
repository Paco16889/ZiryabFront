import { Component, Input } from '@angular/core';
import { Subject } from '../../../../core/models/subject';

@Component({
  selector: 'app-asignatura-view-detail',
  imports: [],
  templateUrl: './asignatura-view-detail.component.html',
  styleUrl: './asignatura-view-detail.component.scss'
})
export class AsignaturaViewDetailComponent {
  @Input() subject!: Subject;
}

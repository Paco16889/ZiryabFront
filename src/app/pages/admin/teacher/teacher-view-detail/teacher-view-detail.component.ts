import { Component, Input } from '@angular/core';
import { Subject } from '../../../../core/models/subject';

@Component({
  selector: 'app-teacher-view-detail',
  imports: [],
  templateUrl: './teacher-view-detail.component.html',
  styleUrl: './teacher-view-detail.component.scss'
})
export class TeacherViewDetailComponent {
  @Input() subject!: Subject;
}

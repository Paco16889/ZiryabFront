import { Component, Input } from '@angular/core';

import { Teacher } from '../../../../core/models/teacher';

@Component({
  selector: 'app-teacher-view-detail',
  imports: [],
  templateUrl: './teacher-view-detail.component.html',
  styleUrl: './teacher-view-detail.component.scss'
})
export class TeacherViewDetailComponent {
  @Input() teacher!: Teacher;
}

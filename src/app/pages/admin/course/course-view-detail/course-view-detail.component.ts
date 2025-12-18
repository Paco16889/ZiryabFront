import { Component, Input } from '@angular/core';
import { Course } from '../../../../core/models/course';

@Component({
  selector: 'app-course-view-detail',
  imports: [],
  templateUrl: './course-view-detail.component.html',
  styleUrl: './course-view-detail.component.scss'
})
export class CourseViewDetailComponent {
 @Input() course!: Course;
}

import { Component } from '@angular/core';
import { CourseListItemComponent } from '../course-list-item/course-list-item.component';
import { Course } from '../../../../core/models/course';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';

@Component({
  selector: 'app-course-list',
  imports: [CourseListItemComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent {
    courses: Course[] = []
    
      constructor(private courseService: CourseServiceService){}
    
      ngOnInit():void {
        this.courseService.getCourses().subscribe({
          next: (data) => {
            console.log('Asignaturas:' ,data);
            this.courses = data;
          },
           error: (err) => console.error(err)
        });
      }
}

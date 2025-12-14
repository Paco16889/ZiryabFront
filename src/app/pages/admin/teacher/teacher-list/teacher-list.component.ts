import { Component } from '@angular/core';
import { Teacher } from '../../../../core/models/teacher';
import { TeachersServiceService } from '../../../../core/services/admin/teachers-service.service';
import { TeacherListItemComponent } from '../teacher-list-item/teacher-list-item.component';

@Component({
  selector: 'app-teacher-list',
  imports: [TeacherListItemComponent],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss'
})
export class TeacherListComponent {
    teachers: Teacher[] = [];
    constructor(private teacherService: TeachersServiceService){}
  
    ngOnInit():void {
      this.teacherService.getTeachers().subscribe({
        next: (data) => {
          console.log('Profesores recibidos', data);
          this.teachers = data;
        },
        error: (err) => console.error(err)
      });
    }
}

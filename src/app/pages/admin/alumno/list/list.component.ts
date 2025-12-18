import { Component, OnInit } from '@angular/core';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';
import { Student } from '../../../../core/models/student';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'app-list',
  imports: [ListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  students: Student[] = [];
  constructor(private studentService: StudentsServiceService){}

  ngOnInit():void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        console.log('Estudiantes recibidos', data);
        this.students = data;
      },
      error: (err) => console.error(err)
    });
  }
}

import { Component } from '@angular/core';
import { Student } from '../../../../core/models/student';

@Component({
  selector: 'app-view-detail',
  imports: [],
  templateUrl: './view-detail.component.html',
  styleUrl: './view-detail.component.scss'
})
export class ViewDetailComponent {
  student!: Student;
}

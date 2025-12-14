import { Component, Input } from '@angular/core';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { Course } from '../../../../core/models/course';

@Component({
  selector: 'app-course-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent],
  templateUrl: './course-list-item.component.html',
  styleUrl: './course-list-item.component.scss'
})
export class CourseListItemComponent {
   @Input() course!:Course;

  toggleDetail($event: number) {
    throw new Error('Method not implemented.');
  }
}

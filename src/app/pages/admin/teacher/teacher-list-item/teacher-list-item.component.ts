import { Component, Input } from '@angular/core';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { Teacher } from '../../../../core/models/teacher';
import { TeacherViewDetailComponent } from '../teacher-view-detail/teacher-view-detail.component';

@Component({
  selector: 'app-teacher-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent],
  templateUrl: './teacher-list-item.component.html',  
  styleUrl: './teacher-list-item.component.scss'
})
export class TeacherListItemComponent {
toggleDetail($event: number) {
throw new Error('Method not implemented.');
}
  @Input() teacher!: Teacher;

  selectedTeacher: Teacher | null = null;


}

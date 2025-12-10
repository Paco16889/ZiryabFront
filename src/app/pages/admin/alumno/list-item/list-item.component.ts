import { Component, Input } from '@angular/core';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { Student } from '../../../../core/models/student';

@Component({
  selector: 'app-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent {
  @Input() student!: Student;
  
}

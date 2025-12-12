import { Component, Input } from '@angular/core';
import { Subject } from '../../../../core/models/subject';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';

@Component({
  selector: 'app-asignatura-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent],
  templateUrl: './asignatura-list-item.component.html',
  styleUrl: './asignatura-list-item.component.scss'
})
export class AsignaturaListItemComponent {
   @Input() subject!:Subject;

  toggleDetail($event: number) {
    throw new Error('Method not implemented.');
  }
}

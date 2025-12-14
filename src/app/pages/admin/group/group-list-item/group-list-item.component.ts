import { Component, Input } from '@angular/core';
import { Group } from '../../../../core/models/group';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';

@Component({
  selector: 'app-group-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent],
  templateUrl: './group-list-item.component.html',
  styleUrl: './group-list-item.component.scss'
})
export class GroupListItemComponent {
   @Input() group!:Group;

  toggleDetail($event: number) {
    throw new Error('Method not implemented.');
  }
}

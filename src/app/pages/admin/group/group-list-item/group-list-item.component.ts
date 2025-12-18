import { Component, Input } from '@angular/core';
import { Group } from '../../../../core/models/group';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { GroupViewDetailComponent } from '../group-view-detail/group-view-detail.component';
import { HttpClient } from '@angular/common/http';
import { GroupServiceService } from '../../../../core/services/admin/group-service.service';

@Component({
  selector: 'app-group-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, GroupViewDetailComponent],
  templateUrl: './group-list-item.component.html',
  styleUrl: './group-list-item.component.scss'
})
export class GroupListItemComponent {
   @Input() group!:Group;

   selectedGroup: Group | null = null;
  constructor(private groupService: GroupServiceService){}


  toggleDetail(groupId: number) {
      console.log('toggleDetail llamado con id:', groupId);
    if (this.selectedGroup?.id === groupId) {
      this.selectedGroup = null; // cerrar detalle si ya estaba abierto
    } else {
      // Llamada al servicio para obtener el estudiante por id
      this.groupService.getGroupById(groupId).subscribe({
        
        next: data => this.selectedGroup = data,
        error: err => console.error(err)
      });
      console.log('estoy dentro de toggleDetail en el else', this.selectedGroup?.id);
    }
  }
}

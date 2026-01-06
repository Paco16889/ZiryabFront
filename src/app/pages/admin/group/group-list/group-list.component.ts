import { Component } from '@angular/core';
import { GroupListItemComponent } from '../group-list-item/group-list-item.component';
import { Group } from '../../../../core/models/group';
import { GroupServiceService } from '../../../../core/services/admin/group-service.service';
import { GroupCreateFormComponent } from '../group-create-form/group-create-form.component';
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";

@Component({
  selector: 'app-group-list',
  imports: [GroupListItemComponent, GroupCreateFormComponent, BotonCreateComponent],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss'
})
export class GroupListComponent {

  groups: Group[] = [];
  showCreateForm = false;
    
      constructor(private groupService: GroupServiceService){}
    
      ngOnInit():void {
        this.loadGroups();
      }

      loadGroups(){
        this.groupService.getGroups().subscribe({
          next: (data) => {
            console.log('Asignaturas:' ,data);
            this.groups = data;
          },
           error: (err) => console.error(err)
        });
      }

        openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onGroupCreated() {
    this.closeCreateForm();
    this.loadGroups(); // Recarga la lista
  }
  onGroupDeleted(deletedCourseId: number){
    this.loadGroups();
  }

  onGroupUpdated(updatedCourseId: number) {
    this.loadGroups();
}
}

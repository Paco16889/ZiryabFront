import { Component } from '@angular/core';
import { GroupListItemComponent } from '../group-list-item/group-list-item.component';
import { Group } from '../../../../core/models/group';
import { GroupServiceService } from '../../../../core/services/admin/group-service.service';

@Component({
  selector: 'app-group-list',
  imports: [GroupListItemComponent],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss'
})
export class GroupListComponent {
  groups: Group[] = []
    
      constructor(private groupService: GroupServiceService){}
    
      ngOnInit():void {
        this.groupService.getGroups().subscribe({
          next: (data) => {
            console.log('Asignaturas:' ,data);
            this.groups = data;
          },
           error: (err) => console.error(err)
        });
      }
}

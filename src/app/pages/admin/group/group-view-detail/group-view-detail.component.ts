import { Component, Input } from '@angular/core';
import { Group } from '../../../../core/models/group';

@Component({
  selector: 'app-group-view-detail',
  imports: [],
  templateUrl: './group-view-detail.component.html',
  styleUrl: './group-view-detail.component.scss'
})
export class GroupViewDetailComponent {
  @Input() group!: Group;
}

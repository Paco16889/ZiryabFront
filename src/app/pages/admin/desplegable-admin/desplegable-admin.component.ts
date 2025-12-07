import { Component } from '@angular/core';
import { ToggleService } from '../../../core/services/toggle.service';
import { FilterSectionComponent } from '../filter-section/filter-section.component';
import { ListItemComponent } from '../list-item/list-item.component';
import { FloatMenuComponent } from '../float-menu/float-menu.component';

@Component({
  selector: 'app-desplegable-admin',
  imports: [ListItemComponent, FloatMenuComponent],
  templateUrl: './desplegable-admin.component.html',
  styleUrl: './desplegable-admin.component.scss'
})
export class DesplegableAdminComponent {

  constructor(public toggleservice: ToggleService){

  }
  //openedMenu = this.toggleservice.openedMenu();
  
  
}

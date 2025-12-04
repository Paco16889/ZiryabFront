import { Component } from '@angular/core';
import { ToggleService } from '../../../core/services/toggle.service';
import { FilterSectionComponent } from '../filter-section/filter-section.component';

@Component({
  selector: 'app-desplegable-admin',
  imports: [],
  templateUrl: './desplegable-admin.component.html',
  styleUrl: './desplegable-admin.component.scss'
})
export class DesplegableAdminComponent {

  constructor(public toggleservice: ToggleService){

  }
  //openedMenu = this.toggleservice.openedMenu();
  
  
}

import { Component } from '@angular/core';
import { DesplegableAdminComponent } from '../desplegable-admin/desplegable-admin.component';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { FilterSectionComponent } from '../filter-section/filter-section.component';

@Component({
  selector: 'app-dashboard-admin',
  imports: [ AdminMenuComponent, DesplegableAdminComponent, FilterSectionComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent {
  
  
  

 

  
}

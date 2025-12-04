import { Component } from '@angular/core';
import { DesplegableAdminComponent } from '../desplegable-admin/desplegable-admin.component';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';

@Component({
  selector: 'app-dashboard-admin',
  imports: [ AdminMenuComponent, DesplegableAdminComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent {
  
  openedMenu : string | null = null;
  

 

  toggle(menu: string){
    if (this.openedMenu === menu) {
      this.openedMenu = null;
    } else{
      this.openedMenu = menu;
    }
    
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-desplegable-admin',
  imports: [],
  templateUrl: './desplegable-admin.component.html',
  styleUrl: './desplegable-admin.component.scss'
})
export class DesplegableAdminComponent {

  openedMenu: string | null = null;
  
  toggle(menu: string){
    if (this.openedMenu === menu) {
      this.openedMenu = null;
    } else{
      this.openedMenu = menu;
    }
    
  }
}

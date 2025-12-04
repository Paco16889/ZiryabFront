import { Component } from '@angular/core';
import { DesplegableAdminComponent } from '../desplegable-admin/desplegable-admin.component';

@Component({
  selector: 'app-admin-menu',
  imports: [],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss'
})
export class AdminMenuComponent {
  openedMenu: string | null = null;
  desplegable = new DesplegableAdminComponent();

  onClick(){
    this.desplegable.toggle('students');
  }

  
}

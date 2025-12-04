import { Component } from '@angular/core';
import { DesplegableAdminComponent } from '../desplegable-admin/desplegable-admin.component';
import { ToggleService } from '../../../core/services/toggle.service';

@Component({
  selector: 'app-admin-menu',
  imports: [],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss'
})
export class AdminMenuComponent {
  openedMenu: string | null = null;
  constructor(private toggle: ToggleService){}

  onClick(str: string){
    this.toggle.toggle(str);
    console.log(`Has pinchado en ${str}`);
  }

}

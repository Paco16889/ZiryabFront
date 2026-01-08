import { Component } from '@angular/core';
import { DesplegableAdminComponent } from '../desplegable-admin/desplegable-admin.component';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { FilterSectionComponent } from '../filter-section/filter-section.component';
import { BotonHamburguesaComponent } from "../botones/boton-hamburguesa/boton-hamburguesa.component";
import { BotonAtrasComponent } from "../../shared/boton-atras/boton-atras.component";


@Component({
  selector: 'app-dashboard-admin',
  imports: [AdminMenuComponent, DesplegableAdminComponent, FilterSectionComponent, BotonHamburguesaComponent, BotonAtrasComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent {
  
  menuMobileOpen = false;
  
abrirMenuMobile() {
  this.menuMobileOpen = true;
}

cerrarMenuMobile() {
  this.menuMobileOpen = false;
}




  
}

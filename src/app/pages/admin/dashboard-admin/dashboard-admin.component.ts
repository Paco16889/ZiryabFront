import { Component } from '@angular/core';
import { DesplegableAdminComponent } from '../desplegable-admin/desplegable-admin.component';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { FilterSectionComponent } from '../filter-section/filter-section.component';
import { BotonHamburguesaComponent } from "../botones/boton-hamburguesa/boton-hamburguesa.component";
import { BotonAtrasComponent } from "../../shared/boton-atras/boton-atras.component";

/**
 * Componente contenedor del panel de administración.
 * Orquesta el layout general combinando el menú lateral de navegación
 * y el área de contenido principal donde DesplegableAdminComponent
 * muestra los datos según la sección activa.
 * En dispositivos móviles el menú lateral se sustituye por un menú hamburguesa.
 */
@Component({
  selector: 'app-dashboard-admin',
  imports: [AdminMenuComponent, DesplegableAdminComponent, FilterSectionComponent, BotonHamburguesaComponent, BotonAtrasComponent],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.scss'
})
export class DashboardAdminComponent {
  
  /**
   * Controla la visibilidad del menú de navegación en dispositivos móviles.
   */
  menuMobileOpen = false;
  
  /**
   * Abre el menú de navegación en dispositivos móviles.
   */
abrirMenuMobile() {
  this.menuMobileOpen = true;
}

/**
   * Cierra el menú de navegación en dispositivos móviles.
   */
cerrarMenuMobile() {
  this.menuMobileOpen = false;
}




  
}

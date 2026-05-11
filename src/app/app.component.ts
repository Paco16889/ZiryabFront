import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterOutlet } from '@angular/router';
// Importaciones de tus componentes
import { HeaderComponent } from './pages/shared/header/header.component';
import { FooterComponent } from './pages/shared/footer/footer.component';
import { PerfilComponent } from './pages/shared/perfil/perfil.component'; 
// Importación del servicio
import { PerfilMenuService } from './core/services/perfil-menu.service'; 
import { TranslateService } from '@ngx-translate/core';
import { GenericDeleteModalComponent } from "./pages/admin/modales/generic-delete-modal/generic-delete-modal.component";
import { ModalDeleteService } from './core/services/UI/modal-delete.service';
import { ModalEditService } from './core/services/UI/modal-edit.service';
import { GenericEditModalComponent } from "./pages/admin/modales/generic-edit-modal/generic-edit-modal.component";


/**
 * Componente raíz de la aplicación.
 * Inicializa el sistema de traducciones, gestiona la visibilidad
 * del menú de perfil y los modales globales de eliminación y edición.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    PerfilComponent,
    GenericDeleteModalComponent,
    GenericEditModalComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

   /**
   * Título de la aplicación.
   * Pendiente de actualizar desde el nombre por defecto del proyecto.
   */
  title = 'Ziryab';

    /**
   * Servicio de traducción inyectado para la inicialización del sistema i18n.
   */
  private translate = inject(TranslateService);

   /**
   * Inicializa el componente raíz de la aplicación.
   * @param perfilService - Servicio para gestionar el menú de perfil
   * @param deleteModalService - Servicio para gestionar el modal global de eliminación
   * @param updateModalService - Servicio para gestionar el modal global de edición
   */
  constructor(public perfilService: PerfilMenuService,
    public deleteModalService: ModalDeleteService,
    public updateModalService: ModalEditService
  ) {
    this.translate.addLangs(['es', 'en', 'de']);
    // Idioma de fallback
    this.translate.setFallbackLang('es');
    
    // Idioma inicial: leer de localStorage o usar 'es' por defecto
    const savedLang = localStorage.getItem('lang') || 'es';
    this.translate.use(savedLang);
  } 
  //seguridad antonio
}
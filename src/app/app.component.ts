import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterOutlet } from '@angular/router';
// Importaciones de tus componentes
import { HeaderComponent } from './pages/shared/header/header.component';
import { FooterComponent } from './pages/shared/footer/footer.component';
import { PerfilComponent } from './pages/shared/perfil/perfil.component'; 
// Importación del servicio
import { PerfilMenuService } from './core/services/perfilService.service'; 
import { TranslateService } from '@ngx-translate/core';
import { GenericDeleteModalComponent } from "./pages/admin/modales/generic-delete-modal/generic-delete-modal.component";
import { ModalDeleteServiceService } from './core/services/UI/modal-delete-service.service';
import { ModalEditServiceService } from './core/services/UI/modal-edit-service.service';
import { GenericEditModalComponent } from "./pages/admin/modales/generic-edit-modal/generic-edit-modal.component";

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
  title = 'loginEnAngular';
  private translate = inject(TranslateService);

  constructor(public perfilService: PerfilMenuService,
    public deleteModalService: ModalDeleteServiceService,
    public updateModalService: ModalEditServiceService
  ) {
    this.translate.addLangs(['es', 'en', 'de']);
    // Idioma de fallback
    this.translate.setFallbackLang('es');
    // Idioma inicial
    this.translate.use('es');
  } 
}
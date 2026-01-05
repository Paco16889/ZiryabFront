import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterOutlet } from '@angular/router';
// Importaciones de tus componentes
import { HeaderComponent } from './pages/shared/header/header.component';
import { FooterComponent } from './pages/shared/footer/footer.component';
import { PerfilComponent } from './pages/shared/perfil/perfil.component'; 
// Importación del servicio
import { PerfilMenuService } from './core/services/perfilService.service'; 
import { BotonAtrasComponent } from './pages/shared/boton-atras/boton-atras.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent, 
    PerfilComponent,
    BotonAtrasComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'loginEnAngular';
  private translate = inject(TranslateService);

  constructor(public perfilService: PerfilMenuService) {
    this.translate.addLangs(['es', 'en']);
    // Idioma de fallback
    this.translate.setFallbackLang('es');
    // Idioma inicial
    this.translate.use('es');
  } 
}
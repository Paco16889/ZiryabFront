import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que representa el pie de página de la aplicación.
 * Muestra el enlace a la página de información y los accesos
 * al repositorio de GitHub y la documentación en Confluence.
 */
@Component({
  selector: 'app-footer',
  standalone: true, 
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
}
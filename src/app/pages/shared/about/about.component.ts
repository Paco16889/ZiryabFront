import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que muestra la página de información sobre la aplicación.
 * Incluye descripción del proyecto, stack tecnológico y equipo de desarrollo.
 * Todo el contenido está gestionado mediante el sistema de traducciones.
 */
@Component({
  selector: 'app-about',
  imports: [TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}

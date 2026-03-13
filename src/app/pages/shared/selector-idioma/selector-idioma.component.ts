import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Componente que permite al usuario cambiar el idioma de la aplicación.
 * Persiste la selección en localStorage para mantenerla entre sesiones.
 */
@Component({
  selector: 'app-selector-idioma',
  imports: [],
  templateUrl: './selector-idioma.component.html',
  styleUrl: './selector-idioma.component.scss'
})
/**
 * Componente que permite al usuario cambiar el idioma de la aplicación.
 * 
 * Utiliza el servicio de traducción para establecer el idioma activo
 * y guarda la preferencia del usuario en localStorage para mantenerla
 * entre sesiones.
 */
export class SelectorIdiomaComponent {

   /**
   * @param translate - Servicio de traducción para cambiar el idioma activo
   */
  constructor(private translate: TranslateService) {}

   /**
   * Cambia el idioma activo de la aplicación y lo persiste en localStorage.
   * @param lang - Código del idioma a activar: 'es', 'en' o 'de'
   */
  cambiarIdioma(lang: 'es' | 'en' | 'de') {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}

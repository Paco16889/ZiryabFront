import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-selector-idioma',
  imports: [],
  templateUrl: './selector-idioma.component.html',
  styleUrl: './selector-idioma.component.scss'
})
export class SelectorIdiomaComponent {
  constructor(private translate: TranslateService) {}

  cambiarIdioma(lang: 'es' | 'en') {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}

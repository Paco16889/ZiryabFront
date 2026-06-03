import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { BotonAtrasComponent } from '../boton-atras/boton-atras.component';

/**
 * Pantalla de calendario académico mediante Google Calendar embebido.
 * Usa la URL pública de embed (no requiere iniciar sesión en Google si el calendario
 * está compartido como «Disponible públicamente» en la configuración de Google Calendar).
 */
@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [TranslateModule, BotonAtrasComponent],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss',
})
export class CalendarioComponent {
  /** Sanitizador necesario para permitir el `iframe` de Google Calendar. */
  private sanitizer = inject(DomSanitizer);

  /** URL segura del calendario público configurado en environment. */
  readonly calendarUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    environment.googleCalendar.embedUrl,
  );
}

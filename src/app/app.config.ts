import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { authInterceptorFn } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';

import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';


/**
 * Configuración principal de la aplicación.
 * Registra los providers globales: router, cliente HTTP con interceptor de autenticación,
 * Firebase Authentication y el sistema de traducciones.
 */


/**
 * Configuración de Firebase.
 * ATENCIÓN: las credenciales deberían cargarse desde variables de entorno
 * en lugar de estar hardcodeadas en el fichero.
 */
const firebaseConfig = {
  apiKey: "AIzaSyADRm1ot81xIDrrW3iKu6ywdAd8NR1G0gA",
  authDomain: "ziryab-7006e.firebaseapp.com",
  projectId: "ziryab-7006e",
  storageBucket: "ziryab-7006e.firebasestorage.app",
  messagingSenderId: "708163806772",
  appId: "1:708163806772:web:274c85353970b612c14c61",
  measurementId: "G-WNWVENZL8X"
};

/**
 * Configuración de providers de la aplicación.
 * - ZoneChangeDetection con eventCoalescing para optimizar la detección de cambios
 * - Router con las rutas de la aplicación
 * - HttpClient con el interceptor de autenticación JWT
 * - Firebase con autenticación
 * - Sistema de traducciones con español como idioma por defecto,
 *   cargando los ficheros JSON desde /assets/i18n/
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptorFn])
    ),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/', // Ruta de tus JSON
        suffix: '.json'          // Extensión de los archivos
      }),
      fallbackLang: 'es',        // Idioma por defecto si no encuentra traducción
      lang: 'es'                 // Idioma inicial
    }),
  ],
};
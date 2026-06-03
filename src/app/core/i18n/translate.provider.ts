// core/i18n/translate.provider.ts
import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Proveedor de internacionalización para la aplicación.
 * Configura el módulo de traducción con español como idioma por defecto
 * y carga los ficheros de traducción desde la carpeta assets/i18n en formato JSON.
 * @example
 * // Uso en app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTranslate()
 *   ]
 * };
 */
export function provideTranslate() {
  return importProvidersFrom(
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: 'TRANSLATE_LOADER', // aquí se usa cualquier token compatible
        useFactory: () => provideTranslateHttpLoader({ prefix: '/assets/i18n/', suffix: '.json' }),
        deps: [provideHttpClient] 
      }
    })
  );
}

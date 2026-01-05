// core/i18n/translate.provider.ts
import { importProvidersFrom } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

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

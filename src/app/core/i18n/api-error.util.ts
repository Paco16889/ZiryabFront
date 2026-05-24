import { TranslateService } from '@ngx-translate/core';

type HttpErrorLike = {
  error?: { code?: string; message?: string };
  message?: string;
};

/**
 * Prioriza traducción por `code` del API; si no hay, mensaje del backend o clave i18n.
 */
export function resolveApiError(
  translate: TranslateService,
  err: unknown,
  fallbackKey: string,
): string {
  const e = err as HttpErrorLike;
  const code = e?.error?.code;
  if (code) {
    const key = `apiErrors.${code}`;
    const translated = translate.instant(key);
    if (translated && translated !== key) {
      return translated;
    }
  }
  const backend = e?.error?.message?.trim();
  if (backend) {
    return backend;
  }
  const generic = e?.message?.trim();
  if (generic && !generic.startsWith('Http failure')) {
    return generic;
  }
  return translate.instant(fallbackKey);
}

import { TranslateService } from '@ngx-translate/core';

/** Forma mínima de los errores HTTP que usan los componentes para mostrar mensajes. */
type HttpErrorLike = {
  /** Cuerpo opcional devuelto por el backend. */
  error?: { code?: string; message?: string };

  /** Mensaje genérico del cliente HTTP cuando no hay cuerpo de backend. */
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

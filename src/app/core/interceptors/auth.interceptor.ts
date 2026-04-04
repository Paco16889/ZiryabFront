import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional que habilita el envío de cookies en las peticiones HTTP salientes.
 * Compatible con Angular 19+.
 * Excluye automáticamente las peticiones a ficheros estáticos y JSON de assets.
 * @param req - La petición HTTP interceptada
 * @param next - Manejador para continuar la cadena de interceptores
 * @returns La petición original si es un asset, o la petición clonada con credenciales activadas.
 * @example
 * // Registro en app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(
 *       withInterceptors([authInterceptorFn])
 *     )
 *   ]
 * };
 */
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  if (
    req.url.startsWith('/assets/') ||
    req.url.endsWith('.json')
  ) {
    return next(req);
  }

  // clonar la peticion y activr el envio automatico de cookies
  const clonedRequest = req.clone({
    withCredentials: true
  });

  return next(clonedRequest);
};
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional que agrega el token JWT a todas las peticiones HTTP salientes.
 * Compatible con Angular 19+.
 * Excluye automáticamente las peticiones a ficheros estáticos y JSON de assets
 * para evitar agregar el token en las cargas de ficheros de traducción y similares.
 * @param req - La petición HTTP interceptada
 * @param next - Manejador para continuar la cadena de interceptores
 * @returns La petición original si es un asset, la petición con el token si existe,
 * o la petición sin modificar si no hay token disponible
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
  const authService = inject(AuthService);
  const token = authService.getToken();
  

   if (
    req.url.startsWith('/assets/') ||
    req.url.endsWith('.json')
  ) {
    console.log(next(req));
    return next(req);
  }

  // Si existe token, clonar la petición y agregar el JWT
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('🔑 Token agregado a la petición:', req.method, req.url);
    
    return next(clonedRequest);
  }

  console.log('⚠️ No hay token para:', req.method, req.url);
  return next(req);
};
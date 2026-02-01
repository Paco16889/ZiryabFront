import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional que agrega el JWT a TODAS las peticiones HTTP
 * Compatible con Angular 19+
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
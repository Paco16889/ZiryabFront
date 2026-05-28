import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Añade `Authorization: Bearer` y `withCredentials` en peticiones al API.
 * En producción (front y API en dominios distintos) el Bearer es imprescindible;
 * las cookies httpOnly del API no siempre viajan en cross-site.
 */
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/assets/') || req.url.endsWith('.json')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const clonedRequest = req.clone({
    withCredentials: true,
    setHeaders: headers,
  });

  return next(clonedRequest);
};

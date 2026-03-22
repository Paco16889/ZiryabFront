import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional que agrega el JWT a TODAS las peticiones HTTP
 * Compatible con Angular 19+
 */
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  console.log(req.urlWithParams);
  console.log(req.url);
  console.log(req.withCredentials);
  console.log(req.body);
  console.log(req.headers);
  console.log(req.method);

  if (
    req.url.startsWith('/assets/') ||
    req.url.endsWith('.json')
  ) {
    console.log(next(req));
    return next(req);
  }

  // clonar la peticion y activr el envio automatico de cookies
  const clonedRequest = req.clone({
    withCredentials: true
  });

  return next(clonedRequest);
};
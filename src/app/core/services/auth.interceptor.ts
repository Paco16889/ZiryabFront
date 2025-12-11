import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor que agrega el JWT a TODAS las peticiones HTTP automáticamente
 * 
 * Flujo:
 * 1. Angular hace una petición HTTP
 * 2. Este interceptor intercepta la petición
 * 3. Lee el JWT de localStorage
 * 4. Lo agrega al header Authorization
 * 5. Envía la petición al servidor
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    /**
     * Intercepta la petición HTTP
     * @param request Petición original
     * @param next Handler siguiente
     * @returns Observable con la respuesta
     */
    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        // 1. Obtener el JWT del localStorage
        const token = this.authService.getToken();

        // 2. Si existe token, clonar la petición y agregar el JWT
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        // 3. Continuar con la petición modificada
        return next.handle(request);
    }
}

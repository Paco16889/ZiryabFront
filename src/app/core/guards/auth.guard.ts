import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que protege las rutas que requieren autenticación.
 * Redirige al login si el usuario no está autenticado.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

   /**
   * Inicializa el guard.
   * @param authService - Servicio de autenticación para verificar el estado del usuario
   * @param router - Router de Angular para gestionar las redirecciones
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Verifica si el usuario está autenticado para permitir el acceso a la ruta.
   * Si no está autenticado redirige a la página de login.
   * @param route - Información de la ruta activa
   * @param state - Estado actual del router
   * @returns true si está autenticado, false y redirige a login si no lo está
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // Verificar si está autenticado
    if (this.authService.isAuthenticated()) {
      return true;  // Permitir acceso
    }

    // 🎯 No está autenticado: redirigir a login SIN returnUrl
    this.router.navigate(['/login']);
    return false;
  }
}

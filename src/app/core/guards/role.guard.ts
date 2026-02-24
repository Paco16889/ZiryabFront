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
 * Guard que protege las rutas que requieren un rol específico.
 * Verifica tanto la autenticación como el rol del usuario antes de permitir el acceso.
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

    /**
   * @param authService - Servicio de autenticación para verificar el estado y rol del usuario
   * @param router - Router de Angular para gestionar las redirecciones
   */
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

     /**
   * Verifica si el usuario está autenticado y posee el rol requerido por la ruta.
   * Si no está autenticado redirige a login.
   * Si no tiene el rol necesario redirige a la página de acceso no autorizado.
   * Si la ruta no especifica roles permite el acceso a cualquier usuario autenticado.
   * @param route - Información de la ruta activa, debe contener data.roles con los roles permitidos
   * @param state - Estado actual del router
   * @returns true si el usuario tiene el rol requerido, false y redirige en caso contrario
   */
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree {
        // 1. Verificar que está autenticado
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return false;
        }

        // 2. Obtener los roles requeridos de la ruta
        const requiredRoles = route.data['roles'] as string[];

        // Si la ruta no especifica roles, permitir acceso
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        // 3. Obtener el rol del usuario
        const userRole = this.authService.getUserRole();

        // 4. Verificar si el rol está en la lista
        if (requiredRoles.includes(userRole!)) {
            return true;  // Permitir
        }

        // No tiene permiso
        this.router.navigate(['/unauthorized']);
        return false;
    }
}

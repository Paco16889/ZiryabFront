import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

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

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
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // Verificar si está autenticado
    if (this.authService.isAuthenticated()) {
      return true;  // Permitir acceso
    }

    // No está autenticado: redirigir a login
    // Guardar la URL a la que iba para redirigir después
    this.router.navigate(
      ['/login'],
      { queryParams: { returnUrl: state.url } }
    );
    return false;
  }
}

import { Injectable } from '@angular/core';
import { UserResponse } from './auth.service';

/**
 * Servicio de compatibilidad para evitar romper inyecciones existentes.
 *
 * La sesión se basa en cookies httpOnly gestionadas por backend, así que este
 * servicio no persiste datos en navegador.
 */
@Injectable({ providedIn: 'root' })
export class AuthStorageService {

  /**
   * No persiste datos: autenticación solo con cookies.
   */
  saveSession(_user: UserResponse): void {
    // no-op
  }

  /**
   * No hay almacenamiento local que limpiar.
   */
  clearSession(): void {
    // no-op
  }

  /**
   * No se expone token desde frontend cuando se usa cookie httpOnly.
   */
  getToken(): string | null {
    return null;
  }

  /**
   * No se persiste usuario localmente.
   */
  getUser(): UserResponse | null {
    return null;
  }
}
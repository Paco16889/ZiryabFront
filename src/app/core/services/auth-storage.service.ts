import { Injectable } from '@angular/core';
import { UserResponse } from './auth.service';

/**
 * Claves utilizadas para el almacenamiento en `localStorage`.
 * Definidas como constante para evitar literales dispersos por el servicio.
 */
const KEYS = {
  user: 'user',
  token: 'jwtToken',
} as const;

/**
 * Servicio responsable de centralizar toda la interacción con `localStorage`
 * relacionada con la sesión del usuario.
 *
 * Ningún otro servicio o componente debe acceder directamente a `localStorage`
 * para datos de autenticación; toda lectura y escritura pasa por aquí.
 *
 * @example
 * ```ts
 * // Guardar sesión tras login exitoso
 * this.storage.saveSession(userResponse);
 *
 * // Recuperar token para adjuntarlo en un interceptor HTTP
 * const token = this.storage.getToken();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AuthStorageService {

  /**
   * Persiste los datos del usuario y su token JWT en `localStorage`.
   *
   * Debe llamarse justo después de recibir la respuesta exitosa del backend,
   * antes de emitir el nuevo estado en el `BehaviorSubject`.
   *
   * @param user - Objeto {@link UserResponse} devuelto por el backend tras autenticarse
   */
  saveSession(user: UserResponse): void {
    localStorage.setItem(KEYS.token, user.token);
    localStorage.setItem(KEYS.user, JSON.stringify(user));
  }

  /**
   * Elimina todos los datos de sesión del `localStorage`.
   *
   * Debe llamarse durante el logout o cuando se detecta un estado inconsistente
   * (p. ej. JSON corrupto al deserializar el usuario).
   */
  clearSession(): void {
    localStorage.removeItem(KEYS.token);
    localStorage.removeItem(KEYS.user);
  }

  /**
   * Recupera el token JWT almacenado en `localStorage`.
   *
   * @returns El token JWT como cadena, o `null` si no existe ninguna sesión activa
   */
  getToken(): string | null {
    return localStorage.getItem(KEYS.token);
  }

  /**
   * Recupera y deserializa el usuario almacenado en `localStorage`.
   *
   * Si el valor almacenado no es JSON válido (datos corruptos), limpia
   * automáticamente la sesión para evitar estados inconsistentes.
   *
   * @returns El objeto {@link UserResponse} deserializado, o `null` si no existe
   *          sesión activa o los datos están corruptos
   */
  getUser(): UserResponse | null {
    const raw = localStorage.getItem(KEYS.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserResponse;
    } catch {
      this.clearSession();
      return null;
    }
  }
}
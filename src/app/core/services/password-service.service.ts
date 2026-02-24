import { Injectable } from '@angular/core';

/**
 * Servicio encargado de generar contraseñas aleatorias para el sistema.
 */
@Injectable({
  providedIn: 'root'
})
export class PasswordServiceService {

  constructor() { }

    /**
   * Genera una contraseña aleatoria con caracteres alfanuméricos.
   * @param length - Longitud de la contraseña generada, por defecto 10 caracteres
   * @returns Cadena de texto con la contraseña generada
   * @example
   * const password = this.passwordService.generateRandomPassword();
   * // Devuelve algo como 'aB3kP9mXwZ'
   *
   * const password = this.passwordService.generateRandomPassword(16);
   * // Devuelve algo como 'aB3kP9mXwZ4tRqLs'
   */
  generateRandomPassword(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
  
}


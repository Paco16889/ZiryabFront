/**
 * Representa los datos básicos de un usuario del sistema.
 * @example
 * const user: User = {
 *   name: 'NOMBRE_USUARIO',
 *   surname: 'APELLIDO_USUARIO',
 *   email: 'EMAIL_USUARIO'
 * };
 */
export interface User {
  /** Nombre del usuario */
  name: string;
  /** Apellido del usuario */
  surname: string;
  /** Correo electrónico del usuario */
  email: string;
}
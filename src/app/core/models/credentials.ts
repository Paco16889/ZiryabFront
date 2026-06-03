/**
 * Respuesta de la API tras iniciar sesión correctamente.
 * @example
 * const response: LoginResponse = {};
 */
export interface LoginResponse {}

/**
 * Datos necesarios para registrar un nuevo usuario en el sistema.
 * @example
 * const registerInfo: RegisterInfo = {
 *   name: 'NOMBRE_USUARIO',
 *   surname: 'APELLIDO_USUARIO',
 *   email: 'EMAIL_USUARIO',
 *   password: 'CONTRASEÑA_USUARIO',
 *   confirmPassword: 'CONFIRMACION_CONTRASEÑA'
 * };
 */
export interface RegisterInfo {
  /** Nombre del usuario */
  name: string;
  /** Apellido del usuario */
  surname: string;
  /** Correo electrónico del usuario */
  email: string;
  /** Contraseña del usuario */
  password: string;
  /** Confirmación de la contraseña, debe coincidir con password */
  confirmPassword: string;
}

/**
 * Credenciales necesarias para autenticar a un usuario en el sistema.
 * @example
 * const credentials: Credentials = {
 *   email: 'EMAIL_USUARIO',
 *   password: 'CONTRASEÑA_USUARIO'
 * };
 */
export interface Credentials {
  /** Correo electrónico del usuario */
  email: string;
  /** Contraseña del usuario */
  password: string;
}
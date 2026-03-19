import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Servicio de autenticación basado en localStorage.
 * Gestiona el login, registro y sesión del usuario mediante peticiones al backend
 * y almacenamiento del token JWT en localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageAuthService {

  /**
   * Signal que almacena los datos del usuario autenticado.
   * ATENCIÓN: se inicializa dentro del constructor en lugar de como propiedad
   * de clase, lo cual es un antipatrón. Debería declararse como
   * `public user = signal<any>(null)` directamente en la clase.
   */
  public user: any;

  /**
   * URL base de la API obtenida desde el fichero de entorno.
   */
  private apiUrl = environment.apiUrl;

   /**
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar peticiones al backend
   */
  constructor(private http: HttpClient) {
    this.user = signal<any>(null);
  }

  /**
   * Autentica un usuario existente contra el backend mediante su UID de Firebase.
   * Almacena el token JWT y los datos del usuario en localStorage tras el login.
   * ATENCIÓN: usa `.toPromise()` deprecado desde Angular 16, reemplazar por `firstValueFrom`.
   * @param data - Objeto con el UID de Firebase del usuario a autenticar
   * @returns Promesa con la respuesta completa del backend
   */
  async login(data: { firebaseUID: string }): Promise<any> {
    try {
      const response: any = await this.http.post(
        `${this.apiUrl}/auth/login`,
        data
      ).toPromise();

      console.log('✅ Response del backend:', response);

      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        this.user.set(response.data);
      }

      return response;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  }

  /**
   * Registra un nuevo usuario en el backend con sus datos personales y UID de Firebase.
   * Almacena el token JWT y los datos del usuario en localStorage tras el registro.
   * ATENCIÓN: usa `.toPromise()` deprecado desde Angular 16, reemplazar por `firstValueFrom`.
   * @param data - Datos del usuario a registrar
   * @param data.firebaseUID - Identificador único del usuario en Firebase
   * @param data.email - Correo electrónico del usuario
   * @param data.name - Nombre del usuario
   * @param data.surname - Primer apellido del usuario
   * @param data.ndSurname - Segundo apellido del usuario, opcional
   * @param data.birthDate - Fecha de nacimiento del usuario
   * @param data.dni - Documento de identidad del usuario
   * @param data.role - Rol del usuario en el sistema
   * @returns Promesa con la respuesta completa del backend
   */
  async register(data: {
    firebaseUID: string;
    email: string;
    name: string;
    surname: string;
    ndSurname?: string | null;
    birthDate: string;
    dni: string;
    role: string;
  }): Promise<any> {
    try {
      const response: any = await this.http.post(
        `${this.apiUrl}/auth/register`,
        data
      ).toPromise();

      console.log('✅ Response del backend (register):', response);

      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        this.user.set(response.data);
      }

      return response;
    } catch (error) {
      console.error('❌ Error en register:', error);
      throw error;
    }
  }

  /**
   * Obtiene los datos del usuario autenticado desde el backend.
   * Requiere que el interceptor adjunte el JWT en la cabecera de la petición.
   * ATENCIÓN: usa `.toPromise()` deprecado desde Angular 16, reemplazar por `firstValueFrom`.
   * @returns Promesa con los datos del usuario autenticado
   */
  async getMe(): Promise<any> {
    try {
      const response: any = await this.http.get(
        `${this.apiUrl}/auth/me`
      ).toPromise();

      return response?.data;
    } catch (error) {
      console.error('❌ Error en getMe:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario eliminando el token JWT y los datos
   * almacenados en localStorage y limpiando la signal de usuario.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    this.user.set(null);
  }

  /**
   * Obtiene el token JWT almacenado en localStorage.
   * @returns El token JWT o null si no existe
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verifica si hay una sesión activa comprobando la existencia del token JWT.
   * @returns true si existe token, false en caso contrario
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
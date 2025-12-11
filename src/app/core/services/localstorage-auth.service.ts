import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageAuthService {
  public user: any;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.user = signal<any>(null);
  }

  /**
   * LOGIN: Autentica usuario existente
   * Recibe firebaseUID del frontend y devuelve JWT
   */
  async login(data: { firebaseUID: string }): Promise<any> {
    try {
      const response: any = await this.http.post(
        `${this.apiUrl}/auth/login`,
        data
      ).toPromise();

      console.log('✅ Response del backend:', response);

      // Guardar token en localStorage
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
   * REGISTER: Registra nuevo usuario
   * Recibe datos del usuario + firebaseUID
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

      // Guardar token en localStorage
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
   * GET USER: Obtiene datos del usuario autenticado
   * Requiere JWT en header
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
   * LOGOUT: Cierra sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
  }

  /**
   * GET TOKEN: Obtiene el token guardado
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * IS AUTHENTICATED: Verifica si hay token
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

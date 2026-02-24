import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ============================================
// INTERFACES
// ============================================

/**
 * Interfaz que representa la respuesta del backend tras autenticarse.
 * Contiene los datos del usuario y el token JWT para las siguientes peticiones.
 */
export interface UserResponse {
    id: number;
    email: string;
    name: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    firebaseUID: string;
    token: string;
}

/**
 * Interfaz genérica para las respuestas de la API.
 * @template T - Tipo del campo data que varía según el endpoint
 */
interface ApiResponse<T> {
    message: string;
    data: T;
}

// ============================================
// SERVICIO
// ============================================
/**
 * Servicio encargado de gestionar la autenticación de la aplicación.
 * Combina Firebase Authentication para la autenticación y el backend propio
 * para la gestión de roles y el JWT. Mantiene el estado del usuario actual
 * mediante un BehaviorSubject accesible como Observable.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

      /**
   * URL base de la API obtenida desde el fichero de entorno.
   */
    private apiUrl = environment.apiUrl;

     /**
   * BehaviorSubject que mantiene el estado del usuario autenticado en memoria.
   */
    private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);

     /**
   * Observable público del usuario actual al que pueden suscribirse los componentes.
   */
    public currentUser$ = this.currentUserSubject.asObservable();

    /**
   * @param http - Cliente HTTP de Angular para las peticiones al backend
   * @param firebaseAuth - Instancia de Firebase Authentication
   */
    constructor(
        private http: HttpClient,
        private firebaseAuth: Auth
    ) {
        
        this.loadFromStorage();
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

   /**
   * Carga el usuario almacenado en localStorage al iniciar la aplicación.
   * Si encuentra datos inválidos los elimina para evitar estados inconsistentes.
   * Sincroniza además el token JWT entre las distintas claves de almacenamiento.
   */
    private loadFromStorage(): void {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                const user = JSON.parse(userJson) as UserResponse;
                this.currentUserSubject.next(user);
                
                // Asegurar que jwtToken esté sincronizado
                if (user.token) {
                    localStorage.setItem('jwtToken', user.token);
                }
                
                console.log('✅ Usuario cargado desde localStorage:', user.name);
            } catch {
                // Si hay error, eliminar datos inválidos
                this.clearAllStorage();
            }
        }
    }

    // ============================================
    // REGISTRO
    // ============================================

     /**
   * Registra un nuevo usuario tanto en Firebase como en el backend.
   * Primero crea el usuario en Firebase y con el UID resultante lo registra en el backend.
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @param name - Nombre del usuario
   * @param surname - Primer apellido del usuario
   * @param birthDate - Fecha de nacimiento del usuario
   * @param dni - Documento de identidad del usuario
   * @param role - Rol del usuario en el sistema
   * @returns Observable con los datos del usuario registrado
   */
    register(
        email: string,
        password: string,
        name: string,
        surname: string,
        birthDate: string,
        dni: string,
        role: 'STUDENT' | 'TEACHER' | 'ADMIN'
    ): Observable<UserResponse> {
        return new Observable((observer) => {
            createUserWithEmailAndPassword(this.firebaseAuth, email, password)
                .then(async (credential) => {
                    const firebaseUID = credential.user.uid;

                    this.http
                        .post<ApiResponse<UserResponse>>(
                            `${this.apiUrl}/auth/register`,
                            {
                                firebaseUID,
                                email,
                                name,
                                surname,
                                birthDate,
                                dni,
                                role,
                            }
                        )
                        .subscribe({
                            next: (res) => {
                                this.setSession(res.data);
                                observer.next(res.data);
                                observer.complete();
                            },
                            error: (err) => {
                                observer.error(err);
                            },
                        });
                })
                .catch((error) => {
                    observer.error(error);
                });
        });
    }

    // ============================================
    // LOGIN
    // ============================================

  /**
   * Autentica un usuario existente contra Firebase y obtiene el JWT del backend.
   * Primero verifica las credenciales en Firebase y con el UID resultante
   * solicita el JWT al backend propio.
   * @param email - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @returns Observable con los datos del usuario autenticado
   */
    login(email: string, password: string): Observable<UserResponse> {
        return new Observable((observer) => {
            console.log('🔐 Autenticando con Firebase...');
            
            signInWithEmailAndPassword(this.firebaseAuth, email, password)
                .then(async (credential) => {
                    const firebaseUID = credential.user.uid;
                    console.log('✅ Firebase UID:', firebaseUID);

                    console.log('🔑 Obteniendo JWT del backend...');
                    this.http
                        .post<ApiResponse<UserResponse>>(
                            `${this.apiUrl}/auth/login`,
                            { firebaseUID }
                        )
                        .subscribe({
                            next: (res) => {
                                console.log('✅ Backend response:', res);
                                this.setSession(res.data);
                                observer.next(res.data);
                                observer.complete();
                            },
                            error: (err) => {
                                console.error('❌ Error backend:', err);
                                observer.error(err);
                            },
                        });
                })
                .catch((error) => {
                    console.error('❌ Error Firebase:', error);
                    observer.error(error);
                });
        });
    }

    // ============================================
    // LOGOUT
    // ============================================

     /**
   * Desconecta al usuario de Firebase y limpia todos los datos de sesión almacenados.
   * @returns Observable que completa cuando el logout ha finalizado correctamente
   */
    logout(): Observable<void> {
        return new Observable((observer) => {
            signOut(this.firebaseAuth)
                .then(() => {
                    this.clearAllStorage();
                    this.currentUserSubject.next(null);
                    console.log('✅ Logout completado');
                    
                    observer.next();
                    observer.complete();
                })
                .catch((error) => {
                    console.error('❌ Error en logout:', error);
                    observer.error(error);
                });
        });
    }

    // ============================================
    // GETTERS / INFORMACIÓN
    // ============================================

     /**
   * Obtiene el usuario actualmente autenticado.
   * @returns El usuario actual o null si no hay sesión activa
   */
    getCurrentUser(): UserResponse | null {
        return this.currentUserSubject.value;
    }

   /**
   * Obtiene el token JWT almacenado en localStorage.
   * Busca primero en la clave estándar jwtToken y como fallback en token por compatibilidad.
   * @returns El token JWT o null si no existe
   */
    getToken(): string | null {
        // Primero buscar en jwtToken (estándar)
        let token = localStorage.getItem('jwtToken');
        
        // Si no existe, buscar en 'token' (compatibilidad)
        if (!token) {
            token = localStorage.getItem('token');
            // Migrar a jwtToken si existe
            if (token) {
                localStorage.setItem('jwtToken', token);
            }
        }
        
        return token;
    }

    /**
   * Verifica si hay un usuario autenticado con token válido.
   * @returns true si hay usuario y token, false en caso contrario
   */
    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value && !!this.getToken();
    }

     /**
   * Obtiene el rol del usuario actualmente autenticado.
   * @returns El rol del usuario o null si no hay sesión activa
   */
    getUserRole(): string | null {
        return this.currentUserSubject.value?.role ?? null;
    }

    /**
   * Obtiene el identificador del usuario actualmente autenticado.
   * @returns El id del usuario o null si no hay sesión activa
   */
    getUserId(): number | null {
        return this.currentUserSubject.value?.id ?? null;
    }

    // ============================================
    // PRIVADOS
    // ============================================

     /**
   * Guarda los datos del usuario y el token en localStorage y actualiza el BehaviorSubject.
   * Mantiene sincronizadas las claves jwtToken y token por compatibilidad.
   * @param user - Datos del usuario a almacenar en sesión
   */
    private setSession(user: UserResponse): void {
        localStorage.setItem('jwtToken', user.token);
        localStorage.setItem('token', user.token); // Compatibilidad
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        console.log('💾 Sesión guardada:', {
            user: user.name,
            role: user.role,
            token: user.token.substring(0, 20) + '...'
        });
    }

    /**
     * Limpia TODO el localStorage
     */
    private clearAllStorage(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('token');
        console.log('🗑️ Storage limpiado');
    }
}
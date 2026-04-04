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
    /** Identificador único del usuario en el sistema */
    id: number;
    /** Correo electrónico del usuario */
    email: string;
    /** Nombre del usuario */
    name: string;
    /** Rol del usuario en el sistema */
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    /** Identificador único del usuario en Firebase */
    firebaseUID: string;
    /** Token JWT para autenticar las siguientes peticiones al backend */
    token: string;
}

/**
 * Interfaz genérica para las respuestas de la API.
 * @template T - Tipo del campo data que varía según el endpoint
 */
interface ApiResponse<T> {
    /** Mensaje descriptivo del resultado devuelto por el backend */
    message: string;
    /** Datos de la respuesta, cuyo tipo varía según el endpoint */
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
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   * @param firebaseAuth - Instancia de Firebase Authentication
   */
    constructor(
        private http: HttpClient,
        private firebaseAuth: Auth
    ) { }

    // ============================================
    // VERIFICACIÓN DE SESIÓN (INIT)
    // ============================================



    /**
     * Comprueba con el back si la cookie HttpOnly es válida.
     * @returns Observable con los datos del usuario si la sesión es válida
     */
    verifySession(): Observable<UserResponse> {
        return new Observable((observer) => {
            this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/auth/me`)
                .subscribe({
                    next: (res) => {
                        console.log('✅ Sesión restaurada desde Cookie HttpOnly');
                        this.currentUserSubject.next(res.data);
                        observer.next(res.data);
                        observer.complete();
                    },
                    error: (err) => {
                        console.log('⚠️ No hay sesión válida en las Cookies');
                        this.currentUserSubject.next(null);
                        observer.error(err);
                    }
                });
        });
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
                    const token = await credential.user.getIdToken();

                    this.http
                        .post<ApiResponse<UserResponse>>(
                            `${this.apiUrl}/auth/register`,
                            {
                                token,
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
                    const token = await credential.user.getIdToken();
                    console.log('✅ Firebase JWT Token obtenido');

                    console.log('🔑 Obteniendo JWT del backend...');
                    this.http
                        .post<ApiResponse<UserResponse>>(
                            `${this.apiUrl}/auth/login`,
                            { token }
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
                    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
                        next: () => {
                            this.currentUserSubject.next(null);
                            console.log('✅ Logout completado y Cookie limpiada');
                            observer.next();
                            observer.complete();
                        },
                        error: (err) => {
                            console.error('❌ Error limpiando Cookie:', err);
                            observer.error(err);
                        }
                    });
                })
                .catch((error) => {
                    console.error('❌ Error en logout Firebase:', error);
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
     * Verifica si hay un usuario autenticado con token válido.
     * @returns true si hay usuario y token, false en caso contrario
     */
    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
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
        this.currentUserSubject.next(user);

        console.log('💾 Sesión guardada en Memoria (Cookie gestionada por backend):', {
            user: user.name,
            role: user.role
        });
    }
}
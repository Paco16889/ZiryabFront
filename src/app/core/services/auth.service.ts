import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FirebaseAuthService } from './firebase-auth.service';
import { AuthStorageService } from './auth-storage.service';

// ============================================
// INTERFACES
// ============================================

/**
 * Representa la respuesta del backend tras autenticarse o registrarse.
 * Contiene los datos de perfil del usuario y el token JWT para las
 * siguientes peticiones autenticadas.
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
 * @template T - Tipo del campo `data`, que varía según el endpoint
 */
interface ApiResponse<T> {
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Datos de la respuesta */
  data: T;
}

// ============================================
// SERVICIO
// ============================================

/**
 * Servicio orquestador de autenticación.
 *
 * Coordina el flujo completo de autenticación delegando cada responsabilidad
 * al servicio especializado correspondiente:
 *
 * - **{@link FirebaseAuthService}** — verifica credenciales contra Firebase y
 *   obtiene el `firebaseUID`.
 * - **`HttpClient`** — intercambia el `firebaseUID` con el backend propio para
 *   obtener el JWT y los datos de perfil.
 * - **{@link AuthStorageService}** — persiste y recupera la sesión en `localStorage`.
 *
 * El estado del usuario autenticado se mantiene en un `BehaviorSubject` y se
 * expone como `Observable` para que los componentes puedan reaccionar a cambios
 * de sesión de forma reactiva.
 *
 * @example
 * ```ts
 * // Login desde un componente
 * this.authService.login(email, password).subscribe({
 *   next: (user) => this.router.navigate(['/dashboard']),
 *   error: (err)  => this.showError(err),
 * });
 *
 * // Escuchar cambios de sesión
 * this.authService.currentUser$.subscribe((user) => {
 *   this.isLoggedIn = !!user;
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  /**
   * URL base de la API obtenida desde el fichero de entorno.
   */
  private readonly apiUrl = environment.apiUrl;

  /**
   * BehaviorSubject que mantiene el estado del usuario autenticado en memoria.
   * Se inicializa con el usuario guardado en `localStorage` si existe.
   */
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);

  /**
   * Observable público del usuario actual.
   * Los componentes y guards deben suscribirse a este stream en lugar de
   * llamar a {@link getCurrentUser} para reaccionar a cambios de sesión.
   */
  public currentUser$ = this.currentUserSubject.asObservable();

  /**
   * @param http         - Cliente HTTP de Angular para las peticiones al backend
   * @param firebaseAuthService - Servicio que encapsula Firebase Authentication
   * @param storage              - Servicio que centraliza el acceso a `localStorage`
   */
  constructor(
    private http: HttpClient,
    @Inject(FirebaseAuthService) private firebaseAuthService: FirebaseAuthService,
    @Inject(AuthStorageService) private storage: AuthStorageService
  ) {
    const savedUser = this.storage.getUser();
    if (savedUser) {
      this.currentUserSubject.next(savedUser);
    }
  }

  // ============================================
  // LOGIN
  // ============================================

  /**
   * Autentica un usuario existente.
   *
   * Flujo:
   * 1. Verifica las credenciales en Firebase → obtiene `firebaseUID`.
   * 2. Envía el `firebaseUID` al backend → recibe JWT y datos de perfil.
   * 3. Persiste la sesión y actualiza el estado reactivo.
   *
   * @param email    - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @returns `Observable<UserResponse>` que emite el usuario autenticado y completa,
   *          o lanza error si las credenciales son inválidas o el backend falla
   */
  login(email: string, password: string): Observable<UserResponse> {

    return new Observable((observer) => {
      console.log('autenticando con firebase...');
    
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
  // REGISTRO
  // ============================================

  /**
   * Registra un nuevo usuario en Firebase y en el backend.
   *
   * Flujo:
   * 1. Crea la cuenta en Firebase → obtiene `firebaseUID`.
   * 2. Registra al usuario en el backend con el `firebaseUID` y el resto de datos → recibe JWT.
   * 3. Persiste la sesión y actualiza el estado reactivo.
   *
   * @param email     - Correo electrónico del usuario
   * @param password  - Contraseña del usuario
   * @param name      - Nombre del usuario
   * @param surname   - Primer apellido del usuario
   * @param birthDate - Fecha de nacimiento (formato `YYYY-MM-DD`)
   * @param dni       - Documento de identidad del usuario
   * @param role      - Rol asignado en el sistema
   * @returns `Observable<UserResponse>` que emite el usuario registrado y completa,
   *          o lanza error si el email ya existe o el backend rechaza el registro
   */
  register(
    email: string,
    password: string,
    name: string,
    surname: string,
    birthDate: string,
    dni: string,
    role: 'STUDENT' | 'TEACHER' | 'ADMIN',
  ): Observable<UserResponse> {
    return this.firebaseAuthService.signUp(email, password).pipe(
      switchMap((firebaseUID) =>
        this.http.post<ApiResponse<UserResponse>>(`${this.apiUrl}/auth/register`, {
          firebaseUID, email, name, surname, birthDate, dni, role,
        })
      ),
      map((res) => res.data),
      tap((user) => this.openSession(user)),
    );
  }
    /**
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   * @param firebaseAuth - Instancia de Firebase Authentication
   */
   

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
  // LOGOUT
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

  /**
   * Devuelve el usuario actualmente autenticado de forma síncrona.
   * Para reaccionar a cambios de sesión, usar {@link currentUser$} en su lugar.
   *
   * @returns El {@link UserResponse} actual, o `null` si no hay sesión activa
   */
  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  /**
   * Devuelve el token JWT almacenado en `localStorage`.
   *
   * Útil para interceptores HTTP que necesitan adjuntar el token a las peticiones.
   *
   * @returns El token JWT como cadena, o `null` si no hay sesión activa
   */
  getToken(): string | null {
    return this.storage.getToken();
  }

  /**
   * Devuelve el rol del usuario actualmente autenticado.
   *
   * @returns El rol (`'STUDENT'` | `'TEACHER'` | `'ADMIN'`), o `null` si no hay sesión activa
   */
  getUserRole(): string | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  /**
   * Devuelve el identificador numérico del usuario actualmente autenticado.
   *
   * @returns El `id` del usuario, o `null` si no hay sesión activa
   */
  getUserId(): number | null {
    return this.currentUserSubject.value?.id ?? null;
  }
            

  /**
   * Indica si hay un usuario autenticado con token válido.
   *
   * @returns `true` si existe usuario en memoria **y** token en `localStorage`,
   *          `false` en cualquier otro caso
   */
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!this.getToken();
  }

  // ============================================
  // PRIVADOS
  // ============================================

  /**
   * Abre una nueva sesión: persiste los datos en `localStorage` y emite
   * el usuario en el `BehaviorSubject`.
   *
   * @param user - Datos del usuario recibidos del backend
   */
  private openSession(user: UserResponse): void {
    this.storage.saveSession(user);
    this.currentUserSubject.next(user);
  }

  /**
   * Cierra la sesión activa: limpia `localStorage` y emite `null`
   * en el `BehaviorSubject`.
   */
  private closeSession(): void {
    this.storage.clearSession();
    this.currentUserSubject.next(null);
  }
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
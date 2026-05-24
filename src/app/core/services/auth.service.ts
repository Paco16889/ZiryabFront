import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FirebaseAuthService } from './firebase-auth.service';

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
export interface ApiResponse<T> {
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
  /** URL base del backend propio. */
  private readonly apiUrl = environment.apiUrl;

  /** Estado interno de sesión; `null` representa usuario no autenticado. */
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);

  /** Flujo público para reaccionar a login/logout en componentes y servicios. */
  public currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Inyecta las dependencias de autenticación de la aplicación.
   * @param http Cliente HTTP para intercambiar tokens con el backend propio.
   * @param firebaseAuthService Capa Firebase que valida credenciales y devuelve el ID token.
   */
  constructor(
    private http: HttpClient,
    @Inject(FirebaseAuthService) private firebaseAuthService: FirebaseAuthService,
  ) {}

  /**
   * Autentica con Firebase y abre sesión en el backend usando el token obtenido.
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @returns Observable con el perfil autenticado y el JWT del backend.
   */
  login(email: string, password: string): Observable<UserResponse> {
    return this.firebaseAuthService.signIn(email, password).pipe(
      switchMap((token) =>
        this.http.post<ApiResponse<UserResponse>>(`${this.apiUrl}/auth/login`, { token })
      ),
      map((res) => res.data),
      tap((user) => this.openSession(user))
    );
  }

  /**
   * Registra usuario en Firebase y crea su perfil en el backend propio.
   * @param email Correo electrónico de la nueva cuenta.
   * @param password Contraseña de la nueva cuenta.
   * @param name Nombre del usuario.
   * @param surname Primer apellido del usuario.
   * @param birthDate Fecha de nacimiento en formato ISO.
   * @param dni Documento de identidad del usuario.
   * @param role Rol asignado en la plataforma.
   * @returns Observable con el perfil registrado y el JWT del backend.
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
    return this.firebaseAuthService.signUp(email, password).pipe(
      switchMap((token) =>
        this.http.post<ApiResponse<UserResponse>>(`${this.apiUrl}/auth/register`, {
          token,
          email,
          name,
          surname,
          birthDate,
          dni,
          role,
        })
      ),
      map((res) => res.data),
      tap((user) => this.openSession(user))
    );
  }

  /** Verifica la cookie/JWT actual con el backend y rehidrata el usuario. */
  verifySession(): Observable<UserResponse> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/auth/me`).pipe(
      map((res) => res.data),
      tap((user) => this.openSession(user))
    );
  }

  /** Cierra la sesión en backend y limpia el estado local. */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => this.closeSession())
    );
  }

  /**
   * Fuerza el cierre de sesión local cuando la llamada de logout al backend falla.
   * Centraliza la limpieza del estado de autenticación y del almacenamiento local.
   */
  forceCloseSession(): void {
    this.closeSession();
  }

  /** Devuelve el usuario actual sin suscribirse al observable. */
  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  /** Devuelve el JWT del usuario en memoria, si existe. */
  getToken(): string | null {
    return this.currentUserSubject.value?.token ?? null;
  }

  /** Devuelve el rol del usuario actual para guards y navegación. */
  getUserRole(): string | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  /** Devuelve el id interno del usuario actual. */
  getUserId(): number | null {
    return this.currentUserSubject.value?.id ?? null;
  }

  /** Indica si hay un usuario autenticado en memoria. */
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Publica el usuario autenticado para toda la aplicación.
   * @param user Perfil devuelto por el backend tras login o registro.
   * @returns No devuelve valor; actualiza el BehaviorSubject de sesión.
   */
  private openSession(user: UserResponse): void {
    this.currentUserSubject.next(user);
  }

  /** Limpia almacenamiento local y notifica logout a los observadores. */
  private closeSession(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }
}
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
  private readonly apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(FirebaseAuthService) private firebaseAuthService: FirebaseAuthService,
    @Inject(AuthStorageService) private storage: AuthStorageService
  ) {
    const savedUser = this.storage.getUser();
    if (savedUser) this.currentUserSubject.next(savedUser);
  }

  login(email: string, password: string): Observable<UserResponse> {
    return this.firebaseAuthService.signIn(email, password).pipe(
      switchMap((firebaseUID) =>
        this.http.post<ApiResponse<UserResponse>>(`${this.apiUrl}/auth/login`, { firebaseUID })
      ),
      map((res) => res.data),
      tap((user) => this.openSession(user))
    );
  }

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
      switchMap((firebaseUID) =>
        this.http.post<ApiResponse<UserResponse>>(`${this.apiUrl}/auth/register`, {
          firebaseUID,
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

  verifySession(): Observable<UserResponse> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/auth/me`).pipe(
      map((res) => res.data),
      tap((user) => this.openSession(user))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => this.closeSession())
    );
  }

  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  getUserRole(): string | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  getUserId(): number | null {
    return this.currentUserSubject.value?.id ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value && !!this.getToken();
  }

  private openSession(user: UserResponse): void {
    this.storage.saveSession(user);
    this.currentUserSubject.next(user);
  }

  private closeSession(): void {
    this.storage.clearSession();
    this.currentUserSubject.next(null);
  }
}
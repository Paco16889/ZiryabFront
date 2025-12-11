import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ============================================
// INTERFACES
// ============================================

export interface UserResponse {
    id: number;
    email: string;
    name: string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN';
    firebaseUID: string;
    token: string;
}

interface ApiResponse<T> {
    message: string;
    data: T;
}

// ============================================
// SERVICIO
// ============================================

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

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
     * Carga el usuario desde localStorage al iniciar la app
     */
    private loadFromStorage(): void {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                const user = JSON.parse(userJson) as UserResponse;
                this.currentUserSubject.next(user);
            } catch {
                // Si hay error, eliminar datos inválidos
                localStorage.removeItem('user');
                localStorage.removeItem('jwtToken');
            }
        }
    }

    // ============================================
    // REGISTRO
    // ============================================

    /**
     * Registra un nuevo usuario
     * 1. Crea en Firebase
     * 2. Crea en BD local vía Node
     * 3. Guarda JWT localmente
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
            // 1. Crear en Firebase
            createUserWithEmailAndPassword(this.firebaseAuth, email, password)
                .then(async (credential) => {
                    const firebaseUID = credential.user.uid;

                    // 2. Crear en BD local vía Node
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
                                // 3. Guardar localmente
                                this.setSession(res.data);
                                observer.next(res.data);
                                observer.complete();
                            },
                            error: (err) => {
                                // Si Node falla, eliminar de Firebase también (opcional)
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
     * Login de un usuario existente
     * 1. Autentica en Firebase
     * 2. Obtiene JWT de Node
     * 3. Guarda JWT localmente
     */
    login(email: string, password: string): Observable<UserResponse> {
        return new Observable((observer) => {
            // 1. Autenticar en Firebase
            signInWithEmailAndPassword(this.firebaseAuth, email, password)
                .then(async (credential) => {
                    const firebaseUID = credential.user.uid;

                    // 2. Obtener JWT de Node
                    this.http
                        .post<ApiResponse<UserResponse>>(
                            `${this.apiUrl}/auth/login`,
                            {
                                firebaseUID,
                            }
                        )
                        .subscribe({
                            next: (res) => {
                                // 3. Guardar localmente
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
    // LOGOUT
    // ============================================

    /**
     * Desconecta el usuario
     */
    logout(): Observable<void> {
        return new Observable((observer) => {
            signOut(this.firebaseAuth)
                .then(() => {
                    // Eliminar datos locales
                    localStorage.removeItem('user');
                    localStorage.removeItem('jwtToken');
                    this.currentUserSubject.next(null);

                    observer.next();
                    observer.complete();
                })
                .catch((error) => {
                    observer.error(error);
                });
        });
    }

    // ============================================
    // GETTERS / INFORMACIÓN
    // ============================================

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser(): UserResponse | null {
        return this.currentUserSubject.value;
    }

    /**
     * Obtiene el JWT almacenado
     */
    getToken(): string | null {
        return localStorage.getItem('jwtToken');
    }

    /**
     * Verifica si está autenticado
     */
    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    /**
     * Obtiene el rol del usuario
     */
    getUserRole(): string | null {
        return this.currentUserSubject.value?.role ?? null;
    }

    /**
     * Obtiene el ID del usuario
     */
    getUserId(): number | null {
        return this.currentUserSubject.value?.id ?? null;
    }

    // ============================================
    // PRIVADOS
    // ============================================

    /**
     * Guarda usuario y token en localStorage y el BehaviorSubject
     */
    private setSession(user: UserResponse): void {
        localStorage.setItem('jwtToken', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }
}

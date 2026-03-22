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
    ) { }

    // ============================================
    // VERIFICACIÓN DE SESIÓN (INIT)
    // ============================================

    /**
     * comprueba con el back si la cookie HttpOnly es valida.
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
     * Registra un nuevo usuario
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
     * Login de un usuario existente
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
     * Desconecta el usuario
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
     * Obtiene el usuario actual
     */
    getCurrentUser(): UserResponse | null {
        return this.currentUserSubject.value;
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
     * Actualiza el BehaviorSubject del usuario en sesion
     */
    private setSession(user: UserResponse): void {
        this.currentUserSubject.next(user);

        console.log('💾 Sesión guardada en Memoria (Cookie gestionada por backend):', {
            user: user.name,
            role: user.role
        });
    }
}
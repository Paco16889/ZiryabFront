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
    ) {
        this.loadFromStorage();
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    /**
     * Carga el usuario desde localStorage al iniciar la app
     * Busca en 'user' y también migra desde 'token' si existe
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
     * Obtiene el usuario actual
     */
    getCurrentUser(): UserResponse | null {
        return this.currentUserSubject.value;
    }

    /**
     * Obtiene el JWT almacenado
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
     * Verifica si está autenticado
     */
    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value && !!this.getToken();
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
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Servicio que encapsula exclusivamente la interacción con **Firebase Authentication**.
 *
 * Su única responsabilidad es verificar credenciales contra Firebase y devolver
 * el ID token firmado por Firebase. No conoce el backend propio, no gestiona tokens JWT
 * ni toca `localStorage`.
 *
 * Separar esta capa permite sustituir Firebase por otro proveedor de autenticación
 * sin modificar {@link AuthService} ni ningún componente.
 *
 * @example
 * ```ts
 * this.firebaseAuth.signIn(email, password).pipe(
 *   switchMap((token) => this.http.post('/auth/login', { token }))
 * ).subscribe();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {

  /**
   * @param firebaseAuth - Instancia de Firebase Authentication inyectada por AngularFire
   */
  constructor(private firebaseAuth: Auth) {}

  /**
   * Autentica un usuario existente contra Firebase con email y contraseña.
   *
   * Convierte la `Promise` nativa de Firebase en un `Observable` mediante `from()`,
   * siguiendo el patrón reactivo del resto de la aplicación.
   *
   * @param email    - Correo electrónico del usuario
   * @param password - Contraseña del usuario
   * @returns `Observable<string>` que emite el ID token del usuario autenticado
   *          y completa inmediatamente, o lanza error si las credenciales son inválidas
   */
  signIn(email: string, password: string): Observable<string> {
    return from(signInWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      switchMap((credential) => from(credential.user.getIdToken())),
    );
  }

  /**
   * Crea una nueva cuenta en Firebase con email y contraseña.
   *
   * Convierte la `Promise` nativa de Firebase en un `Observable` mediante `from()`.
   * El token resultante debe usarse de inmediato para registrar al usuario
   * en el backend propio.
   *
   * @param email    - Correo electrónico para la nueva cuenta
   * @param password - Contraseña para la nueva cuenta
   * @returns `Observable<string>` que emite el ID token de la cuenta recién creada
   *          y completa inmediatamente, o lanza error si el email ya está en uso
   */
  signUp(email: string, password: string): Observable<string> {
    return from(createUserWithEmailAndPassword(this.firebaseAuth, email, password)).pipe(
      switchMap((credential) => from(credential.user.getIdToken())),
    );
  }

  /**
   * Cierra la sesión del usuario activo en Firebase.
   *
   * Convierte la `Promise` nativa de Firebase en un `Observable` mediante `from()`.
   * Tras completar, {@link AuthService} se encarga de limpiar el estado local.
   *
   * @returns `Observable<void>` que completa cuando Firebase confirma el cierre de sesión,
   *          o lanza error si Firebase no está disponible
   */
  signOut(): Observable<void> {
    return from(signOut(this.firebaseAuth));
  }
}
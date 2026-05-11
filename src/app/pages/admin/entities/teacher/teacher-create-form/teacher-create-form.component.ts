import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';
import { PasswordService } from '../../../../../core/services/password.service';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { TeacherCreateResponse } from '../../../../../core/models/teacher';
import { DNI_NIE_PATTERN } from '../../../../../core/configs/validators';

/**
 * Componente que gestiona el formulario de creación de un nuevo profesor.
 * Crea el usuario en Firebase Authentication y posteriormente lo registra
 * en el backend con los datos del formulario.
 * Genera una contraseña aleatoria para el nuevo usuario mediante el PasswordService.
 */
@Component({
  selector: 'app-teacher-create-form',
  imports: [ReactiveFormsModule],
  templateUrl: './teacher-create-form.component.html',
  styleUrl: './teacher-create-form.component.scss'
})
export class TeacherCreateFormComponent {
  /** Evento emitido cuando el usuario cancela la creación */
  @Output() cancelCreate = new EventEmitter<void>();

  /** Evento emitido cuando el profesor se ha creado correctamente */
  @Output() teacherCreated = new EventEmitter<void>();

  /** Formulario reactivo con los campos necesarios para crear un profesor */
  createForm: FormGroup;

  /** Indica si la petición de creación está en curso */
  isCreating = false;

    /**
   * Mensaje de error a mostrar si la creación falla.
   */
  errorMessage = '';

    /**
   * Inicializa el componente.
   * @param fb - FormBuilder de Angular para construir el formulario reactivo
   * @param teacherService - Servicio que gestiona las operaciones con profesores
   * @param fireBaseAuth - Instancia de Firebase Authentication para crear usuarios
   * @param passwordGen - Servicio para generar contraseñas seguras por defecto
   */
  constructor(
    private fb: FormBuilder,
    private teacherService: TeachersService,
    private fireBaseAuth: Auth,
    private passwordGen: PasswordService
  ) {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      ndSurname: ['', Validators.required],
      birthDate: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(DNI_NIE_PATTERN)]]
    });
  }

  /**
   * Crea el usuario en Firebase Authentication y lo registra en el backend.
   * Genera una contraseña aleatoria para Firebase y usa el UID resultante
   * para completar el registro en el backend.
   * @returns Un observable con la respuesta de la creación del profesor.
   */
  createTeacher(): Observable<TeacherCreateResponse> {
    const email = this.createForm.value.email;
    const password = this.passwordGen.generateRandomPassword();

    return from(createUserWithEmailAndPassword(this.fireBaseAuth, email, password)).pipe(
      switchMap(credential => {
        const firebaseUID = credential.user.uid;
        console.log('Firebase UID:', firebaseUID);

        const teacherData = {
          email,
          name: this.createForm.value.name,
          surname: this.createForm.value.surname,
          ndSurname: this.createForm.value.ndSurname,
          birthDate: this.createForm.value.birthDate,
          dni: this.createForm.value.dni,
          firebaseUID   
        };

        return this.teacherService.createTeacher(teacherData);
      }),
      finalize(() => {
        this.isCreating = false;
      })
    );
  }

  /**
   * Valida el formulario y ejecuta la creación del profesor si es correcto.
   * Gestiona el estado de carga y los posibles errores de la API.
   */
  onSubmit() {
    if (this.createForm.valid) {
      this.isCreating = true;
      this.errorMessage = '';

      this.createTeacher().subscribe({
        next: () => {
          console.log('✅ Teacher creado');
          this.teacherCreated.emit();
        },
        error: (err) => {
          console.error('❌ Error guardando teacher:', err);
          this.errorMessage = err.error?.message || err.message || 'Error al crear el profesor';
        }
      });
    }
  }

  /**
   * Emite el evento cancelCreate para cerrar el formulario sin guardar cambios.
   */
  onCancel() {
    this.cancelCreate.emit();
  }
}

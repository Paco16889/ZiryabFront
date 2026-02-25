import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeachersServiceService } from '../../../../../core/services/admin/entities/teachers-service.service';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { PasswordServiceService } from '../../../../../core/services/password-service.service';

/**
 * Componente que gestiona el formulario de creación de un nuevo profesor.
 * Crea el usuario en Firebase Authentication y posteriormente lo registra
 * en el backend con los datos del formulario.
 * Genera una contraseña aleatoria para el nuevo usuario mediante el PasswordServiceService.
 */
@Component({
  selector: 'app-teacher-create-form',
  imports: [ReactiveFormsModule],
  templateUrl: './teacher-create-form.component.html',
  styleUrl: './teacher-create-form.component.scss'
})
export class TeacherCreateFormComponent {
    /**
   * Evento emitido cuando el usuario cancela la creación.
   */
  @Output() cancelCreate = new EventEmitter<void>();

   /**
   * Evento emitido cuando el profesor se ha creado correctamente.
   */
  @Output() teacherCreated = new EventEmitter<void>();

   /**
   * Formulario reactivo con los campos necesarios para crear un profesor.
   */
  createForm: FormGroup;

   /**
   * Indica si la petición de creación está en curso.
   */
  isCreating = false;

    /**
   * Mensaje de error a mostrar si la creación falla.
   */
  errorMessage = '';

    /**
   * @param fb - FormBuilder de Angular para construir el formulario reactivo
   * @param teacherService - Servicio que gestiona las operaciones con profesores
   * @param fireBaseAuth - Instancia de Firebase Authentication para crear el usuario
   * @param passwordGen - Servicio que genera la contraseña aleatoria del nuevo usuario
   */
  constructor(
    private fb: FormBuilder,
    private teacherService: TeachersServiceService,
    private fireBaseAuth: Auth,
    private passwordGen: PasswordServiceService
  ) {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      ndSurname: ['', Validators.required],
      birthDate: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]]
    });
  }

    /**
   * Crea el usuario en Firebase Authentication y lo registra en el backend.
   * Genera una contraseña aleatoria para Firebase y usa el UID resultante
   * para completar el registro en el backend.
   * ATENCIÓN: si el backend falla isCreating se queda en true bloqueando el formulario.
   * ATENCIÓN: mismo antipatrón que StudentCreateFormComponent, pendiente de refactorizar.
   */
  createTeacher() {
  const email = this.createForm.value.email;
  const password = this.passwordGen.generateRandomPassword();

  this.isCreating = true;

  // 1️⃣ Crear usuario en Firebase
  createUserWithEmailAndPassword(this.fireBaseAuth, email, password)
    .then(credential => {

      const firebaseUID = credential.user.uid;
      console.log('Firebase UID:', firebaseUID);

      // 2️⃣ Crear teacher en BBDD
      const teacherData = {
        email,
        name: this.createForm.value.name,
        surname: this.createForm.value.surname,
        ndSurname: this.createForm.value.ndSurname,
        birthDate: this.createForm.value.birthDate,
        dni: this.createForm.value.dni,
        firebaseUID   
      };

      this.teacherService.createTeacher(teacherData).subscribe({
        
        next: () => {console.log('✅ Teacher creado'),this.isCreating = false, this.teacherCreated.emit()},
        error: err => console.error('❌ Error BBDD', err)
      });
    })
    .catch(err => {
         this.isCreating = false; 
          this.errorMessage = err.error?.message || 'Error al crear el profesor';
      console.error('❌ Error Firebase', err);
    });
}

 /**
   * Valida el formulario y ejecuta la creación si es correcto.
   */
  onSubmit() {
    if (this.createForm.valid) {
    this.isCreating = true;
    this.errorMessage = '';

    // Llamar al método que ya hace Firebase + backend
    this.createTeacher();
  }
  }

    /**
   * Emite el evento cancelCreate para cerrar el formulario sin guardar.
   */
  onCancel() {
    this.cancelCreate.emit();
  }
}

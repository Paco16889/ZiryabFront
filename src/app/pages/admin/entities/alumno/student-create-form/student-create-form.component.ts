import { Component, EventEmitter, Output } from '@angular/core';
import { Student } from '../../../../../core/models/student';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentsServiceService } from '../../../../../core/services/admin/entities/students-service.service';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { PasswordServiceService } from '../../../../../core/services/password-service.service';
import { BotonConfirmarStudentComponent } from "../../../botones/boton-confirmar-student/boton-confirmar-student.component";
import { SelectedStudentServiceService } from '../../../../../core/services/admin/selected-student-service.service';
import { Observable, from } from 'rxjs';
import { switchMap, map, finalize } from 'rxjs/operators';
import { DNI_NIE_PATTERN } from '../../../../../core/configs/validators';

/**
 * Componente que gestiona el formulario de creación de un nuevo estudiante.
 * Crea el usuario en Firebase Authentication y posteriormente lo registra
 * en el backend con los datos del formulario.
 * Genera una contraseña aleatoria para el nuevo usuario mediante el PasswordServiceService.
 */
@Component({
  selector: 'app-student-create-form',
  imports: [ReactiveFormsModule, BotonConfirmarStudentComponent],
  templateUrl: './student-create-form.component.html',
  styleUrl: './student-create-form.component.scss'
})
export class StudentCreateFormComponent {

  /**
   * Evento emitido cuando el estudiante se ha creado correctamente.
   * Incluye los datos del estudiante creado.
   */
  @Output() studentCreated = new EventEmitter<Student>();

  /**
   * Evento emitido cuando el usuario cancela la creación.
   */
  @Output() cancelCreate = new EventEmitter<void>();

   /**
   * Formulario reactivo con los campos necesarios para crear un estudiante.
   */
  createForm: FormGroup;

  /**
   * Indica si la petición de creación está en curso.
   */
  isCreating = false;

    /**
   * Mensaje de error a mostrar si la creación falla o el estudiante ya existe.
   */
  errorMessage = '';

  /** Indica si el formulario es válido */
  public validForm = false;


    /**
   * Inicializa el componente.
   * @param fb - FormBuilder de Angular para construir el formulario reactivo
   * @param studentService - Servicio que gestiona las operaciones con estudiantes
   * @param fireBaseAuth - Instancia de Firebase Authentication para crear el usuario
   * @param passwordGen - Servicio que genera la contraseña aleatoria del nuevo usuario
   * @param selectedStudentService - Servicio que almacena el estudiante seleccionado tras la creación
   */
  constructor(
    private fb: FormBuilder,
    private studentService: StudentsServiceService,
    private fireBaseAuth: Auth,
    private passwordGen: PasswordServiceService,
    private selectedStudentService: SelectedStudentServiceService
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
   * @returns Observable con los datos del estudiante creado.
   */
  createStudent(): Observable<Student> {
    const email = this.createForm.value.email;
    const password = this.passwordGen.generateRandomPassword();

    this.isCreating = true;

    return from(createUserWithEmailAndPassword(this.fireBaseAuth, email, password)).pipe(
      switchMap(credential => {
        const firebaseUID = credential.user.uid;

        const studentData = {
          email,
          name: this.createForm.value.name,
          surname: this.createForm.value.surname,
          ndSurname: this.createForm.value.ndSurname,
          birthDate: this.createForm.value.birthDate,
          dni: this.createForm.value.dni,
          firebaseUID,
        };

        return this.studentService.createStudent(studentData).pipe(
          map(response => response.data)
        );
      }),
      finalize(() => {
        this.isCreating = false;
      })
    );
  }

  /**
   * Valida el formulario, comprueba si el estudiante ya existe por DNI
   * y ejecuta la creación si todo es correcto.
   * Si el estudiante ya existe, muestra un mensaje de error sin realizar la creación.
   */
  onSubmit() {
    if (this.createForm.invalid) return;
    
    const formValue = this.createForm.value;
    const dni = formValue.dni;

    // 1️⃣ comprobar existencias
    const exists = this.studentService.students().some(
      student => student.dni === dni
    );

    // 2️⃣ si existe → avisar y return
    if (exists) {
      console.log('estudiante existente');
      this.errorMessage = 'Estudiante existente. Matricular desde estudiante existente.';
      return;
    }

    this.createStudent().subscribe({
      next: (createdStudent) => {
        console.log('✅ Estudiante creado: ', createdStudent);

        //  guardar en signal global
        this.selectedStudentService.setSelectedStudent(createdStudent);

        //  avisar al padre
        this.studentCreated.emit(createdStudent);
      },
      error: (err) => {
        console.error('❌ Error al crear estudiante:', err);
        this.errorMessage = 'Error al crear el estudiante';
      }
    });
  }

  /**
   * Emite el evento cancelCreate para cerrar el formulario sin guardar cambios.
   */
  onCancel() {
    this.cancelCreate.emit();
  }
}

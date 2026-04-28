import { Component, EventEmitter, Output } from '@angular/core';
import { Student } from '../../../../../core/models/student';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentsService } from '../../../../../core/services/admin/entities/students.service';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { PasswordService } from '../../../../../core/services/password.service';
import { BotonConfirmarStudentComponent } from "../../../botones/boton-confirmar-student/boton-confirmar-student.component";
import { SelectedStudentService } from '../../../../../core/services/admin/selected-student.service';
import { Observable } from 'rxjs';

/**
 * Componente que gestiona el formulario de creación de un nuevo estudiante.
 * Crea el usuario en Firebase Authentication y posteriormente lo registra
 * en el backend con los datos del formulario.
 * Genera una contraseña aleatoria para el nuevo usuario mediante el PasswordService.
 */
@Component({
  selector: 'app-student-create-form',
  imports: [ReactiveFormsModule, BotonConfirmarStudentComponent],
  templateUrl: './student-create-form.component.html',
  styleUrl: './student-create-form.component.scss'
})
export class StudentCreateFormComponent {

  /**
   * Evento emitido cuando the estudiante se ha creado correctamente.
   * Incluye los datos del estudiante creado.
   */
  @Output() studentCreated = new EventEmitter<Student>();

  /**
   * Evento emitido cuando el usuario cancela la creación.
   */
  @Output() cancelCreate = new EventEmitter<void>();

    /**
   * Contraseña generada temporalmente para el nuevo usuario.
   * Pendiente de revisar su gestión y almacenamiento.
   */
  contrasenatruquillo = '';

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

   /**
   * Indica si el formulario es válido.
   */
  validForm = false;


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
    private studentService: StudentsService,
    private fireBaseAuth: Auth,
    private passwordGen: PasswordService,
    private selectedStudentService: SelectedStudentService
  ) {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      ndSurname: ['', Validators.required],
      birthDate: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]$/)]]
    });
  }

  /**
   * Crea el usuario en Firebase Authentication y lo registra en el backend.
   * Genera una contraseña aleatoria para Firebase y usa el UID resultante
   * para completar el registro en el backend.
   * ATENCIÓN: usa new Observable() como antipatrón, pendiente de refactorizar con from().
   * @returns Observable con los datos del estudiante creado
   */
  createStudent(): Observable<Student> {
  const email = this.createForm.value.email;
  const password = this.passwordGen.generateRandomPassword();

  console.log(password);
  this.contrasenatruquillo = password;

  this.isCreating = true;

  return new Observable<Student>((observer) => {
    createUserWithEmailAndPassword(this.fireBaseAuth, email, password)
      .then(credential => {
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

        this.studentService.createStudent(studentData).subscribe({
          next: (createdStudent) => {
            this.isCreating = false;
            observer.next(createdStudent.data);
            observer.complete();
          },
          error: (err) => {
            this.isCreating = false;
            observer.error(err);
          }
        });
      })
      .catch(err => {
        this.isCreating = false;
        observer.error(err);
      });
  });
}

 /**
   * Valida el formulario, comprueba si el estudiante ya existe por DNI
   * y ejecuta la creación si todo es correcto.
   * Si el estudiante ya existe muestra un mensaje de error sin crear.
   */
  onSubmit() {
    if (this.createForm.invalid) return;
    //this.createStudent();
      const formValue = this.createForm.value;
      const dni = formValue.dni;

  // 1️⃣ comprobar existencias
    const exists = this.studentService.students().some(
    student => student.dni === dni
  );

  // 2️⃣ si existe → avisar y return
  if (exists) {
    console.log('estudiante existente');
    this.errorMessage = 'Estudiante existente matricular desde estudiante existente';
    return;
  } 
   this.createStudent().subscribe({
    next: (createdStudent) => {
      console.log('✅ Estudiante creado: ', createdStudent);
      console.log('Contraseña: ' , this.contrasenatruquillo);

      // 3️⃣ guardar en signal global
      this.selectedStudentService.setSelectedStudent(createdStudent);

      // 4️⃣ avisar al padre (si lo necesitas)
      this.studentCreated.emit(createdStudent);

      // 5️⃣ aquí NO cambiamos modo (eso lo hace el padre)
    },
    error: (err) => {
      console.error('❌ Error al crear estudiante:', err);
      this.errorMessage = 'Error al crear el estudiante';
    }
  });
  

  
  }

  /**
   * Emite el evento cancelCreate para cerrar el formulario sin guardar.
   */
  onCancel() {
    this.cancelCreate.emit();
  }

  /**getError(control: string) {
    switch (control) {
      case 'email':
        if (this.formRegister.controls.email.errors != null &&
          Object.keys(this.formRegister.controls.email.errors).includes('required'))
          return 'El campo email es requerido';
        else if (this.formRegister.controls.email.errors != null &&
          Object.keys(this.formRegister.controls.email.errors).includes('email'))
          return 'El email no es correcto';
        break;
      case 'password':
        if (this.formRegister.controls.password.errors != null &&
          Object.keys(this.formRegister.controls.password.errors).includes('required'))
          return 'El campo contraseña es requerido';
        else if (this.formRegister.controls.password.errors != null &&
          Object.keys(this.formRegister.controls.password.errors).includes('minlength'))
          return 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'name':
        if (this.formRegister.controls.name.errors != null &&
          Object.keys(this.formRegister.controls.name.errors).includes('required'))
          return 'El campo nombre es requerido';
        break;
      case 'surname':
        if (this.formRegister.controls.surname.errors != null &&
          Object.keys(this.formRegister.controls.surname.errors).includes('required'))
          return 'El campo apellido es requerido';
        break;
      case 'birthDate':
        if (this.formRegister.controls.birthDate.errors != null &&
          Object.keys(this.formRegister.controls.birthDate.errors).includes('required'))
          return 'La fecha de nacimiento es requerida';
        break;
      case 'dni':
        if (this.formRegister.controls.dni.errors != null &&
          Object.keys(this.formRegister.controls.dni.errors).includes('required'))
          return 'El DNI es requerido';
        break;
      default:
        return '';
    }
    return '';
  } */
}

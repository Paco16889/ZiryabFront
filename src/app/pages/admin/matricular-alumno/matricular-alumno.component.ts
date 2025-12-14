import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-matricular-alumno',
  imports: [ReactiveFormsModule],
  templateUrl: './matricular-alumno.component.html',
  styleUrl: './matricular-alumno.component.scss'
})
export class MatricularAlumnoComponent implements OnInit {






  formRegister!: FormGroup;
subjects: any;//asignaturas en el ciclo que se va a matricular

 

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      ndSurname: [''],
      birthDate: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]],
      role: ['student', Validators.required],
      groupId: ['', Validators.required],
      subjectIds: new FormArray([], Validators.required),
      registrationDate: [new Date().toISOString().substring(0,10), Validators.required]
    });
  }

  onSubjectChange(event: any, subjectId: number) {
    const subjectIds: FormArray = this.formRegister.get('subjectIds') as FormArray;
    if (event.target.checked) {
      subjectIds.push(new FormControl(subjectId));
    } else {
      const index = subjectIds.controls.findIndex(x => x.value === subjectId);
      if (index >= 0) subjectIds.removeAt(index);
    }
  }

   onSubmit(): void {
    if (this.formRegister.valid) {
      const studentData = {
        ...this.formRegister.value,
        birthDate: new Date(this.formRegister.value.birthDate)
      };

      console.log('Datos del estudiante:', studentData);
      // Aquí harías la llamada al servicio para registrar
      // this.studentService.register(studentData).subscribe(...)
    } else {
      this.formRegister.markAllAsTouched();
    }
  }
}

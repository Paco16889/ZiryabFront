import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/admin/entities/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {

  @Input() idTeacherAssignment!: number; // Necesario para crear la tarea en la asignatura correcta
  @Input() schoolYear: string = '2024-2025'; // Año escolar actual

  @Output() taskCreated = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;
  selectedFile: File | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      type: ['HOMEWORK', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Validar límite (10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'El archivo supera el límite de 10 MB.';
        this.selectedFile = null;
        event.target.value = '';
        return;
      }
      this.errorMessage = '';
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // ¡CRUCIAL! Cuando enviamos archivos, no podemos usar JSON normal ({ key: value })
    // Tenemos que usar 'FormData', que es la forma nativa de HTML para mandar paquetes con ficheros.
    const formData = new FormData();
    const formValues = this.taskForm.value;

    // Empaquetamos los datos de texto
    formData.append('title', formValues.title);
    formData.append('description', formValues.description);
    formData.append('type', formValues.type);
    formData.append('startDate', new Date(formValues.startDate).toISOString());
    formData.append('dueDate', new Date(formValues.dueDate).toISOString());
    formData.append('schoolYear', this.schoolYear);
    formData.append('idTeacherAssignment', this.idTeacherAssignment.toString());
    formData.append('isPublished', 'true');

    // Y aquí viene la magia: Si el profe seleccionó un archivo, lo empaquetamos bajo el nombre 'file'
    // Este nombre 'file' ES EL MISMO que espera multer en Node: uploadTaskAttachment.single('file')
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.taskService.createTask(formData as any).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Tarea creada con éxito con su fichero adjunto.';
        this.taskForm.reset({ type: 'HOMEWORK' });
        this.selectedFile = null;
        this.taskCreated.emit(response.data);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al crear la tarea.';
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/profesor/task.service';
import { CreateTaskResponse, Task } from '../../../core/models/teacher/tasks';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {

  @Input() idTeacherAssignment!: number;
  @Input() schoolYear: string = '2024-2025';

  @Output() taskCreated = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;
  selectedFile: File | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      type: ['HOMEWORK', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file: File = input.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'El archivo supera el límite de 10 MB.';
        this.selectedFile = null;
        input.value = '';
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

    const formData = new FormData();
    const formValues = this.taskForm.value;

    formData.append('title', formValues.title);
    formData.append('description', formValues.description);
    formData.append('type', formValues.type);
    formData.append('startDate', new Date(formValues.startDate).toISOString());
    formData.append('dueDate', new Date(formValues.dueDate).toISOString());
    formData.append('schoolYear', this.schoolYear);
    formData.append('idTeacherAssignment', this.idTeacherAssignment.toString());
    formData.append('isPublished', 'true');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.taskService.createTask(formData).subscribe({
      next: (response: CreateTaskResponse) => {
        this.loading = false;
        this.successMessage = 'Tarea creada con éxito con su fichero adjunto.';
        this.taskForm.reset({ type: 'HOMEWORK' });
        this.selectedFile = null;
        this.taskCreated.emit(response.data);
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al crear la tarea.';
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}

import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/profesor/task.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../core/i18n/api-error.util';
import { CreateTaskResponse, Task } from '../../../core/models/teacher/tasks';
import { TaskType } from '../../../core/models/task';
import {
  isTaskAttachmentFile,
  TASK_ATTACHMENT_FILE_ACCEPT,
} from '../../../core/configs/allowed-upload-mime';

/** Formulario de profesor para crear tareas con adjunto opcional. */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  protected readonly taskAttachmentAccept = TASK_ATTACHMENT_FILE_ACCEPT;

  /** Asignación docente donde se creará la tarea. */
  @Input() idTeacherAssignment!: number;
  /** Curso escolar asociado a la tarea. */
  @Input() schoolYear: string = '2024-2025';

  /** Emite la tarea creada al contenedor. */
  @Output() taskCreated = new EventEmitter<Task>();
  /** Cancela el formulario. */
  @Output() cancel = new EventEmitter<void>();

  /** Formulario de datos principales de tarea. */
  taskForm!: FormGroup;
  /** Archivo adjunto seleccionado por el profesor. */
  selectedFile: File | null = null;
  /** Estado de envío. */
  loading = false;
  /** Error visible. */
  errorMessage = '';
  /** Mensaje de éxito visible. */
  successMessage = '';

  /** Tipos de tarea con clave i18n para el selector. */
  readonly taskTypes = Object.values(TaskType).map((value) => ({
    value,
    labelKey: `taskTypes.${value}`,
  }));

  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);
  /** Servicio de tareas del profesor. */
  private readonly taskService = inject(TaskService);
  /** Traducciones de mensajes. */
  private readonly translate = inject(TranslateService);

  /** Inicializa el formulario con validaciones de longitud y fechas. */
  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      type: ['HOMEWORK', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  /** Valida el archivo adjunto y limita su tamaño a 10 MB. */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file: File = input.files[0];
    if (file) {
      if (!isTaskAttachmentFile(file)) {
        this.errorMessage = this.translate.instant('teacherPages.taskForm.errorInvalidFormat');
        this.selectedFile = null;
        input.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = this.translate.instant('teacherPages.taskForm.errorMaxSize');
        this.selectedFile = null;
        input.value = '';
        return;
      }
      this.errorMessage = '';
      this.selectedFile = file;
    }
  }

  /** Crea la tarea enviando FormData para soportar adjuntos. */
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
        this.successMessage = this.translate.instant('teacherPages.taskForm.successCreated');
        this.taskForm.reset({ type: 'HOMEWORK' });
        this.selectedFile = null;
        this.taskCreated.emit(response.data);
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading = false;
        this.errorMessage = resolveApiError(this.translate, err, 'common.errors.createTask');
      }
    });
  }

  /** Cancela la creación. */
  onCancel(): void {
    this.cancel.emit();
  }
}

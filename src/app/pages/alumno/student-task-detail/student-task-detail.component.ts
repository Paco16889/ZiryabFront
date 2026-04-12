import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentTaskService } from '../../../core/services/alumno/student-task.service';
import { StudentTask, SubmissionStatus } from '../../../core/models/studentTask';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

@Component({
  selector: 'app-student-task-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BotonAtrasComponent],
  templateUrl: './student-task-detail.component.html',
  styleUrls: ['./student-task-detail.component.scss']
})
export class StudentTaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentTaskService = inject(StudentTaskService);
  private fb = inject(FormBuilder);

  task = signal<StudentTask | null>(null);
  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  
  submissionMode = signal<'url' | 'file'>('file');
  selectedFile = signal<File | null>(null);
  isDragging = signal<boolean>(false);

  submitForm: FormGroup;
  isPastDueDate = signal<boolean>(false);

  SubmissionStatus = SubmissionStatus;

  constructor() {
    this.submitForm = this.fb.group({
      attachmentUrl: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadTask(parseInt(idParam, 10));
    } else {
      this.errorMessage.set('ID de tarea no proporcionado.');
      this.loading.set(false);
    }
  }

  loadTask(id: number): void {
    this.studentTaskService.getStudentTaskById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.task.set(res.data);
          this.checkDueDate(res.data);
        } else {
          this.errorMessage.set('No se pudo cargar la tarea.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al cargar la tarea detallada.');
        this.loading.set(false);
      }
    });
  }

  checkDueDate(studentTask: StudentTask): void {
    const dueDate = new Date(studentTask.task.dueDate);
    const now = new Date();
    this.isPastDueDate.set(now > dueDate);

    if (studentTask.status !== SubmissionStatus.PENDING) {
      this.submitForm.disable(); 
    } else if (this.isPastDueDate()) {
      this.submitForm.enable(); 
    }
  }

  setSubmissionMode(mode: 'url' | 'file'): void {
    this.submissionMode.set(mode);
    this.errorMessage.set('');
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.task()?.status === SubmissionStatus.PENDING) {
      this.isDragging.set(true);
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    this.errorMessage.set('');

    if (this.task()?.status !== SubmissionStatus.PENDING) return;

    if (event.dataTransfer && event.dataTransfer.items.length > 0) {
      this.processDataTransferItems(event.dataTransfer.items);
    } else if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  processDataTransferItems(items: DataTransferItemList): void {
    const item = items[0];
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry();
      if (entry && entry.isDirectory) {
        this.errorMessage.set('Las carpetas enteras no están permitidas. Por favor, comprímela a .ZIP haciendo "Click Derecho -> Comprimir".');
        this.selectedFile.set(null);
      } else {
        const file = item.getAsFile();
        if (file) this.processFile(file);
      }
    }
  }

  processFile(file: File): void {
    // Si pesa 0 (o no tiene punto) es muy probable que sea una carpeta en file system OS antiguos
    if (file.size === 0 || (!file.type && file.name.indexOf('.') === -1)) {
      this.errorMessage.set('Las carpetas enteras no están permitidas por seguridad. Por favor, comprímela a un solo archivo .ZIP');
      this.selectedFile.set(null);
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      this.errorMessage.set('El archivo supera los 50 MB de peso máximo permitido.');
      this.selectedFile.set(null);
      return;
    }

    this.selectedFile.set(file);
    this.errorMessage.set('');
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.errorMessage.set('');
  }

  onSubmit(): void {
    const t = this.task();
    if (!t) return;

    this.errorMessage.set('');
    this.successMessage.set('');

    const mode = this.submissionMode();
    const formValue = this.submitForm.value;

    if (mode === 'url') {
      if (!formValue.attachmentUrl || formValue.attachmentUrl.trim() === '') {
        this.errorMessage.set('Debes proveer una URL.');
        return;
      }
      this.finalizeSubmission(t.id, formValue.attachmentUrl);
    } else {
      if (!this.selectedFile()) {
        this.errorMessage.set('Debes seleccionar o arrastrar un archivo / ZIP.');
        return;
      }
      
      this.submitting.set(true);
      this.studentTaskService.uploadSubmissionFile(this.selectedFile()!).subscribe({
        next: (res) => {
          if (res.success && res.data?.attachmentUrl) {
            this.finalizeSubmission(t.id, res.data.attachmentUrl);
          } else {
            this.errorMessage.set('El servidor procesó el archivo, pero no devolvió un enlace válido.');
            this.submitting.set(false);
          }
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Hubo un error internamente al subir el archivo al servidor.');
          this.submitting.set(false);
        }
      });
    }
  }

  private finalizeSubmission(taskId: number, url: string): void {
    this.submitting.set(true);
    this.studentTaskService.submitStudentTask(taskId, { attachmentUrl: url }).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage.set('La carga y entrega de tu tarea fue registrada con éxito.');
          this.task.set(res.data);
          this.submitForm.disable();
          this.selectedFile.set(null);
        }
        this.submitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Tu archivo fue subido pero falló la notificación de entrega a la BBDD.');
        this.submitting.set(false);
      }
    });
  }
}

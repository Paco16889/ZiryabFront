import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentTaskService } from '../../../core/services/alumno/student-task.service';
import { StudentTask, SubmissionStatus } from '../../../core/models/studentTask';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * Componente StudentTaskDetail
 * Gestiona la visualización del detalle de una tarea específica para el alumno.
 * Proporciona la interfaz para adjuntar archivos (vía drop o selector) o URLs
 * para realizar la entrega de la tarea, respetando las restricciones de bloqueo por fecha límite.
 */
@Component({
  selector: 'app-student-task-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BotonAtrasComponent, TranslateModule],
  templateUrl: './student-task-detail.component.html',
  styleUrls: ['./student-task-detail.component.scss']
})
export class StudentTaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentTaskService = inject(StudentTaskService);
  private fb = inject(FormBuilder);
  private translate = inject(TranslateService);

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
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    this.submitForm = this.fb.group({
      attachmentUrl: ['', [Validators.pattern(urlRegex)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadTask(parseInt(idParam, 10));
    } else {
      this.errorMessage.set(this.translate.instant('studentPages.taskDetail.errors.missingTaskId'));
      this.loading.set(false);
    }
  }

  /**
   * Carga los detalles de una tarea asignada basada en su ID.
   * Valida además si se ha excedido la fecha límite calculada con `checkDueDate`.
   * @param id Identificador de la tarea (StudentTask).
   */
  loadTask(id: number): void {
    this.studentTaskService.getStudentTaskById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.task.set(res.data);
          this.checkDueDate(res.data);
        } else {
          this.errorMessage.set(this.translate.instant('studentPages.taskDetail.errors.cannotLoadTask'));
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || this.translate.instant('studentPages.taskDetail.errors.loadTaskDetail'));
        this.loading.set(false);
      }
    });
  }

  /**
   * Comprueba si la fecha actual sobrepasa la fecha límite (`dueDate`) impuesta por el profesor.
   * Si es así, bloquea el formulario de entrega si este aún pendía de envío.
   * @param studentTask Tarea asignada a evaluar.
   */
  checkDueDate(studentTask: StudentTask): void {
    const dueDate = new Date(studentTask.task.dueDate);
    const now = new Date();
    this.isPastDueDate.set(now > dueDate);

    if (studentTask.status !== SubmissionStatus.PENDING) {
      this.submitForm.disable(); 
    } else {
      this.submitForm.enable(); 
    }
  }

  /**
   * Cambia la modalidad de entrega en la UI.
   * @param mode Modalidad, 'url' externa o 'file' físico local.
   */
  setSubmissionMode(mode: 'url' | 'file'): void {
    this.submissionMode.set(mode);
    this.errorMessage.set('');
  }

  /**
   * Manejador para el evento drag over.
   */
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

  /**
   * Manejadr para el evento drop. Procesa el archivo arrastrado y soltado.
   */
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

  /**
   * Manejador de selección clásica de archivos vía input type file.
   */
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
        this.errorMessage.set(this.translate.instant('studentPages.taskDetail.errors.foldersNotAllowedZip'));
        this.selectedFile.set(null);
      } else {
        const file = item.getAsFile();
        if (file) this.processFile(file);
      }
    }
  }

  /**
   * Valida formato lógico y peso de un archivo candidato antes de habilitar su subida.
   * @param file Archivo local.
   */
  processFile(file: File): void {
    // Si pesa 0 (o no tiene punto) es muy probable que sea una carpeta en file system OS antiguos
    if (file.size === 0 || (!file.type && file.name.indexOf('.') === -1)) {
      this.errorMessage.set(this.translate.instant('studentPages.taskDetail.errors.folderBlockedSecurity'));
      this.selectedFile.set(null);
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      this.errorMessage.set(this.translate.instant('studentPages.taskDetail.errors.maxFileSize'));
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

  /**
   * Ejecuta la subida final del archivo o URL de entrega asociándolo a la tarea.
   */
  onSubmit(): void {
    const t = this.task();
    if (!t) return;

    this.errorMessage.set('');
    this.successMessage.set('');

    const mode = this.submissionMode();
    const formValue = this.submitForm.value;

    if (mode === 'url') {
      if (!formValue.attachmentUrl || formValue.attachmentUrl.trim() === '') {
        this.errorMessage.set(this.translate.instant('studentPages.taskDetail.errors.urlRequired'));
        return;
      }
      this.finalizeSubmission(t.id, formValue.attachmentUrl);
    } else {
      if (!this.selectedFile()) {
        this.errorMessage.set(this.translate.instant('studentPages.taskDetail.errors.fileRequired'));
        return;
      }
      
      this.submitting.set(true);
      this.studentTaskService.uploadSubmissionFile(this.selectedFile()!).subscribe({
        next: (res) => {
          if (res.success && res.data?.attachmentUrl) {
            this.finalizeSubmission(t.id, res.data.attachmentUrl);
          } else {
            this.errorMessage.set(this.translate.instant('studentPages.taskDetail.errors.serverNoLink'));
            this.submitting.set(false);
          }
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || this.translate.instant('studentPages.taskDetail.errors.uploadServerError'));
          this.submitting.set(false);
        }
      });
    }
  }

  /**
   * Registra a nivel de base de datos la confirmación en firme de una entrega subida.
   * @param taskId ID de la tarea a marcar.
   * @param url URL resultante del adjunto o introducida por teclado.
   */
  private finalizeSubmission(taskId: number, url: string): void {
    this.submitting.set(true);
    this.studentTaskService.submitStudentTask(taskId, { attachmentUrl: url }).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage.set(this.translate.instant('studentPages.taskDetail.success.deliveryRegistered'));
          this.task.set(res.data);
          this.submitForm.disable();
          this.selectedFile.set(null);
        }
        this.submitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || this.translate.instant('studentPages.taskDetail.errors.deliveryNotifyFailed'));
        this.submitting.set(false);
      }
    });
  }

  /**
   * Permite que el estudiante anule su propia entrega para volver a mandarla.
   */
  unsubmitTask(): void {
    const t = this.task();
    if (!t) return;
    
    if (confirm(this.translate.instant('studentPages.taskDetail.confirmDeleteDelivery'))) {
      this.submitting.set(true);
      this.studentTaskService.unsubmitStudentTask(t.id).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.task.set(res.data);
            this.successMessage.set('');
            this.errorMessage.set('');
            this.submitForm.reset();
            this.selectedFile.set(null);
            this.submitForm.enable();
          }
          this.submitting.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || this.translate.instant('studentPages.taskDetail.errors.deleteDeliveryError'));
          this.submitting.set(false);
        }
      });
    }
  }
}

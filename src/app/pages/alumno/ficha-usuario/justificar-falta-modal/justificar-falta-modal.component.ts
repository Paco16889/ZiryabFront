import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AssistanceItem } from '../../../../core/models/assistance';
import { AssistanceService } from '../../../../core/services/alumno/assistance.service';

/**
 * Componente de modal para que el alumno pueda justificar una falta de asistencia.
 * Permite seleccionar un archivo (PDF, JPG, PNG) y enviarlo mediante el AssistanceService.
 */
@Component({
  selector: 'app-justificar-falta-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './justificar-falta-modal.component.html'
})
export class JustificarFaltaModalComponent {
  /** Objeto de asistencia que se desea justificar */
  @Input() falta: AssistanceItem | null = null;
  /** Evento emitido para cerrar el modal sin guardar cambios */
  @Output() closeModal = new EventEmitter<void>();
  /** Evento emitido cuando el justificante se ha enviado correctamente */
  @Output() justifySuccess = new EventEmitter<number>();

  /** Servicio para gestionar las operaciones de asistencia */
  private assistanceService = inject(AssistanceService);

  /** Signal que almacena el archivo seleccionado por el usuario */
  public selectedFile = signal<File | null>(null);
  /** Signal que indica si se está realizando la petición de envío */
  public isSubmitting = signal<boolean>(false);
  /** Signal que indica si el envío ha sido exitoso */
  public isSuccess = signal<boolean>(false);
  /** Signal para almacenar mensajes de error durante el proceso */
  public errorMessage = signal<string>('');

  /**
   * Gestiona la selección de un archivo desde el input de tipo file.
   * Valida que el archivo no supere 1MB y que sea de un formato permitido (PDF, JPG, PNG).
   * @param event Evento de cambio del input file.
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // 1. Validar tamaño (max 1MB)
      const maxSizeInBytes = 1 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        this.errorMessage.set('El archivo no puede pesar más de 1 MB.');
        this.selectedFile.set(null);
        return;
      }

      // 2. Validar formato (PDF o imagenes)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage.set('El formato no es válido. Sube un PDF, JPG o PNG.');
        this.selectedFile.set(null);
        return;
      }

      // Archivo válido
      this.selectedFile.set(file);
      this.errorMessage.set('');
    }
  }

  /**
   * Envía el justificante seleccionado mediante el servicio de asistencia.
   * Tras un envío exitoso, muestra un mensaje de éxito y cierra el modal tras un retraso.
   */
  onSubmit(): void {
    if (!this.falta) return;
    if (!this.selectedFile()) {
      this.errorMessage.set('Por favor, selecciona un justificante válido.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.assistanceService.submitJustification(this.falta.id, this.selectedFile()!).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
        setTimeout(() => {
          this.justifySuccess.emit(this.falta!.id);
          this.closeModal.emit();
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Error al subir el justificante. Inténtalo de nuevo.');
        console.error(err);
      }
    });
  }

  /**
   * Cierra el modal emitiendo el evento closeModal, siempre que no se esté realizando un envío.
   */
  onClose(): void {
    if (!this.isSubmitting()) {
      this.closeModal.emit();
    }
  }
}

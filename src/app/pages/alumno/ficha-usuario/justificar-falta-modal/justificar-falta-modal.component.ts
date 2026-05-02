import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AssistanceItem } from '../../../../core/models/assistance';
import { AssistanceService } from '../../../../core/services/alumno/assistance.service';

@Component({
  selector: 'app-justificar-falta-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './justificar-falta-modal.component.html'
})
export class JustificarFaltaModalComponent {
  @Input() falta: AssistanceItem | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() justifySuccess = new EventEmitter<number>();

  private assistanceService = inject(AssistanceService);

  public selectedFile = signal<File | null>(null);
  public isSubmitting = signal<boolean>(false);
  public isSuccess = signal<boolean>(false);
  public errorMessage = signal<string>('');

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

  onSubmit(): void {
    if (!this.falta) return;
    if (!this.selectedFile()) {
      this.errorMessage.set('Por favor, selecciona un justificante válido.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // Simulando envio
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

  onClose(): void {
    if (!this.isSubmitting()) {
      this.closeModal.emit();
    }
  }
}

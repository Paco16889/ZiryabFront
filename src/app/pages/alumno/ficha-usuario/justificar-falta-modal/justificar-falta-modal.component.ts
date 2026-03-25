import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistanceItem } from '../../../../core/models/assistance';
import { AssistanceService } from '../../../../core/services/alumno/assistance.service';

@Component({
  selector: 'app-justificar-falta-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './justificar-falta-modal.component.html'
})
export class JustificarFaltaModalComponent {
  @Input() falta: AssistanceItem | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() justifySuccess = new EventEmitter<number>();

  public selectedFile = signal<File | null>(null);
  public isSubmitting = signal<boolean>(false);
  public isSuccess = signal<boolean>(false);
  public errorMessage = signal<string>('');

  constructor(private assistanceService: AssistanceService) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
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

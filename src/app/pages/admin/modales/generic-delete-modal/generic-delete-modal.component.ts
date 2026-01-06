import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-generic-delete-modal',
  imports: [TranslateModule],
  templateUrl: './generic-delete-modal.component.html',
  styleUrl: './generic-delete-modal.component.scss'
})
export class GenericDeleteModalComponent {
   @Input() entityType!: string; // "estudiante", "asignatura", "ciclo"
  @Input() entityName!: string; // El nombre específico (ej: "Juan Pérez")
  @Input() deleteFunction!: (id: number) => Observable<any>; // Función de delete del servicio
  @Input() entityId!: number; // ID de la entidad a borrar
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() entityDeleted = new EventEmitter<number>();

  isDeleting = false;
  showSuccess = false;
  errorMessage = '';

  onConfirmDelete() {
    this.isDeleting = true;
    this.errorMessage = '';

    this.deleteFunction(this.entityId).subscribe({
      next: (response) => {
        this.showSuccess = true;
        this.isDeleting = false;
        
        setTimeout(() => {
          this.entityDeleted.emit(this.entityId);
        }, 2000);
      },
      error: (err) => {
        this.isDeleting = false;
        this.errorMessage = err.error?.message || `Error al eliminar ${this.entityType}.`;
      }
    });
  }

  onClose() {
    this.closeModal.emit();
  }
}

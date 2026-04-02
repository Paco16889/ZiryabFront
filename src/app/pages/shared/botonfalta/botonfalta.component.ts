import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnrollmentStatus } from '../../../core/models/enrollment';

@Component({
  selector: 'app-botonfalta',
  imports: [],
  templateUrl: './botonfalta.component.html',
  styleUrl: './botonfalta.component.scss'
})
export class BotonfaltaComponent {
   @Input() statusType!: EnrollmentStatus;
  @Input() isActive: boolean = false;
  @Output() statusSelected = new EventEmitter<EnrollmentStatus>();

  get label(): string {
    switch (this.statusType) {
      case EnrollmentStatus.ENROLLED: return 'Presente';
      case EnrollmentStatus.EVALUATION_LOST: return 'Falta';
      case EnrollmentStatus.WITHDRAWN: return 'Justificada';
      default: return '';
    }
  }

  get colorClasses(): string {
    if (!this.isActive) return 'bg-gray-200 text-gray-600 hover:bg-gray-300';
    switch (this.statusType) {
      case EnrollmentStatus.ENROLLED: return 'bg-green-500 text-white';
      case EnrollmentStatus.EVALUATION_LOST: return 'bg-red-500 text-white';
      case EnrollmentStatus.WITHDRAWN: return 'bg-yellow-400 text-white';
      default: return '';
    }
  }

  onClick(): void {
    this.statusSelected.emit(this.statusType);
  }
}

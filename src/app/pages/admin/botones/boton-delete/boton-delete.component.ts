import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';

@Component({
  selector: 'app-boton-delete',
  imports: [],
  templateUrl: './boton-delete.component.html',
  styleUrl: './boton-delete.component.scss'
})
export class BotonDeleteComponent {
  @Input() id!: number;
  @Input() name!: string;
  @Input() type!: string;
  @Input() deleteFn!: (id: number) => Observable<any>;

  constructor(private deleteModalService: ModalDeleteServiceService) {}
  
  onClick() {
    // ✅ Llama al servicio directamente (sin @Output)
    this.deleteModalService.openModal({
      id: this.id,
      name: this.name,
      type: this.type,
      deleteFn: this.deleteFn
    });
  }
}

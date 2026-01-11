import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalEditServiceService } from '../../../../core/services/UI/modal-edit-service.service';
import { EditFieldConfig } from '../../../../core/configs/edit-modal-config';

@Component({
  selector: 'app-boton-edit',
  imports: [],
  templateUrl: './boton-edit.component.html',
  styleUrl: './boton-edit.component.scss'
})
export class BotonEditComponent {



  @Input() id!: number;
  @Input() name!: string;
  @Input() type!: string;
  @Input() entityData : any;
  @Input() fields: EditFieldConfig[] = [];
  @Input() updateFn!: (data: any) => Observable<any>;

  constructor(private updateModalService: ModalEditServiceService) {

  }

  onClick() {
      console.log('🔹 BotonEdit click', { id: this.id, name: this.name, entityData: this.entityData });

    this.updateModalService.openModal({
      id: this.id,
      name: this.name,
      type: this.type,
      updateFn: this.updateFn,
      entityData: this.entityData,
      fields: this.fields
    });
  }

  /*editField(str: string){
    console.log(`estas editando el campo ${str}.`);
  }*/
}

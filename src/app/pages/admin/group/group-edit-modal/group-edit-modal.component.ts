import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupByIdResponse, GroupUpdateRequest, GroupUpdateResponse } from '../../../../core/models/group';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupServiceService } from '../../../../core/services/admin/group-service.service';

@Component({
  selector: 'app-group-edit-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './group-edit-modal.component.html',
  styleUrl: './group-edit-modal.component.scss'
})
export class GroupEditModalComponent {
  @Input() group!: GroupByIdResponse['data'];
  @Output() closeModal = new EventEmitter<void>();
  @Output() groupUpdated = new EventEmitter<GroupUpdateResponse>();
  
  
  groupToUpdate!: GroupUpdateRequest;
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupServiceService
  ) {}

  ngOnInit(){
    this.editForm = this.fb.group({
      name: [this.group.name, Validators.required]
    });
  }

  onSubmit(){
    if(this.editForm.valid){
      this.groupToUpdate = {
        id : this.group.id,
        name : this.editForm.value.name
      }

          console.log('Datos a enviar:', this.groupToUpdate); // ← AÑADE ESTO

      this.groupService.updateGroup(this.groupToUpdate)
      .subscribe({
        next: (response) => {
          this.groupUpdated.emit(response);
        },
        error: (error) => console.error('Error al actualizar', error)
      });
    }
  }

  onClose(){
    this.closeModal.emit();
  }
}


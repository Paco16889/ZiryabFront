import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupServiceService } from '../../../../../core/services/admin/entities/group-service.service';

@Component({
  selector: 'app-group-create-form',
  imports: [ReactiveFormsModule],
  templateUrl: './group-create-form.component.html',
  styleUrl: './group-create-form.component.scss'
})
export class GroupCreateFormComponent {
  @Output() cancelCreate = new EventEmitter<void>();
  @Output() groupCreated = new EventEmitter<void>();

  createForm : FormGroup;
  isCreating = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private groupService: GroupServiceService
  ){
    this.createForm = this.fb.group({
      name: ['', Validators.required]
    });
  }
onSubmit() {
    if (this.createForm.valid) {
      this.isCreating = true;
      this.errorMessage = '';

      this.groupService.createGroup(this.createForm.value).subscribe({
        next: () => {
          this.groupCreated.emit();
        },
        error: (err) => {
          this.isCreating = false;
          this.errorMessage = err.error?.message || 'Error al crear el grupo';
        }
      });
    }
  }

  onCancel() {
    this.cancelCreate.emit();
  }

}


  

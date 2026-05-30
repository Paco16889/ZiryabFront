import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AssignmentSubstitutionsService } from '../../../../../core/services/admin/entities/assignment-substitutions.service';
import { TeacherTeachingContextService } from '../../../../../core/services/profesor/teacher-teaching-context.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { SubstitutionCloseFormComponent } from '../substitution-close-form/substitution-close-form.component';
import { SubstitutionCreateFormComponent } from '../substitution-create-form/substitution-create-form.component';
import { SubstitutionListItemComponent } from '../substitution-list-item/substitution-list-item.component';

type SubstitutionView = 'list' | 'create' | 'close';

/**
 * Listado admin de sustituciones docentes (menú `substitutions`).
 */
@Component({
  selector: 'app-substitution-list',
  standalone: true,
  imports: [
    SubstitutionListItemComponent,
    SubstitutionCreateFormComponent,
    SubstitutionCloseFormComponent,
    BotonCreateComponent,
    TranslateModule,
  ],
  templateUrl: './substitution-list.component.html',
  styleUrl: './substitution-list.component.scss',
})
export class SubstitutionListComponent implements OnInit {
  private readonly substitutionService = inject(AssignmentSubstitutionsService);
  private readonly teachingContext = inject(TeacherTeachingContextService);
  private readonly modalDeleteService = inject(ModalDeleteService);
  private readonly modalEditService = inject(ModalEditService);

  readonly view = signal<SubstitutionView>('list');
  readonly loading = this.substitutionService.loading;
  readonly loadError = this.substitutionService.loadError;

  readonly substitutions = this.substitutionService.substitutions;

  constructor() {
    effect(() => {
      const d = this.modalDeleteService.modalState();
      if (!d.isOpen && d.showSuccess) {
        this.substitutionService.loadSubstitutions();
      }
    });
    effect(() => {
      const u = this.modalEditService.modalState();
      if (!u.isOpen && u.showSuccess) {
        this.substitutionService.loadSubstitutions();
      }
    });
  }

  ngOnInit(): void {
    this.substitutionService.loadSubstitutions();
  }

  openCreate(): void {
    this.view.set('create');
  }

  openClose(): void {
    this.view.set('close');
  }

  backToList(): void {
    this.view.set('list');
  }

  onSubstitutionClosed(): void {
    this.backToList();
    this.teachingContext.invalidate();
    this.substitutionService.loadSubstitutions();
  }

  onSubstitutionCreated(): void {
    this.backToList();
    this.teachingContext.invalidate();
    this.substitutionService.loadSubstitutions();
  }
}

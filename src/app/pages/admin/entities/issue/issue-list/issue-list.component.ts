import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Issue } from '../../../../../core/models/issue';
import { AdminIssueService } from '../../../../../core/services/admin/entities/issue.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { BotonAtrasComponent } from '../../../../shared/boton-atras/boton-atras.component';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { IssueCreateFormComponent } from '../issue-create-form/issue-create-form.component';
import { IssueListItemComponent } from '../issue-list-item/issue-list-item.component';

/**
 * Listado admin del tablón de anuncios (patrón task-list, CURSO-125/127).
 */
@Component({
  selector: 'app-issue-list',
  imports: [
    IssueListItemComponent,
    IssueCreateFormComponent,
    BotonCreateComponent,
    BotonAtrasComponent,
    TranslateModule,
  ],
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.scss',
})
export class IssueListComponent implements OnInit {
  /** `admin`: panel del dashboard; `standalone`: ruta `/issues` (alumno/profesor). */
  readonly variant = signal<'admin' | 'standalone'>('admin');

  private readonly route = inject(ActivatedRoute);
  private readonly issueService = inject(AdminIssueService);
  private readonly authService = inject(AuthService);
  private readonly modalDeleteService = inject(ModalDeleteService);
  private readonly modalUpdateService = inject(ModalEditService);

  issues: Issue[] = [];
  showCreateForm = false;

  constructor() {
    effect(() => {
      this.issues = this.issueService.issues();
    });
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        this.issueService.loadIssues();
      }
    });
    effect(() => {
      const updateModalState = this.modalUpdateService.modalState();
      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        this.issueService.loadIssues();
      }
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.data['issueListVariant'] === 'standalone') {
      this.variant.set('standalone');
    }
    this.issueService.loadIssues();
  }

  canCreate(): boolean {
    const role = this.authService.getUserRole();
    return role === 'TEACHER' || role === 'ADMIN';
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  onIssueCreated(): void {
    this.closeCreateForm();
    this.issueService.loadIssues();
  }
}

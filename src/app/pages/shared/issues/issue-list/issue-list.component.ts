import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Issue } from '../../../../core/models/issue';
import { AuthService } from '../../../../core/services/auth.service';
import { IssueService } from '../../../../core/services/issue.service';
import { ModalDeleteService } from '../../../../core/services/UI/modal-delete.service';
import { BotonCreateComponent } from '../../../admin/botones/boton-create/boton-create.component';
import { BotonAtrasComponent } from '../../boton-atras/boton-atras.component';
import { IssueCardComponent } from '../issue-card/issue-card.component';
import { IssueDialogComponent } from '../issue-dialog/issue-dialog.component';

type IssueDialogMode = 'create' | 'edit';

/**
 * Listado del tablón de anuncios (CURSO-127 / historia CURSO-125).
 */
@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [
    IssueCardComponent,
    IssueDialogComponent,
    BotonCreateComponent,
    BotonAtrasComponent,
    TranslateModule,
  ],
  templateUrl: './issue-list.component.html',
  styleUrl: './issue-list.component.scss',
})
export class IssueListComponent implements OnInit {
  private readonly issueService = inject(IssueService);
  private readonly authService = inject(AuthService);
  private readonly modalDeleteService = inject(ModalDeleteService);

  readonly issues = this.issueService.issues;
  readonly loading = this.issueService.loading;

  dialogMode = signal<IssueDialogMode | null>(null);
  editingIssue = signal<Issue | null>(null);

  constructor() {
    effect(() => {
      const deleteState = this.modalDeleteService.modalState();
      if (!deleteState.isOpen && deleteState.showSuccess) {
        this.issueService.loadIssues();
      }
    });
  }

  ngOnInit(): void {
    this.issueService.loadIssues();
  }

  canCreate(): boolean {
    const role = this.authService.getUserRole();
    return role === 'TEACHER' || role === 'ADMIN';
  }

  openCreateDialog(): void {
    this.editingIssue.set(null);
    this.dialogMode.set('create');
  }

  openEditDialog(issue: Issue): void {
    this.editingIssue.set(issue);
    this.dialogMode.set('edit');
  }

  closeDialog(): void {
    this.dialogMode.set(null);
    this.editingIssue.set(null);
  }

  onDialogSaved(): void {
    this.closeDialog();
    this.issueService.loadIssues();
  }
}

import { DatePipe } from '@angular/common';
import { Component, HostListener, inject, input, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Issue, IssueAudience } from '../../../../core/models/issue';
import { AuthService } from '../../../../core/services/auth.service';
import { IssueService } from '../../../../core/services/issue.service';
import { ModalDeleteService } from '../../../../core/services/UI/modal-delete.service';

const AUDIENCE_I18N: Record<IssueAudience, string> = {
  CENTER: 'lists.issues.audience.CENTER',
  ALL_TEACHERS: 'lists.issues.audience.ALL_TEACHERS',
  ALL_STUDENTS: 'lists.issues.audience.ALL_STUDENTS',
  GROUP: 'lists.issues.audience.GROUP',
  COURSE: 'lists.issues.audience.COURSE',
  SUBJECT_GROUP: 'lists.issues.audience.SUBJECT_GROUP',
};

/**
 * Tarjeta de un anuncio del tablón (CURSO-127).
 */
@Component({
  selector: 'app-issue-card',
  standalone: true,
  imports: [TranslateModule, DatePipe],
  templateUrl: './issue-card.component.html',
  styleUrl: './issue-card.component.scss',
})
export class IssueCardComponent {
  private readonly authService = inject(AuthService);
  private readonly issueService = inject(IssueService);
  private readonly modalDeleteService = inject(ModalDeleteService);

  issue = input.required<Issue>();
  editIssue = output<Issue>();

  menuOpen = signal(false);

  audienceKey(audience: IssueAudience): string {
    return AUDIENCE_I18N[audience];
  }

  emitterLabel(): string {
    const item = this.issue();
    if (item.emitterType === 'ADMIN') {
      return 'lists.issues.emitterAdmin';
    }
    return 'lists.issues.emitterTeacher';
  }

  canManage(): boolean {
    const role = this.authService.getUserRole();
    const userId = this.authService.getUserId();
    if (!role || userId == null) {
      return false;
    }
    if (role === 'ADMIN') {
      return true;
    }
    const item = this.issue();
    if (role === 'TEACHER' && item.emitterType === 'TEACHER') {
      return item.emitterId === userId;
    }
    return false;
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenu();
  }

  onEdit(): void {
    this.closeMenu();
    this.editIssue.emit(this.issue());
  }

  onDelete(): void {
    this.closeMenu();
    const item = this.issue();
    this.modalDeleteService.openModal({
      id: item.id,
      name: item.title,
      type: 'el anuncio',
      deleteFn: (id) => this.issueService.deleteIssue(id),
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Group } from '../../../../../core/models/group';
import {
  SubjectTeacherAssignment,
  TeacherSubjectAssignmentRow,
} from '../../../../../core/models/teacher/subjectforteacher';
import { WeekScheduleAssignmentDataService } from '../../../../../core/services/admin/week-schedule-assignment-data.service';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';

/**
 * Desplegables del builder: grupo elegible → asignatura/docente → profesor de la franja.
 */
@Component({
  selector: 'app-week-schedule-builder-selects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './week-schedule-builder-selects.component.html',
  styleUrl: './week-schedule-builder-selects.component.scss',
})
export class WeekScheduleBuilderSelectsComponent implements OnInit {
  private readonly assignmentData = inject(WeekScheduleAssignmentDataService);
  private readonly teachersService = inject(TeachersService);

  /** Formulario padre (mismos `formControlName` en raíz). */
  readonly form = input.required<FormGroup>();

  readonly selectionsChanged = output<void>();

  readonly eligibleGroups = signal<Group[]>([]);
  readonly assignments = signal<TeacherSubjectAssignmentRow[]>([]);
  readonly peers = signal<SubjectTeacherAssignment[]>([]);

  readonly eligibleGroupsEmpty = signal(false);
  readonly assignmentsEmpty = signal(false);
  readonly peersEmpty = signal(false);
  readonly eligibleGroupsLoadFailed = signal(false);
  readonly assignmentsLoadFailed = signal(false);
  readonly peersLoadFailed = signal(false);

  ngOnInit(): void {
    this.teachersService.loadTeachers();
    this.loadEligibleGroups();
  }

  private loadEligibleGroups(): void {
    this.eligibleGroupsLoadFailed.set(false);
    this.assignmentData.fetchEligibleGroupsForNewSchedule().subscribe({
      next: (groups) => {
        this.eligibleGroups.set(groups);
        this.eligibleGroupsEmpty.set(groups.length === 0);
      },
      error: () => {
        this.eligibleGroupsLoadFailed.set(true);
        this.eligibleGroups.set([]);
      },
    });
  }

  onGroupChange(): void {
    this.selectionsChanged.emit();
    this.assignments.set([]);
    this.peers.set([]);
    this.assignmentsEmpty.set(false);
    this.peersEmpty.set(false);
    this.assignmentsLoadFailed.set(false);
    this.peersLoadFailed.set(false);
    this.form().patchValue({ assignmentId: null, peerAssignmentId: null });
    const groupId = this.form().controls['groupId'].value as number | null;
    if (groupId == null) {
      return;
    }
    this.assignmentData.fetchAssignmentRowsForGroup(groupId).subscribe({
      next: (rows) => {
        this.assignments.set(rows);
        this.assignmentsEmpty.set(rows.length === 0);
      },
      error: () => {
        this.assignmentsLoadFailed.set(true);
        this.assignments.set([]);
      },
    });
  }

  onAssignmentChange(): void {
    this.selectionsChanged.emit();
    this.peers.set([]);
    this.peersEmpty.set(false);
    this.peersLoadFailed.set(false);
    this.form().patchValue({ peerAssignmentId: null });
    const aid = this.form().controls['assignmentId'].value as number | null;
    const row = this.assignments().find((a) => a.id === aid);
    if (!row) {
      return;
    }
    this.assignmentData.fetchPeerAssignmentsForRow(row).subscribe({
      next: ({ peers, preferredPeerAssignmentId }) => {
        this.peers.set(peers);
        this.peersEmpty.set(peers.length === 0);
        this.form().patchValue({ peerAssignmentId: preferredPeerAssignmentId });
      },
      error: () => {
        this.peersLoadFailed.set(true);
        this.peers.set([]);
      },
    });
  }
}

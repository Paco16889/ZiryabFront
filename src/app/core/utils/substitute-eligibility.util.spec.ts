import { AssignmentStatus, AssignmentWithIncludes } from '../models/assingment';
import {
  buildSubstituteTeacherSelectOptions,
  countsTowardTeacherLoad,
  isTeacherEligibleByAssignmentLoad,
  teacherOwnLoadFromAssignments,
} from './substitute-eligibility.util';

describe('substitute-eligibility.util', () => {
  const assignment = (
    partial: Partial<AssignmentWithIncludes>,
  ): AssignmentWithIncludes =>
    ({
      id: 1,
      idSubject: 10,
      idGroup: 20,
      schoolYear: '2024-2025',
      subject: { id: 10, name: 'Prog', hours: 6 },
      ...partial,
    }) as AssignmentWithIncludes;

  it('counts STANDBY assignments toward load (seed/admin default)', () => {
    expect(
      countsTowardTeacherLoad(assignment({ status: AssignmentStatus.STANDBY })),
    ).toBeTrue();
    expect(
      countsTowardTeacherLoad(assignment({ status: AssignmentStatus.ACTIVE })),
    ).toBeTrue();
    expect(
      countsTowardTeacherLoad(assignment({ status: AssignmentStatus.ILLNESS })),
    ).toBeFalse();
  });

  it('sums load for teacher with STANDBY imparticiones', () => {
    const assignments = [
      assignment({ id: 1, idTeacher: 7, status: AssignmentStatus.STANDBY }),
      assignment({ id: 2, idTeacher: 7, status: AssignmentStatus.STANDBY }),
      assignment({ id: 3, idTeacher: 7, status: AssignmentStatus.STANDBY }),
    ];
    const load = teacherOwnLoadFromAssignments(assignments, 7);
    expect(load.ownAssignmentCount).toBe(3);
    expect(load.ownWeeklyHours).toBe(18);
  });

  it('excludes teacher over max assignments from picker', () => {
    const assignments = [
      assignment({ id: 1, idTeacher: 1, status: AssignmentStatus.STANDBY }),
      assignment({ id: 2, idTeacher: 1, status: AssignmentStatus.STANDBY }),
      assignment({ id: 3, idTeacher: 1, status: AssignmentStatus.STANDBY }),
    ];
    expect(
      isTeacherEligibleByAssignmentLoad(assignments, 1, {
        maxWeeklyHours: 10,
        maxActiveAssignments: 2,
      }),
    ).toBeFalse();
  });

  it('includes teacher with no assignments and excludes overloaded', () => {
    const assignments = [
      assignment({ id: 1, idTeacher: 99, status: AssignmentStatus.STANDBY }),
      assignment({ id: 2, idTeacher: 99, status: AssignmentStatus.STANDBY }),
      assignment({ id: 3, idTeacher: 99, status: AssignmentStatus.STANDBY }),
    ];
    const options = buildSubstituteTeacherSelectOptions(
      [
        { id: 5, label: 'Libre' },
        { id: 99, label: 'Cargado' },
      ],
      assignments,
      [],
      '2024-2025',
      null,
      { maxWeeklyHours: 10, maxActiveAssignments: 2 },
    );
    expect(options.map((o) => o.id)).toEqual([5]);
    expect(options[0].label).toContain('(0 h)');
  });
});

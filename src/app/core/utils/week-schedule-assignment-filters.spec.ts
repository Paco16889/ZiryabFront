import { AssignmentStatus } from '../models/assingment';
import { TeacherSubjectAssignmentRow } from '../models/teacher/subjectforteacher';
import {
  filterTeacherAssignmentsForSchoolYear,
  isTeacherAssignmentRowSchedulable,
} from './week-schedule-assignment-filters';

describe('week-schedule-assignment-filters', () => {
  const base = (over: Partial<TeacherSubjectAssignmentRow>): TeacherSubjectAssignmentRow => ({
    id: 1,
    idTeacher: 10,
    idSubject: 20,
    idGroup: 30,
    schoolYear: '2024-2025',
    subject: { id: 20, name: 'Prog' },
    group: { id: 30, name: '1DAM' },
    ...over,
  });

  it('isTeacherAssignmentRowSchedulable treats missing status as schedulable', () => {
    const row = base({});
    delete (row as { status?: string }).status;
    expect(isTeacherAssignmentRowSchedulable(row)).toBeTrue();
  });

  it('isTeacherAssignmentRowSchedulable accepts ACTIVE', () => {
    expect(
      isTeacherAssignmentRowSchedulable(base({ status: AssignmentStatus.ACTIVE })),
    ).toBeTrue();
  });

  it('isTeacherAssignmentRowSchedulable rejects non-ACTIVE', () => {
    expect(
      isTeacherAssignmentRowSchedulable(base({ status: AssignmentStatus.STANDBY })),
    ).toBeFalse();
  });

  it('filterTeacherAssignmentsForSchoolYear filters year and status', () => {
    const rows = [
      base({ id: 1, schoolYear: '2024-2025', status: AssignmentStatus.ACTIVE }),
      base({ id: 2, schoolYear: '2023-2024', status: AssignmentStatus.ACTIVE }),
      base({ id: 3, schoolYear: '2024-2025', status: AssignmentStatus.STANDBY }),
    ];
    const out = filterTeacherAssignmentsForSchoolYear(rows, '2024-2025');
    expect(out.map((r) => r.id)).toEqual([1]);
  });
});

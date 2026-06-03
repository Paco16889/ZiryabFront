import { AssignmentStatus, AssignmentWithIncludes } from '../models/assingment';
import {
  buildTeacherAssignmentLoadMap,
  collectAssignedTeacherIds,
  isEligibleForCourseAssignmentTeacherPicker,
  isTeacherWithinLoadLimits,
  isTeacherWithinWeeklyHoursLimit,
} from './course-assignment-teacher-load.util';

describe('course-assignment-teacher-load.util', () => {
  const assignment = (
    partial: Partial<AssignmentWithIncludes> & { idTeacher?: number },
  ): AssignmentWithIncludes =>
    ({
      id: 1,
      idSubject: 10,
      idGroup: 20,
      schoolYear: '2024-2025',
      status: AssignmentStatus.ACTIVE,
      subject: { id: 10, name: 'Prog', hours: 6 },
      ...partial,
    }) as AssignmentWithIncludes;

  it('sums hours per teacher from idTeacher and nested teacher.id', () => {
    const map = buildTeacherAssignmentLoadMap([
      assignment({ id: 1, idTeacher: 5 }),
      assignment({ id: 2, idTeacher: undefined, teacher: { id: 5, name: 'David', surname: 'Moreno' } }),
      assignment({ id: 3, idTeacher: 9, subject: { id: 11, name: 'BBDD', hours: 4 } }),
    ]);
    expect(map.get(5)).toEqual({ weeklyHours: 12, assignmentCount: 2 });
    expect(map.get(9)).toEqual({ weeklyHours: 4, assignmentCount: 1 });
  });

  it('excludes teacher over weekly hours from eligibility', () => {
    const map = buildTeacherAssignmentLoadMap([
      assignment({ id: 1, idTeacher: 1, subject: { id: 10, name: 'A', hours: 8 } }),
      assignment({ id: 2, idTeacher: 1, subject: { id: 11, name: 'B', hours: 5 } }),
    ]);
    const load = map.get(1)!;
    expect(isTeacherWithinLoadLimits(load, 10, 2)).toBeFalse();
    expect(isTeacherWithinLoadLimits(load, 15, 2)).toBeTrue();
  });

  it('includes teachers with no row in assignments even when others are over the cap', () => {
    const assignments = [
      assignment({ id: 1, idTeacher: 99, subject: { id: 10, name: 'A', hours: 12 } }),
    ];
    const assigned = collectAssignedTeacherIds(assignments);
    const loadMap = buildTeacherAssignmentLoadMap(assignments);
    expect(assigned.has(99)).toBeTrue();
    expect(assigned.has(5)).toBeFalse();
    expect(isEligibleForCourseAssignmentTeacherPicker(99, assigned, loadMap, 10)).toBeFalse();
    expect(isEligibleForCourseAssignmentTeacherPicker(5, assigned, loadMap, 10)).toBeTrue();
  });

  it('weekly-hours-only allows many assignments if total hours stay under cap', () => {
    const map = buildTeacherAssignmentLoadMap([
      assignment({ id: 1, idTeacher: 1, subject: { id: 10, name: 'A', hours: 3 } }),
      assignment({ id: 2, idTeacher: 1, subject: { id: 11, name: 'B', hours: 3 } }),
      assignment({ id: 3, idTeacher: 1, subject: { id: 12, name: 'C', hours: 3 } }),
    ]);
    const load = map.get(1)!;
    expect(isTeacherWithinLoadLimits(load, 10, 2)).toBeFalse();
    expect(isTeacherWithinWeeklyHoursLimit(load, 10)).toBeTrue();
  });
});

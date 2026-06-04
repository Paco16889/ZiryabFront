import { AssignmentStatus } from '../models/assingment';
import { TeacherSubjectAssignmentRow } from '../models/teacher/subjectforteacher';
import {
  assignedHoursPerSubjectFromSchedules,
  classHasRemainingSubjectHours,
  dedupeAssignmentRowsBySubject,
  filterAssignmentOptionsForCellBySubjectHours,
  filterTeacherAssignmentsForClass,
  filterTeacherAssignmentsForSchoolYear,
  isTeacherAssignmentRowSchedulable,
  wouldExceedSubjectHoursInCell,
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

  it('isTeacherAssignmentRowSchedulable accepts STANDBY (seed / admin alta)', () => {
    expect(
      isTeacherAssignmentRowSchedulable(base({ status: AssignmentStatus.STANDBY })),
    ).toBeTrue();
  });

  it('isTeacherAssignmentRowSchedulable rejects SUSPENDED', () => {
    expect(
      isTeacherAssignmentRowSchedulable(base({ status: AssignmentStatus.SUSPENDED })),
    ).toBeFalse();
  });

  it('filterAssignmentOptionsForCellBySubjectHours allows same subject until hours exhausted', () => {
    const rows = [
      base({ id: 1, idSubject: 20, subject: { id: 20, name: 'Prog', hours: 2 } }),
      base({ id: 2, idSubject: 21, subject: { id: 21, name: 'BBDD', hours: 1 } }),
    ];
    const options = dedupeAssignmentRowsBySubject(rows);
    const cells = new Map([
      [
        '1|08:00',
        {
          idSubject: 20,
          idTeacherAssignment: 1,
          startTime: '08:00',
          finishTime: '09:00',
        },
      ],
    ]);
    const forSecondSlot = filterAssignmentOptionsForCellBySubjectHours(
      options,
      cells,
      '1|09:00',
    );
    expect(forSecondSlot.some((r) => r.idSubject === 20)).toBeTrue();
    expect(forSecondSlot.some((r) => r.idSubject === 21)).toBeTrue();

    cells.set('1|09:00', {
      idSubject: 20,
      idTeacherAssignment: 1,
      startTime: '09:00',
      finishTime: '10:00',
    });
    const forThird = filterAssignmentOptionsForCellBySubjectHours(options, cells, '1|10:00');
    expect(forThird.some((r) => r.idSubject === 20)).toBeFalse();
    expect(forThird.some((r) => r.idSubject === 21)).toBeTrue();
  });

  it('dedupeAssignmentRowsBySubject keeps one row per idSubject', () => {
    const rows = [
      base({ id: 1, idSubject: 20, subject: { id: 20, name: 'Prog' } }),
      base({ id: 2, idSubject: 20, subject: { id: 20, name: 'Prog' } }),
      base({ id: 3, idSubject: 21, subject: { id: 21, name: 'BBDD' } }),
    ];
    const out = dedupeAssignmentRowsBySubject(rows);
    expect(out.length).toBe(2);
    expect(out.map((r) => r.idSubject).sort()).toEqual([20, 21]);
  });

  it('filterTeacherAssignmentsForClass matches idCourse when course include is missing', () => {
    const rows = [
      base({
        id: 1,
        subject: { id: 20, name: 'Base de datos', grade: '1º', idCourse: 5 } as TeacherSubjectAssignmentRow['subject'],
      }),
      base({
        id: 2,
        subject: { id: 21, name: 'Otra', grade: '1º', course: { id: 99, name: 'X' } },
      }),
    ];
    const out = filterTeacherAssignmentsForClass(rows, 5, '1', 30, '2024-2025');
    expect(out.map((r) => r.id)).toEqual([1]);
  });

  it('wouldExceedSubjectHoursInCell blocks placement beyond declared weekly hours', () => {
    const row = base({ idSubject: 20, subject: { id: 20, name: 'Prog', hours: 2 } });
    const cells = new Map([
      [
        '1|08:00',
        {
          idSubject: 20,
          idTeacherAssignment: 1,
          startTime: '08:00',
          finishTime: '09:00',
        },
      ],
      [
        '1|09:00',
        {
          idSubject: 20,
          idTeacherAssignment: 1,
          startTime: '09:00',
          finishTime: '10:00',
        },
      ],
    ]);

    expect(wouldExceedSubjectHoursInCell(row, cells, '1|10:00', '10:00', '11:00')).toBeTrue();

    const oneSlot = new Map([
      [
        '1|08:00',
        {
          idSubject: 20,
          idTeacherAssignment: 1,
          startTime: '08:00',
          finishTime: '09:00',
        },
      ],
    ]);
    expect(wouldExceedSubjectHoursInCell(row, oneSlot, '1|09:00', '09:00', '10:00')).toBeFalse();
  });

  it('dedupeAssignmentRowsBySubject does not truncate options below three subjects', () => {
    const rows = [1, 2, 3, 4, 5].map((id) =>
      base({ id, idSubject: id, subject: { id, name: `Asig ${id}` } }),
    );
    expect(dedupeAssignmentRowsBySubject(rows).length).toBe(5);
  });

  it('filterTeacherAssignmentsForSchoolYear filters year and status', () => {
    const rows = [
      base({ id: 1, schoolYear: '2024-2025', status: AssignmentStatus.ACTIVE }),
      base({ id: 2, schoolYear: '2023-2024', status: AssignmentStatus.ACTIVE }),
      base({ id: 3, schoolYear: '2024-2025', status: AssignmentStatus.STANDBY }),
      base({ id: 4, schoolYear: '2024-2025', status: AssignmentStatus.ILLNESS }),
    ];
    const out = filterTeacherAssignmentsForSchoolYear(rows, '2024-2025');
    expect(out.map((r) => r.id)).toEqual([1, 3]);
  });

  it('classHasRemainingSubjectHours is false when weekly hours are fully scheduled', () => {
    const rows = [
      base({
        idSubject: 20,
        subject: { id: 20, name: 'Prog', hours: 2 },
      }),
    ];
    const schedules = [
      {
        id: 1,
        weekDay: 1,
        startTime: '08:00',
        finishTime: '10:00',
        teacherAssignment: { id: 1, idTeacher: 10, idSubject: 20, idGroup: 30, schoolYear: '2024-2025', status: AssignmentStatus.ACTIVE },
      },
      {
        id: 2,
        weekDay: 2,
        startTime: '10:00',
        finishTime: '11:00',
        label: '1 DAM — Mañana',
        teacherAssignment: null,
      },
    ];
    expect(classHasRemainingSubjectHours(schedules, rows)).toBeFalse();
  });

  it('counts assigned hours when schedule assignment lacks idSubject but has assignment id', () => {
    const rows = [
      base({
        id: 99,
        idSubject: 20,
        subject: { id: 20, name: 'Prog', hours: 2 },
      }),
    ];
    const schedules = [
      {
        id: 1,
        weekDay: 1,
        startTime: '08:00',
        finishTime: '10:00',
        teacherAssignment: {
          id: 99,
          idTeacher: 10,
          idGroup: 30,
          schoolYear: '2024-2025',
          status: AssignmentStatus.ACTIVE,
        },
      },
    ];
    expect(classHasRemainingSubjectHours(schedules, rows)).toBeFalse();
  });

  it('classHasRemainingSubjectHours is true when a subject still has free hours', () => {
    const rows = [
      base({
        idSubject: 20,
        subject: { id: 20, name: 'Prog', hours: 4 },
      }),
    ];
    const schedules = [
      {
        id: 1,
        weekDay: 1,
        startTime: '08:00',
        finishTime: '10:00',
        teacherAssignment: { id: 1, idTeacher: 10, idSubject: 20, idGroup: 30, schoolYear: '2024-2025', status: AssignmentStatus.ACTIVE },
      },
    ];
    expect(classHasRemainingSubjectHours(schedules, rows)).toBeTrue();
  });
});

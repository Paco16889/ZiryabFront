import { AssignmentStatus } from '../models/assingment';
import { canTeacherBeTutorForGroup } from './tutor-assignment-rules.util';

describe('tutor-assignment-rules', () => {
  it('blocks tutor if teacher is already tutor in another group', () => {
    const existing = [
      {
        id: 1,
        idTeacher: 10,
        idSubject: 1,
        idGroup: 100,
        schoolYear: '2024-2025',
        status: 'ACTIVE' as AssignmentStatus,
        isTutor: true,
        teacher: { id: 10, name: 'Ana', surname: 'G' },
        group: { id: 100, name: 'Mañana' },
      },
    ];
    expect(canTeacherBeTutorForGroup(10, 200, existing, [])).toBeFalse();
  });

  it('allows tutor for same group or different teacher', () => {
    const existing = [
      {
        id: 1,
        idTeacher: 10,
        idSubject: 1,
        idGroup: 100,
        schoolYear: '2024-2025',
        status: 'ACTIVE' as AssignmentStatus,
        isTutor: true,
        teacher: { id: 10, name: 'Ana', surname: 'G' },
        group: { id: 100, name: 'Mañana' },
      },
    ];
    expect(canTeacherBeTutorForGroup(10, 100, existing, [])).toBeTrue();
    expect(canTeacherBeTutorForGroup(20, 200, existing, [])).toBeTrue();
  });

  it('blocks when pending rows mark same teacher tutor in another group', () => {
    expect(
      canTeacherBeTutorForGroup(10, 200, [], [
        { idTeacher: 10, idGroup: 100, isTutor: true },
      ]),
    ).toBeFalse();
  });
});

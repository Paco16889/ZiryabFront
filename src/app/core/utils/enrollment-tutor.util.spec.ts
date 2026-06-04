import { AssignmentStatus } from '../models/assingment';
import { resolveTutorIdForEnrollment } from './enrollment-tutor.util';

describe('enrollment-tutor.util', () => {
  const assignments = [
    {
      id: 1,
      idTeacher: 10,
      idSubject: 100,
      idGroup: 5,
      schoolYear: '2024-2025',
      status: AssignmentStatus.ACTIVE,
      isTutor: true,
    },
    {
      id: 2,
      idTeacher: 11,
      idSubject: 101,
      idGroup: 5,
      schoolYear: '2024-2025',
      status: AssignmentStatus.ACTIVE,
      isTutor: false,
    },
  ];

  it('devuelve el idTeacher de la asignación tutor que coincide', () => {
    expect(
      resolveTutorIdForEnrollment(assignments, 5, [100], '2024-2025'),
    ).toBe(10);
  });

  it('devuelve null si no hay tutor en el grupo/asignatura', () => {
    expect(
      resolveTutorIdForEnrollment(assignments, 5, [101], '2024-2025'),
    ).toBeNull();
  });
});

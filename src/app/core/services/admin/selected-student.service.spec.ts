import { SelectedStudentService } from './selected-student.service';

describe('SelectedStudentService', () => {
  let service: SelectedStudentService;

  const student = {
    id: 42,
    email: 'a@test.com',
    name: 'Ana',
    surname: 'López',
    ndSurname: 'García',
    birthDate: '2000-01-01',
    dni: '12345678A',
    firebaseUID: 'uid',
    role: 'STUDENT',
    createdAt: '2024-01-01',
  };

  const draft = {
    email: 'b@test.com',
    name: 'Bea',
    surname: 'Ruiz',
    ndSurname: 'Pérez',
    birthDate: '2001-02-02',
    dni: '87654321B',
  };

  beforeEach(() => {
    service = new SelectedStudentService();
  });

  it('stores pending draft without persisting (A)', () => {
    service.setPendingStudentDraft(draft);
    expect(service.pendingStudentDraft()).toEqual(draft);
    expect(service.selectedStudent()).toBeNull();
  });

  it('clearSelectedStudent resets draft and selected student', () => {
    service.setPendingStudentDraft(draft);
    service.clearSelectedStudent();
    expect(service.pendingStudentDraft()).toBeNull();
    expect(service.selectedStudent()).toBeNull();
  });

  it('setSelectedStudent clears pending draft', () => {
    service.setPendingStudentDraft(draft);
    service.setSelectedStudent(student);
    expect(service.pendingStudentDraft()).toBeNull();
    expect(service.selectedStudent()).toEqual(student);
  });
});

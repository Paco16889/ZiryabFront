import {
  formatStudentClassLevelSubtitle,
  formatTeacherClassCourseSubtitle,
  formatTeacherClassGroupSubtitle,
} from './class-card-subtitle.util';

describe('class-card-subtitle.util', () => {
  const subject = {
    grade: '1º',
    course: { name: 'DAM' },
  };

  it('formatStudentClassLevelSubtitle combina grade y course.name', () => {
    expect(formatStudentClassLevelSubtitle(subject)).toBe('1º — DAM');
  });

  it('formatStudentClassLevelSubtitle admite solo grade o solo ciclo', () => {
    expect(formatStudentClassLevelSubtitle({ grade: '2º' })).toBe('2º');
    expect(formatStudentClassLevelSubtitle({ course: { name: 'DAW' } })).toBe('DAW');
  });

  it('formatTeacherClassCourseSubtitle devuelve el ciclo', () => {
    expect(formatTeacherClassCourseSubtitle(subject)).toBe('DAM');
  });

  it('formatTeacherClassGroupSubtitle combina grado y grupo', () => {
    expect(formatTeacherClassGroupSubtitle(subject, { name: 'Mañana' })).toBe(
      '1º — Mañana',
    );
  });
});

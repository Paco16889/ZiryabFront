export interface StudentBySubject {
  enrollmentId: number;
  studentId: number;
  name: string;
  surname: string;
  groupId: number;
  groupName: string;
}

export interface StudentsBySubjectResponse {
  success: boolean;
  data: StudentBySubject[];
  message?: string;
}

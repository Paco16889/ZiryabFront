import type { TeacherSubjectAssignmentRow } from './subjectforteacher';

/** Asignación visible en el perfil del profesor (titular o sustituto activo). */
export interface TeacherAssignmentContextRow extends TeacherSubjectAssignmentRow {
  /** true cuando imparte en nombre del titular. */
  isSubstituting?: boolean;
  /** Nombre del titular para etiquetas en UI. */
  titularTeacherName?: string;
}

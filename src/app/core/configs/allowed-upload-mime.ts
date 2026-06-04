/** Justificantes de asistencia (alineado con backend `upload-mime.ts`). */
export const JUSTIFICATION_ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
] as const;

/** Adjuntos de tareas y entregas. */
export const TASK_ATTACHMENT_ALLOWED_TYPES = [
  ...JUSTIFICATION_ALLOWED_TYPES,
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.oasis.opendocument.text',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
] as const;

const EXTENSION_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  zip: 'application/zip',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  odt: 'application/vnd.oasis.opendocument.text',
  txt: 'text/plain',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ppt: 'application/vnd.ms-powerpoint',
};

export function resolveClientFileMime(file: File): string {
  const type = file.type?.trim().toLowerCase() ?? '';
  if (type && type !== 'application/octet-stream') {
    if (type === 'image/jpg' || type === 'image/pjpeg') return 'image/jpeg';
    return type;
  }
  const ext = file.name.split('.').pop()?.toLowerCase();
  return ext ? (EXTENSION_TO_MIME[ext] ?? type) : type;
}

export function isJustificationFile(file: File): boolean {
  const resolved = resolveClientFileMime(file);
  return (JUSTIFICATION_ALLOWED_TYPES as readonly string[]).includes(resolved);
}

export function isTaskAttachmentFile(file: File): boolean {
  const resolved = resolveClientFileMime(file);
  return (TASK_ATTACHMENT_ALLOWED_TYPES as readonly string[]).includes(resolved);
}

/** Valor del atributo `accept` en inputs de justificantes. */
export const JUSTIFICATION_FILE_ACCEPT =
  '.pdf,.png,.jpg,.jpeg,.webp,.gif,.heic,.heif,image/*,application/pdf';

/** Valor del atributo `accept` en inputs de tareas y entregas. */
export const TASK_ATTACHMENT_FILE_ACCEPT =
  '.pdf,.png,.jpg,.jpeg,.webp,.gif,.zip,.doc,.docx,.odt,.txt,.xls,.xlsx,.ppt,.pptx,image/*,application/pdf,application/zip';

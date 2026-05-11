/**
 * Expresión regular unificada para la validación de DNI y NIE en España.
 * - DNI: 8 dígitos seguidos de una letra.
 * - NIE: Una letra inicial (X, Y, Z), 7 dígitos y una letra final.
 */
export const DNI_NIE_PATTERN = /^([0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z])$/;

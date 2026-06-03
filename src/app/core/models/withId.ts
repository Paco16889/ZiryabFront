/**
 * Interfaz genérica que garantiza que una entidad posee un identificador numérico único.
 * Se utiliza como contrato mínimo cuando se necesita operar con cualquier entidad
 * del sistema que pueda ser identificada mediante su campo id.
 * @example
 * const entidad: WithId = {
 *   id: ID_ENTIDAD
 * };
 */
export interface WithId {
  /**Id */
  id: number;
}
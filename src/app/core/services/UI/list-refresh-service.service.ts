import { Injectable } from '@angular/core';

/**
 * Servicio encargado de gestionar la actualización de los listados de la interfaz.
 * Permite notificar a los componentes cuando deben refrescar sus datos tras una operación de borrado o edición.
 */
@Injectable({
  providedIn: 'root'
})
export class ListRefreshServiceService {

  /**
   * Inicializa el servicio sin dependencias externas.
   */
  constructor() { }
/*
   effect(() => {
      const modalState = this.modalDeleteService.modalState();
      console.log(
    '🧠 MODAL STATE:',
    'isOpen:', modalState.isOpen,
    'showSuccess:', modalState.showSuccess,
    'isDeleting:', modalState.isDeleting
  );*/
}

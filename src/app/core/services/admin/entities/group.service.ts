import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Group, GroupByIdResponse, GroupCreateRequest, GroupCreateResponse, GroupDeleteResponse, GroupsAllResponse, GroupUpdateRequest, GroupUpdateResponse } from '../../../models/group';

/**
 * Servicio encargado de gestionar las operaciones con grupos.
 * Incluye una signal para mantener el estado de los grupos en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class GroupService {

  /**
   * URL base del endpoint de grupos.
   */
  private readonly apiUrl = `${environment.apiUrl}/groups`;

    /**
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { }

  /**
   * Signal que almacena el listado de grupos en memoria.
   */
  groups = signal<Group[]>([]);


  /**
   * Obtiene todos los grupos.
   * @returns Observable con la respuesta que contiene el listado de grupos
   */
  getAllGroups(): Observable<GroupsAllResponse> {
    return this.http.get<GroupsAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    )
  }

   /**
    * Carga todos los grupos e inicializa la signal groups.
    * Si la petición falla, la signal se establece como array vacío.
    */
  loadGroups() {
    this.getAllGroups().subscribe(res => {
      if (res.success) {
        this.groups.set(res.data);
      } else {
        this.groups.set([]);
      }
    });
  }
 
  /**
   * Obtiene un grupo por su identificador.
   * @param id - Identificador único del grupo
   * @returns Observable con la respuesta que contiene el grupo encontrado
   */
  getGroupById(id: number): Observable<GroupByIdResponse> {
    return this.http.get<GroupByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      }));

  }

  /**
   * Crea un nuevo grupo.
   * @param group - Datos necesarios para crear el grupo
   * @returns Observable con la respuesta que contiene el grupo creado
   */
  createGroup(group: GroupCreateRequest): Observable<GroupCreateResponse> {
    return this.http.post<GroupCreateResponse>(`${this.apiUrl}`, group).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza un grupo existente.
   * @param group - Datos del grupo a actualizar, debe incluir el id
   * @returns Observable con la respuesta que contiene el grupo actualizado
   */
  updateGroup(group: GroupUpdateRequest): Observable<GroupUpdateResponse> {
    return this.http.patch<GroupUpdateResponse>(`${this.apiUrl}/${group.id}`, group).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un grupo por su identificador.
   * @param id - Identificador único del grupo a eliminar
   * @returns Observable con la respuesta de confirmación de eliminación
   */
  deleteGroup(id: number): Observable<GroupDeleteResponse> {
    return this.http.delete<GroupDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al borrar grupo', error);
        throw error;
      })
    )
  }
}

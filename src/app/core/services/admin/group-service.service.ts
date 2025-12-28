import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Group, GroupCreateRequest, GroupCreateResponse, GroupDeleteResponse, GroupUpdateRequest, GroupUpdateResponse } from '../../models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupServiceService {
   private apiUrl = 'http://localhost:3000/api/groups';
  constructor(private http: HttpClient) { }

  getGroups(): Observable<Group[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => ('data' in res ? res.data : res)),
      catchError(() => of([]))
    );
  }

  getGroupById(id: number): Observable<Group>{
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data ));
    
  }

  createGroup(group: GroupCreateRequest): Observable<GroupCreateResponse>{
    return this.http.post<GroupCreateResponse>(`${this.apiUrl}`, group);
  }

  updateGroup(group: GroupUpdateRequest): Observable<GroupUpdateResponse>{
    return this.http.patch<GroupUpdateResponse>(`${this.apiUrl}/${group.id}`, {name: group.name});
  }
  deleteGroup(id: number): Observable<GroupDeleteResponse>{
    return this.http.delete<GroupDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al borrar grupo', error);
        throw error;
      } )
    )
  }
}

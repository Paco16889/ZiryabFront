import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Group, GroupCreateRequest, GroupCreateResponse, GroupDeleteResponse, GroupsAllResponse, GroupUpdateRequest, GroupUpdateResponse } from '../../models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupServiceService {
   private apiUrl = 'http://localhost:3000/api/groups';
  constructor(private http: HttpClient) { }

  groups = signal<Group[]>([]);

  getAllGroups(): Observable<GroupsAllResponse> {
    return this.http.get<GroupsAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    )
  }

  loadGroups(){
    this.getAllGroups().subscribe(res => {
      if (res.success) {
        this.groups.set(res.data);
      } else {
        this.groups.set([]);
      }
    });
  }

  getGroupById(id: number): Observable<Group>{
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data ));
    
  }

  createGroup(group: GroupCreateRequest): Observable<GroupCreateResponse>{
    return this.http.post<GroupCreateResponse>(`${this.apiUrl}`, group);
  }

  updateGroup( group: GroupUpdateRequest): Observable<GroupUpdateResponse>{
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

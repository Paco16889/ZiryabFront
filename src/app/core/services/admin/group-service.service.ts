import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Group, GroupByIdResponse, GroupCreateRequest, GroupCreateResponse, GroupDeleteResponse, GroupsAllResponse, GroupUpdateRequest, GroupUpdateResponse } from '../../models/group';

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

  getGroupById(id: number): Observable<GroupByIdResponse>{
    return this.http.get<GroupByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
      console.error('Error:', error);
      throw error;
    }));
    
  }

  createGroup(group: GroupCreateRequest): Observable<GroupCreateResponse>{
    return this.http.post<GroupCreateResponse>(`${this.apiUrl}`, group).pipe(
      catchError((error) => {
      console.error('Error:', error);
      throw error;
    })
    );
  }

  updateGroup( group: GroupUpdateRequest): Observable<GroupUpdateResponse>{
    return this.http.patch<GroupUpdateResponse>(`${this.apiUrl}/${group.id}`, group).pipe(
      catchError((error) => {
      console.error('Error:', error);
      throw error;
    })
    );
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

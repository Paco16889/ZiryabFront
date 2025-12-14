import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable, catchError, map, of} from 'rxjs';
import { Teacher } from '../../models/teacher';


@Injectable({
  providedIn: 'root'
})
export class TeachersServiceService {
       private apiUrl = 'http://localhost:3000/api/teachers';

  constructor(private http: HttpClient) { }

  getTeachers(): Observable<Teacher[]>{
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => ('data' in res ? res.data: res)),
      catchError(() => of([]))
    );
  }
}

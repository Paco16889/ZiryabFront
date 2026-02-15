import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { WeekSchedule, WeekSchedulesAllResponse } from '../../../models/week-schedule';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeekScheduleServiceService {
  
//cambios para git

  private apiUrl = 'http://localhost:3000/api/horarios-semanales';

  constructor(private http: HttpClient) { }
  schedules = signal<WeekSchedule[]>([]);


   loadSchedules() {
    this.getAllSchedules().subscribe(res => {
      if (res.success) {
        this.schedules.set(res.data);
      } else {
        this.schedules.set([]);
      }
    });
  }


  getAllSchedules(): Observable<WeekSchedulesAllResponse>{
    return this.http.get<WeekSchedulesAllResponse>(this.apiUrl).pipe(
      catchError(() => of({success: false, data: [], count: 0}))
    );
  }

  deleteSchedule(id: number): any {
    throw new Error('Method not implemented.');
  }
  updateSchedule(id: any, data: any): any {
    throw new Error('Method not implemented.');
  }
  getWeekSchedulebyId(id: number): any {
    throw new Error('Method not implemented.');
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { WeekScheduleService } from '../../../core/services/admin/entities/services-for-week-schedule/week-schedule.service';
import { HorarioProfesorComponent } from './horario-profesor.component';

describe('HorarioProfesorComponent', () => {
  let component: HorarioProfesorComponent;
  let fixture: ComponentFixture<HorarioProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioProfesorComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: AuthService,
          useValue: { getUserId: () => 2 }
        },
        {
          provide: WeekScheduleService,
          useValue: {
            getSchedulesByTeacher: () => of({ success: true, data: [], count: 0 })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HorarioProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

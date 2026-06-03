import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { WeekScheduleService } from '../../../core/services/admin/entities/services-for-week-schedule/week-schedule.service';
import { HorarioAlumnoComponent } from './horario-alumno.component';

describe('HorarioAlumnoComponent', () => {
  let component: HorarioAlumnoComponent;
  let fixture: ComponentFixture<HorarioAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorarioAlumnoComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: AuthService,
          useValue: { getUserId: () => 1 }
        },
        {
          provide: WeekScheduleService,
          useValue: {
            getSchedulesByStudent: () => of({ success: true, data: [], count: 0 })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HorarioAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

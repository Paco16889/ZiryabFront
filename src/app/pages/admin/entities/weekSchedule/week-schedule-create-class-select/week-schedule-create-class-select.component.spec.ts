import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WeekScheduleClassItem } from '../../../../../core/models/week-schedule-flow/week-schedule-class.model';
import { WeekScheduleCreateClassSelectComponent } from './week-schedule-create-class-select.component';

describe('WeekScheduleCreateClassSelectComponent', () => {
  let component: WeekScheduleCreateClassSelectComponent;
  let fixture: ComponentFixture<WeekScheduleCreateClassSelectComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WeekScheduleCreateClassSelectComponent,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekScheduleCreateClassSelectComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  function expectClassesRequest() {
    return httpMock.expectOne(
      (req) =>
        req.url.includes('/horarios-semanales/classes') &&
        req.params.get('hasWeekSchedule') === 'false',
    );
  }

  it('should create', () => {
    expect(component).toBeTruthy();
    expectClassesRequest().flush({ success: true, count: 0, data: [] });
  });

  it('loads classes with hasWeekSchedule=false', () => {
    expectClassesRequest().flush({
      success: true,
      count: 2,
      data: [
        {
          label: '1º Ciclo de Prueba — Mañana',
          grade: '1',
          course: { id: 7, name: 'Ciclo de Prueba' },
          group: { id: 1, name: 'Mañana' },
          schoolYear: '2024-2025',
          subjectCount: 2,
          hasWeekSchedule: false,
        },
        {
          label: '2º DAM — Tarde',
          grade: '2',
          course: { id: 1, name: 'DAM' },
          group: { id: 2, name: 'Tarde' },
          schoolYear: '2024-2025',
          subjectCount: 0,
          hasWeekSchedule: false,
        },
      ],
    });
    fixture.detectChanges();
    expect(component.classesWithoutSchedule().length).toBe(1);
    expect(component.classesWithoutSchedule()[0].label).toBe('1º Ciclo de Prueba — Mañana');
  });
});

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

  it('should create', () => {
    expect(component).toBeTruthy();
    httpMock.expectOne((req) => req.url.includes('/horarios-semanales/classes')).flush({
      success: true,
      count: 0,
      data: [],
    });
  });

  it('filters eligible classes and emits selection', () => {
    httpMock.expectOne((req) => req.url.includes('/horarios-semanales/classes')).flush({
      success: true,
      count: 2,
      data: [
        {
          label: '1º ASIR — Mañana',
          grade: '1',
          course: { id: 1, name: 'ASIR' },
          group: { id: 10, name: 'Mañana' },
          schoolYear: '2025-2026',
          subjectCount: 3,
          hasWeekSchedule: false,
        },
        {
          label: '2º SMR — Tarde',
          grade: '2',
          course: { id: 2, name: 'SMR' },
          group: { id: 20, name: 'Tarde' },
          schoolYear: '2025-2026',
          subjectCount: 0,
          hasWeekSchedule: false,
        },
      ],
    });
    fixture.detectChanges();
    expect(component.eligibleClasses().length).toBe(1);

    const emitted: (WeekScheduleClassItem | null)[] = [];
    component.classChange.subscribe((c) => emitted.push(c));
    const key = component.classKey(component.eligibleClasses()[0]);
    component.onSelectChange(key);
    expect(emitted[0]?.label).toBe('1º ASIR — Mañana');
  });
});

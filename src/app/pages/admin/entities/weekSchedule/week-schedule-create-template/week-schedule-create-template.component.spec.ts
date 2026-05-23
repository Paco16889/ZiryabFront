import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WeekScheduleCreateTemplateComponent } from './week-schedule-create-template.component';

describe('WeekScheduleCreateTemplateComponent', () => {
  let component: WeekScheduleCreateTemplateComponent;
  let fixture: ComponentFixture<WeekScheduleCreateTemplateComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WeekScheduleCreateTemplateComponent,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekScheduleCreateTemplateComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock
      .expectOne((req) => req.url.includes('/horarios-semanales/classes'))
      .flush({ success: true, count: 0, data: [] });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts invalid until class and days are set', () => {
    expect(component.formValid()).toBeFalse();
    component.onWeekDaysChange([1, 2]);
    expect(component.formValid()).toBeFalse();
  });

  it('buildMaterializeRequest returns null when invalid', () => {
    expect(component.buildMaterializeRequest()).toBeNull();
  });

  it('shows validation after submit when form invalid', () => {
    component.onSubmit();
    expect(component.submitted()).toBeTrue();
    expect(component.showValidation()).toBeTrue();
  });

  it('posts materialize when form is valid', () => {
    component.onClassChange({
      label: '1º DAM — Mañana',
      grade: '1',
      course: { id: 1, name: 'DAM' },
      group: { id: 1, name: 'Mañana' },
      schoolYear: '2024-2025',
      subjectCount: 8,
      hasWeekSchedule: false,
    });
    component.onWeekDaysChange([1, 2, 3, 4, 5]);
    component.onSubmit();

    const req = httpMock.expectOne((r) => r.url.includes('/horarios-semanales/materialize'));
    expect(req.request.method).toBe('POST');
    req.flush({
      success: true,
      data: {
        label: '1º DAM — Mañana',
        schoolYear: '2024-2025',
        created: 30,
        weekDays: [1, 2, 3, 4, 5],
        slotCount: 6,
      },
    });

    expect(component.saveSuccess()).toBeTrue();
  });
});

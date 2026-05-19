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

  it('shows validation after comprobar click', () => {
    component.onSubmit();
    expect(component.submitted()).toBeTrue();
    expect(component.showValidation()).toBeTrue();
  });
});

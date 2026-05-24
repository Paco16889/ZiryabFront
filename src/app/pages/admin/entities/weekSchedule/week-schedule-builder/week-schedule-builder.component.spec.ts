import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { WeekScheduleNavigationService } from '../../../../../core/services/UI/week-schedule-navigation.service';
import { WeekScheduleBuilderComponent } from './week-schedule-builder.component';

describe('WeekScheduleBuilderComponent', () => {
  let component: WeekScheduleBuilderComponent;
  let fixture: ComponentFixture<WeekScheduleBuilderComponent>;
  let httpMock: HttpTestingController;
  let scheduleNav: jasmine.SpyObj<WeekScheduleNavigationService>;

  beforeEach(async () => {
    scheduleNav = jasmine.createSpyObj('WeekScheduleNavigationService', ['takePendingCreate']);
    scheduleNav.takePendingCreate.and.returnValue(null);

    await TestBed.configureTestingModule({
      imports: [
        WeekScheduleBuilderComponent,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [{ provide: WeekScheduleNavigationService, useValue: scheduleNav }],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekScheduleBuilderComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock
      .match((req) => req.url.includes('/horarios-semanales/classes'))
      .forEach((r) => r.flush({ success: true, count: 0, data: [] }));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults to create mode', () => {
    expect(component.builderMode()).toBe('create');
    expect(fixture.debugElement.query(By.css('app-week-schedule-create-template'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('app-week-schedule-grid-builder'))).toBeNull();
  });

  it('shows grid builder when grid tab is selected', () => {
    component.setBuilderMode('grid');
    fixture.detectChanges();
    expect(component.builderMode()).toBe('grid');
    expect(fixture.debugElement.query(By.css('app-week-schedule-grid-builder'))).not.toBeNull();
  });

  it('preselects create template class when navigation is pending', () => {
    scheduleNav.takePendingCreate.and.returnValue({
      idCourse: 5,
      grade: '1',
      idGroup: 42,
    });
    fixture = TestBed.createComponent(WeekScheduleBuilderComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpMock
      .match((req) => req.url.includes('/horarios-semanales/classes'))
      .forEach((r) => r.flush({ success: true, count: 0, data: [] }));

    expect(scheduleNav.takePendingCreate).toHaveBeenCalled();
    expect(component.builderMode()).toBe('create');
    expect(component.createPreselectClassKey()).toBe(
      `5|1|42|${environment.currentSchoolYear}`,
    );
  });

});

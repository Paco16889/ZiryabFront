import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { WeekScheduleBuilderComponent } from './week-schedule-builder.component';
describe('WeekScheduleBuilderComponent', () => {
  let component: WeekScheduleBuilderComponent;
  let fixture: ComponentFixture<WeekScheduleBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WeekScheduleBuilderComponent,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekScheduleBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults to create mode', () => {
    expect(component.builderMode()).toBe('create');
    expect(fixture.debugElement.query(By.css('app-week-schedule-grid-builder'))).toBeNull();
  });

  it('shows grid builder when grid tab is selected', () => {
    component.setBuilderMode('grid');
    fixture.detectChanges();
    expect(component.builderMode()).toBe('grid');
    expect(fixture.debugElement.query(By.css('app-week-schedule-grid-builder'))).not.toBeNull();
  });

  it('emits cancelCreate when back is clicked', () => {
    const spy = jasmine.createSpy('cancelCreate');
    component.cancelCreate.subscribe(spy);
    fixture.debugElement.query(By.css('button')).nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });
});

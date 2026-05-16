import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});

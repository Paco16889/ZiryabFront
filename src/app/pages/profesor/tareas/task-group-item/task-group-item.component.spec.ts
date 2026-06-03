import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskGroupItemComponent } from './task-group-item.component';

describe('TaskGroupItemComponent', () => {
  let component: TaskGroupItemComponent;
  let fixture: ComponentFixture<TaskGroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskGroupItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

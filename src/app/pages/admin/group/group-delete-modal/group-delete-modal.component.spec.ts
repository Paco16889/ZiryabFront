import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDeleteModalComponent } from './group-delete-modal.component';

describe('GroupDeleteModalComponent', () => {
  let component: GroupDeleteModalComponent;
  let fixture: ComponentFixture<GroupDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupViewDetailComponent } from './group-view-detail.component';

describe('GroupViewDetailComponent', () => {
  let component: GroupViewDetailComponent;
  let fixture: ComponentFixture<GroupViewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupViewDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

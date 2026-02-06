import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebadeGitComponent } from './pruebade-git.component';

describe('PruebadeGitComponent', () => {
  let component: PruebadeGitComponent;
  let fixture: ComponentFixture<PruebadeGitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebadeGitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PruebadeGitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

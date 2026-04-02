import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonfaltaComponent } from './botonfalta.component';

describe('BotonfaltaComponent', () => {
  let component: BotonfaltaComponent;
  let fixture: ComponentFixture<BotonfaltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonfaltaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonfaltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

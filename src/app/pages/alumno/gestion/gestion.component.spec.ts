import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GestionComponent } from './gestion.component';
import { AuthService } from '../../../core/services/auth.service';

describe('GestionComponent', () => {
  let component: GestionComponent;
  let fixture: ComponentFixture<GestionComponent>;
  const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
  const authServiceStub = {
    getUserRole: () => 'STUDENT'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

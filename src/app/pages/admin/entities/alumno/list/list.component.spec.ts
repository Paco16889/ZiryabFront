import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { signal } from '@angular/core';
import { StudentsService } from '../../../../../core/services/admin/entities/students.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: StudentsService,
          useValue: {
            students: signal([]),
            loadStudents: jasmine.createSpy('loadStudents'),
          },
        },
        {
          provide: ModalDeleteService,
          useValue: { modalState: signal({ isOpen: false, showSuccess: false }) },
        },
        {
          provide: ModalEditService,
          useValue: { modalState: signal({ isOpen: false, showSuccess: false }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows enrollment wizard when list is empty and form is open (EQ-316)', () => {
    component.students = [];
    component.showCreateForm = true;
    fixture.detectChanges();

    const enrollment = fixture.nativeElement.querySelector('app-student-enrollment');
    expect(enrollment).not.toBeNull();
  });
});
